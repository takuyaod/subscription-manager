import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { addresses, subscriptions } from "@/db/schema";
import { getUserId } from "@/utils/get-user-id";
import { PendingSubscriptions } from "@/features/moving/components/pending-subscriptions";

export default async function MovingPage() {
  const userId = await getUserId();

  const [pendingRows, activeAddresses] = await Promise.all([
    db
      .select({
        subscriptionId: subscriptions.id,
        subscriptionName: subscriptions.name,
        addressId: addresses.id,
        addressLabel: addresses.label,
        addressPrefecture: addresses.prefecture,
        addressCity: addresses.city,
      })
      .from(subscriptions)
      .innerJoin(addresses, eq(subscriptions.addressId, addresses.id))
      .where(
        and(
          eq(subscriptions.userId, userId),
          eq(subscriptions.status, "active"),
          eq(addresses.isActive, false),
          eq(addresses.userId, userId),
        ),
      )
      .orderBy(desc(subscriptions.createdAt)),
    db
      .select({
        id: addresses.id,
        label: addresses.label,
        prefecture: addresses.prefecture,
        city: addresses.city,
      })
      .from(addresses)
      .where(and(eq(addresses.userId, userId), eq(addresses.isActive, true))),
  ]);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold tracking-tight">引っ越しフロー</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        旧住所に紐付くサブスクの配送先を新住所に更新してください。
      </p>
      {pendingRows.length === 0 ? (
        <p className="text-sm text-muted-foreground">住所変更が未完了のサブスクはありません。</p>
      ) : (
        <PendingSubscriptions
          pendingSubscriptions={pendingRows}
          activeAddresses={activeAddresses}
        />
      )}
    </div>
  );
}
