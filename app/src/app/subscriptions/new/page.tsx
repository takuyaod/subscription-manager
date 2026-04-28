import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { paymentMethods, addresses } from "@/db/schema";
import { getUserId } from "@/utils/get-user-id";
import { SubscriptionForm } from "@/features/subscriptions/components/subscription-form";
import { createSubscription } from "@/features/subscriptions/api/actions";

export default async function NewSubscriptionPage() {
  const userId = await getUserId();

  const [allPaymentMethods, activeAddresses] = await Promise.all([
    db
      .select({ id: paymentMethods.id, nickname: paymentMethods.nickname })
      .from(paymentMethods)
      .where(eq(paymentMethods.userId, userId))
      .orderBy(desc(paymentMethods.createdAt)),
    db
      .select({
        id: addresses.id,
        label: addresses.label,
        prefecture: addresses.prefecture,
        city: addresses.city,
      })
      .from(addresses)
      .where(and(eq(addresses.userId, userId), eq(addresses.isActive, true)))
      .orderBy(desc(addresses.createdAt)),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">サブスクを追加</h1>
      <SubscriptionForm
        paymentMethods={allPaymentMethods}
        addresses={activeAddresses}
        action={createSubscription}
      />
    </div>
  );
}
