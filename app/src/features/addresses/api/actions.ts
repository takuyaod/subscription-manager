"use server";

import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { addresses } from "@/db/schema";
import { getUserId } from "@/utils/get-user-id";

export async function createAddress(formData: FormData) {
  const userId = await getUserId();

  await db.insert(addresses).values({
    userId,
    label: formData.get("label") as string,
    postalCode: formData.get("postalCode") as string,
    prefecture: formData.get("prefecture") as string,
    city: formData.get("city") as string,
    street: formData.get("street") as string,
    building: (formData.get("building") as string) || null,
  });

  revalidatePath("/addresses");
  redirect("/addresses");
}

export async function updateAddress(id: string, formData: FormData) {
  const userId = await getUserId();

  await db
    .update(addresses)
    .set({
      label: formData.get("label") as string,
      postalCode: formData.get("postalCode") as string,
      prefecture: formData.get("prefecture") as string,
      city: formData.get("city") as string,
      street: formData.get("street") as string,
      building: (formData.get("building") as string) || null,
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
