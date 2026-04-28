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
    .regex(/^\d{3}-\d{4}$/, "郵便番号は「123-4567」の形式で入力してください"),
  prefecture: z.string().min(1, "都道府県は必須です"),
  city: z.string().min(1, "市区町村は必須です"),
  street: z.string().min(1, "番地は必須です"),
  building: z.string().optional(),
});

export async function createAddress(formData: FormData) {
  const userId = await getUserId();

  const parsed = addressSchema.safeParse({
    label: formData.get("label"),
    postalCode: formData.get("postalCode"),
    prefecture: formData.get("prefecture"),
    city: formData.get("city"),
    street: formData.get("street"),
    building: formData.get("building") ?? undefined,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((i) => i.message).join(", "));
  }

  await db.insert(addresses).values({
    userId,
    label: parsed.data.label,
    postalCode: parsed.data.postalCode,
    prefecture: parsed.data.prefecture,
    city: parsed.data.city,
    street: parsed.data.street,
    building: parsed.data.building || null,
  });

  revalidatePath("/addresses");
  redirect("/addresses");
}

export async function updateAddress(id: string, formData: FormData) {
  const userId = await getUserId();

  const parsed = addressSchema.safeParse({
    label: formData.get("label"),
    postalCode: formData.get("postalCode"),
    prefecture: formData.get("prefecture"),
    city: formData.get("city"),
    street: formData.get("street"),
    building: formData.get("building") ?? undefined,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((i) => i.message).join(", "));
  }

  await db
    .update(addresses)
    .set({
      label: parsed.data.label,
      postalCode: parsed.data.postalCode,
      prefecture: parsed.data.prefecture,
      city: parsed.data.city,
      street: parsed.data.street,
      building: parsed.data.building || null,
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

  revalidatePath("/addresses");
}
