import { notFound } from "next/navigation";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { subscriptions, paymentMethods, addresses } from "@/db/schema";
import { getUserId } from "@/utils/get-user-id";
import { SubscriptionForm } from "@/features/subscriptions/components/subscription-form";
import { updateSubscription } from "@/features/subscriptions/api/actions";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditSubscriptionPage({ params }: Props) {
  const { id } = await params;
  const userId = await getUserId();

  const [[sub], allPaymentMethods, activeAddresses] = await Promise.all([
    db
      .select()
      .from(subscriptions)
      .where(and(eq(subscriptions.id, id), eq(subscriptions.userId, userId)))
      .limit(1),
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

  if (!sub) notFound();

  async function action(formData: FormData) {
    "use server";
    await updateSubscription(id, formData);
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">サブスクを編集</h1>
      <SubscriptionForm
        subscription={sub}
        paymentMethods={allPaymentMethods}
        addresses={activeAddresses}
        action={action}
      />
    </div>
  );
}
