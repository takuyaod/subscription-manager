"use server";

import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { paymentMethods, subscriptions } from "@/db/schema";
import { getUserId } from "@/utils/get-user-id";
import { TYPES_WITH_EXPIRY, TYPES_WITH_BANK } from "@/features/payment-methods/utils/type-config";

const paymentMethodSchema = z.object({
  nickname: z.string().min(1, "ニックネームは必須です"),
  type: z.enum(["credit", "debit", "bank", "apple", "google", "linked", "postpay", "other"]),
  parentId: z.string().uuid().optional().nullable(),
  bankAccountId: z.string().uuid().optional().nullable(),
  expiryYear: z.coerce.number().int().min(2000).max(2099).optional().nullable(),
  expiryMonth: z.coerce.number().int().min(1).max(12).optional().nullable(),
  memo: z.string().optional().nullable(),
});

function parseFormData(formData: FormData) {
  const type = formData.get("type") as string;
  const hasExpiry = TYPES_WITH_EXPIRY.includes(type as (typeof TYPES_WITH_EXPIRY)[number]);
  const hasBank = TYPES_WITH_BANK.includes(type as (typeof TYPES_WITH_BANK)[number]);

  return paymentMethodSchema.safeParse({
    nickname: formData.get("nickname"),
    type,
    parentId: type === "linked" ? (formData.get("parentId") || null) : null,
    bankAccountId: hasBank ? (formData.get("bankAccountId") || null) : null,
    expiryYear: hasExpiry ? (formData.get("expiryYear") || null) : null,
    expiryMonth: hasExpiry ? (formData.get("expiryMonth") || null) : null,
    memo: formData.get("memo") || null,
  });
}

export async function createPaymentMethod(formData: FormData) {
  const userId = await getUserId();
  const parsed = parseFormData(formData);

  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((i) => i.message).join(", "));
  }

  await db.insert(paymentMethods).values({
    userId,
    nickname: parsed.data.nickname,
    type: parsed.data.type,
    parentId: parsed.data.parentId ?? null,
    bankAccountId: parsed.data.bankAccountId ?? null,
    expiryYear: parsed.data.expiryYear ?? null,
    expiryMonth: parsed.data.expiryMonth ?? null,
    memo: parsed.data.memo ?? null,
  });

  revalidatePath("/payment-methods");
  redirect("/payment-methods");
}

export async function updatePaymentMethod(id: string, formData: FormData) {
  const userId = await getUserId();
  const parsed = parseFormData(formData);

  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((i) => i.message).join(", "));
  }

  await db
    .update(paymentMethods)
    .set({
      nickname: parsed.data.nickname,
      type: parsed.data.type,
      parentId: parsed.data.parentId ?? null,
      bankAccountId: parsed.data.bankAccountId ?? null,
      expiryYear: parsed.data.expiryYear ?? null,
      expiryMonth: parsed.data.expiryMonth ?? null,
      memo: parsed.data.memo ?? null,
    })
    .where(and(eq(paymentMethods.id, id), eq(paymentMethods.userId, userId)));

  revalidatePath("/payment-methods");
  redirect(`/payment-methods/${id}`);
}

export async function deletePaymentMethod(id: string) {
  const userId = await getUserId();

  const [referenced] = await db
    .select({ id: subscriptions.id })
    .from(subscriptions)
    .where(and(eq(subscriptions.paymentMethodId, id), eq(subscriptions.userId, userId)))
    .limit(1);

  if (referenced) {
    throw new Error("このカードを使用中のサブスクリプションが存在するため削除できません");
  }

  await db
    .delete(paymentMethods)
    .where(and(eq(paymentMethods.id, id), eq(paymentMethods.userId, userId)));

  revalidatePath("/payment-methods");
}
