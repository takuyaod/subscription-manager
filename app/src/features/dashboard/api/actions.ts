"use server";

import { eq, and, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { subscriptions } from "@/db/schema";
import { getUserId } from "@/utils/get-user-id";
import { buildDashboardSummary, type DashboardSummary } from "../utils/calc-monthly-amount";

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const userId = await getUserId();

  const [rows, cancelledRows] = await Promise.all([
    db
      .select({
        id: subscriptions.id,
        name: subscriptions.name,
        amount: subscriptions.amount,
        cycle: subscriptions.cycle,
        cycleInterval: subscriptions.cycleInterval,
        expiresAt: subscriptions.expiresAt,
      })
      .from(subscriptions)
      .where(and(eq(subscriptions.userId, userId), eq(subscriptions.status, "active"))),
    db
      .select({ count: count() })
      .from(subscriptions)
      .where(and(eq(subscriptions.userId, userId), eq(subscriptions.status, "cancelled"))),
  ]);

  const summary = buildDashboardSummary(rows);
  return { ...summary, cancelledCount: cancelledRows[0]?.count ?? 0 };
}
