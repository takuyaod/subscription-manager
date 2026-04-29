"use server";

import { eq, and, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { subscriptions } from "@/db/schema";
import { getUserId } from "@/utils/get-user-id";

export async function updateSubscriptionAddress(subscriptionId: string, newAddressId: string | null) {
  const userId = await getUserId();

  await db
    .update(subscriptions)
    .set({ addressId: newAddressId })
    .where(and(eq(subscriptions.id, subscriptionId), eq(subscriptions.userId, userId)));

  revalidatePath("/moving");
  revalidatePath("/");
}

export async function bulkUpdateSubscriptionAddress(subscriptionIds: string[], newAddressId: string | null) {
  const userId = await getUserId();
  if (subscriptionIds.length === 0) return;

  await db
    .update(subscriptions)
    .set({ addressId: newAddressId })
    .where(and(inArray(subscriptions.id, subscriptionIds), eq(subscriptions.userId, userId)));

  revalidatePath("/moving");
  revalidatePath("/");
}
