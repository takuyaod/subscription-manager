"use server";

import { eq, and, isNotNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { paymentMethods, subscriptions, addresses } from "@/db/schema";
import { getUserId } from "@/utils/get-user-id";
import type { DashboardAlert } from "../types/alert";

export async function getAlerts(): Promise<DashboardAlert[]> {
  const userId = await getUserId();
  const alerts: DashboardAlert[] = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const thirtyDaysLater = new Date(today);
  thirtyDaysLater.setDate(today.getDate() + 30);

  // Alert 1: Card expiry within 30 days (credit / postpay / linked)
  const allCards = await db
    .select({
      id: paymentMethods.id,
      nickname: paymentMethods.nickname,
      type: paymentMethods.type,
      expiryYear: paymentMethods.expiryYear,
      expiryMonth: paymentMethods.expiryMonth,
      parentId: paymentMethods.parentId,
    })
    .from(paymentMethods)
    .where(eq(paymentMethods.userId, userId));

  const cardMap = new Map(allCards.map((c) => [c.id, c]));

  for (const card of allCards) {
    if (card.type !== "credit" && card.type !== "postpay" && card.type !== "linked") continue;

    let expiryYear = card.expiryYear;
    let expiryMonth = card.expiryMonth;

    // For linked cards, fall back to parent's expiry if own is null
    if (card.type === "linked" && card.parentId && (expiryYear === null || expiryMonth === null)) {
      const parent = cardMap.get(card.parentId);
      if (parent) {
        expiryYear ??= parent.expiryYear;
        expiryMonth ??= parent.expiryMonth;
      }
    }

    if (expiryYear === null || expiryMonth === null) continue;

    // Last day of expiry month (expiryMonth is 1-based)
    const expiryDate = new Date(expiryYear, expiryMonth, 0);

    if (expiryDate >= today && expiryDate <= thirtyDaysLater) {
      alerts.push({ type: "card_expiry", id: card.id, nickname: card.nickname, expiryYear, expiryMonth });
    }
  }

  // Alert 2: Service expiry within 30 days (cycle: once)
  const onceRows = await db
    .select({
      id: subscriptions.id,
      name: subscriptions.name,
      expiresAt: subscriptions.expiresAt,
    })
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.userId, userId),
        eq(subscriptions.cycle, "once"),
        eq(subscriptions.status, "active"),
        isNotNull(subscriptions.expiresAt),
      ),
    );

  for (const sub of onceRows) {
    if (!sub.expiresAt) continue;
    const expiryDate = new Date(sub.expiresAt);
    if (expiryDate >= today && expiryDate <= thirtyDaysLater) {
      alerts.push({ type: "service_expiry", id: sub.id, name: sub.name, expiresAt: sub.expiresAt });
    }
  }

  // Alert 3: Active subscriptions linked to an inactive address
  const inactiveAddressRows = await db
    .select({
      subscriptionId: subscriptions.id,
      subscriptionName: subscriptions.name,
      addressId: addresses.id,
      addressLabel: addresses.label,
    })
    .from(subscriptions)
    .innerJoin(addresses, eq(subscriptions.addressId, addresses.id))
    .where(
      and(
        eq(subscriptions.userId, userId),
        eq(subscriptions.status, "active"),
        eq(addresses.isActive, false),
      ),
    );

  for (const row of inactiveAddressRows) {
    alerts.push({
      type: "address_inactive",
      subscriptionId: row.subscriptionId,
      subscriptionName: row.subscriptionName,
      addressId: row.addressId,
      addressLabel: row.addressLabel,
    });
  }

  return alerts;
}
