import { notFound } from "next/navigation";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { addresses, subscriptions } from "@/db/schema";
import { getUserId } from "@/utils/get-user-id";
import { AddressDetail } from "@/features/addresses/components/address-detail";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AddressDetailPage({ params }: Props) {
  const { id } = await params;
  const userId = await getUserId();

  const [[address], linkedSubscriptions] = await Promise.all([
    db
      .select()
      .from(addresses)
      .where(and(eq(addresses.id, id), eq(addresses.userId, userId)))
      .limit(1),
    db
      .select({
        id: subscriptions.id,
        name: subscriptions.name,
        status: subscriptions.status,
        amount: subscriptions.amount,
      })
      .from(subscriptions)
      .where(and(eq(subscriptions.addressId, id), eq(subscriptions.userId, userId)))
      .orderBy(desc(subscriptions.createdAt)),
  ]);

  if (!address) notFound();

  return <AddressDetail address={address} subscriptions={linkedSubscriptions} />;
}
