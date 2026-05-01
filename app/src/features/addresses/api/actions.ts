"use server";

import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { addresses } from "@/db/schema";
import { getUserId } from "@/utils/get-user-id";

const addressSchema = z.object({
  label: z.string().min(1, "ラベルは必須です"),
  postalCode: z
    .string()
    .regex(/^\d{3}-\d{4}$/, "郵便番号は「123-4567」の形式で入力してください")
    .optional(),
  prefecture: z.string().optional(),
  city: z.string().optional(),
  street: z.string().optional(),
  building: z.string().optional(),
});

export async function createAddress(formData: FormData) {
  const userId = await getUserId();

  const parsed = addressSchema.safeParse({
    label: formData.get("label"),
    postalCode: formData.get("postalCode") || undefined,
    prefecture: formData.get("prefecture") || undefined,
    city: formData.get("city") || undefined,
    street: formData.get("street") || undefined,
    building: formData.get("building") || undefined,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((i) => i.message).join(", "));
  }

  await db.insert(addresses).values({
    userId,
    label: parsed.data.label,
    postalCode: parsed.data.postalCode ?? null,
    prefecture: parsed.data.prefecture ?? null,
    city: parsed.data.city ?? null,
    street: parsed.data.street ?? null,
    building: parsed.data.building ?? null,
  });

  revalidatePath("/addresses");
  redirect("/addresses");
}

export async function updateAddress(id: string, formData: FormData) {
  const userId = await getUserId();

  const parsed = addressSchema.safeParse({
    label: formData.get("label"),
    postalCode: formData.get("postalCode") || undefined,
    prefecture: formData.get("prefecture") || undefined,
    city: formData.get("city") || undefined,
    street: formData.get("street") || undefined,
    building: formData.get("building") || undefined,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((i) => i.message).join(", "));
  }

  await db
    .update(addresses)
    .set({
      label: parsed.data.label,
      postalCode: parsed.data.postalCode ?? null,
      prefecture: parsed.data.prefecture ?? null,
      city: parsed.data.city ?? null,
      street: parsed.data.street ?? null,
      building: parsed.data.building ?? null,
    })
    .where(and(eq(addresses.id, id), eq(addresses.userId, userId)));

  revalidatePath("/addresses");
  redirect("/addresses");
}

export async function deactivateAddress(id: string) {
  const userId = await getUserId();

  await db
    .update(addresses)
    .set({ isActive: false })
    .where(and(eq(addresses.id, id), eq(addresses.userId, userId)));

  revalidatePath("/addresses", "layout");
  revalidatePath("/");
}
