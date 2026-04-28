import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { subscriptions, paymentMethods, addresses } from "@/db/schema";
import { getUserId } from "@/utils/get-user-id";
import { SubscriptionDetail } from "@/features/subscriptions/components/subscription-detail";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function SubscriptionDetailPage({ params }: Props) {
  const { id } = await params;
  const userId = await getUserId();

  const [sub] = await db
    .select()
    .from(subscriptions)
    .where(and(eq(subscriptions.id, id), eq(subscriptions.userId, userId)))
    .limit(1);

  if (!sub) notFound();

  const [pmResult, addrResult] = await Promise.all([
    db
      .select({ id: paymentMethods.id, nickname: paymentMethods.nickname })
      .from(paymentMethods)
      .where(and(eq(paymentMethods.id, sub.paymentMethodId), eq(paymentMethods.userId, userId)))
      .limit(1),
    sub.addressId
      ? db
          .select({
            id: addresses.id,
            label: addresses.label,
            prefecture: addresses.prefecture,
            city: addresses.city,
          })
          .from(addresses)
          .where(and(eq(addresses.id, sub.addressId), eq(addresses.userId, userId)))
          .limit(1)
      : [],
  ]);

  const paymentMethod = pmResult[0] ?? null;
  const address = addrResult[0] ?? null;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">{sub.name}</h1>
      <SubscriptionDetail subscription={sub} paymentMethod={paymentMethod} address={address} />
    </div>
  );
}
