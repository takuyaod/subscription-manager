"use server";

import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { subscriptions } from "@/db/schema";
import { getUserId } from "@/utils/get-user-id";

const subscriptionSchema = z.object({
  name: z.string().min(1, "サービス名は必須です"),
  amount: z.coerce.number().min(0, "金額は0以上で入力してください"),
  cycle: z.enum(["monthly", "yearly", "once"]),
  cycleInterval: z.coerce.number().int().min(1).default(1),
  billingDay: z.number().int().nullable(),
  paymentMethodId: z.string().min(1, "支払い元は必須です"),
  addressId: z.string().uuid().nullable(),
  isPhysical: z.boolean(),
  startDate: z.string().min(1, "開始日は必須です"),
  expiresAt: z.string().nullable(),
  memo: z.string().nullable(),
});

function parseFormData(formData: FormData) {
  const cycle = formData.get("cycle") as string;
  const isPhysical = formData.get("isPhysical") === "true";

  let billingDay: number | null = null;
  if (cycle === "monthly") {
    const val = formData.get("billingDayMonthly");
    billingDay = val ? parseInt(val as string) : null;
  } else if (cycle === "yearly") {
    const month = formData.get("billingMonth");
    const day = formData.get("billingDayYearly");
    if (month && day) {
      billingDay = parseInt(month as string) * 100 + parseInt(day as string);
    }
  }

  return subscriptionSchema.safeParse({
    name: formData.get("name"),
    amount: formData.get("amount"),
    cycle,
    cycleInterval: cycle !== "once" ? (formData.get("cycleInterval") || 1) : 1,
    billingDay,
    paymentMethodId: formData.get("paymentMethodId"),
    addressId: isPhysical ? (formData.get("addressId") || null) : null,
    isPhysical,
    startDate: formData.get("startDate"),
    expiresAt: cycle === "once" ? (formData.get("expiresAt") || null) : null,
    memo: formData.get("memo") || null,
  });
}

export async function createSubscription(formData: FormData) {
  const userId = await getUserId();
  const parsed = parseFormData(formData);

  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((i) => i.message).join(", "));
  }

  await db.insert(subscriptions).values({
    userId,
    name: parsed.data.name,
    amount: String(parsed.data.amount),
    currency: "JPY",
    cycle: parsed.data.cycle,
    cycleInterval: parsed.data.cycleInterval,
    billingDay: parsed.data.billingDay,
    paymentMethodId: parsed.data.paymentMethodId,
    addressId: parsed.data.addressId,
    isPhysical: parsed.data.isPhysical,
    status: "active",
    startDate: parsed.data.startDate,
    expiresAt: parsed.data.expiresAt,
    memo: parsed.data.memo,
  });

  revalidatePath("/subscriptions");
  redirect("/subscriptions");
}

export async function updateSubscription(id: string, formData: FormData) {
  const userId = await getUserId();
  const parsed = parseFormData(formData);

  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((i) => i.message).join(", "));
  }

  await db
    .update(subscriptions)
    .set({
      name: parsed.data.name,
      amount: String(parsed.data.amount),
      currency: "JPY",
      cycle: parsed.data.cycle,
      cycleInterval: parsed.data.cycleInterval,
      billingDay: parsed.data.billingDay,
      paymentMethodId: parsed.data.paymentMethodId,
      addressId: parsed.data.addressId,
      isPhysical: parsed.data.isPhysical,
      startDate: parsed.data.startDate,
      expiresAt: parsed.data.expiresAt,
      memo: parsed.data.memo,
    })
    .where(and(eq(subscriptions.id, id), eq(subscriptions.userId, userId)));

  revalidatePath("/subscriptions");
  redirect(`/subscriptions/${id}`);
}

export async function cancelSubscription(id: string) {
  const userId = await getUserId();

  const [existing] = await db
    .select({ status: subscriptions.status })
    .from(subscriptions)
    .where(and(eq(subscriptions.id, id), eq(subscriptions.userId, userId)))
    .limit(1);

  if (!existing || existing.status === "cancelled") return;

  await db
    .update(subscriptions)
    .set({ status: "cancelled", cancelledAt: new Date() })
    .where(and(eq(subscriptions.id, id), eq(subscriptions.userId, userId)));

  revalidatePath("/subscriptions");
  revalidatePath(`/subscriptions/${id}`);
}

export async function reactivateSubscription(id: string) {
  const userId = await getUserId();

  const [existing] = await db
    .select({ status: subscriptions.status })
    .from(subscriptions)
    .where(and(eq(subscriptions.id, id), eq(subscriptions.userId, userId)))
    .limit(1);

  if (!existing || existing.status === "active") return;

  await db
    .update(subscriptions)
    .set({ status: "active", cancelledAt: null })
    .where(and(eq(subscriptions.id, id), eq(subscriptions.userId, userId)));

  revalidatePath("/subscriptions");
  revalidatePath(`/subscriptions/${id}`);
}
