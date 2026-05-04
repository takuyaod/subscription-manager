import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { subscriptions, paymentMethods } from "@/db/schema";
import { getUserId } from "@/utils/get-user-id";
import { Button } from "@/components/ui/button";
import { SubscriptionList } from "@/features/subscriptions/components/subscription-list";

export default async function SubscriptionsPage() {
  const userId = await getUserId();

  const allSubscriptions = await db
    .select({
      id: subscriptions.id,
      name: subscriptions.name,
      amount: subscriptions.amount,
      cycle: subscriptions.cycle,
      cycleInterval: subscriptions.cycleInterval,
      billingDay: subscriptions.billingDay,
      status: subscriptions.status,
      paymentMethodNickname: paymentMethods.nickname,
    })
    .from(subscriptions)
    .leftJoin(paymentMethods, eq(subscriptions.paymentMethodId, paymentMethods.id))
    .where(eq(subscriptions.userId, userId))
    .orderBy(desc(subscriptions.createdAt));

  return (
    <div>
      <div className="mb-6 border-b border-[#222729] pb-5">
        <div className="mb-2 font-mono text-[10px] font-bold tracking-[0.06em] text-[#3dd68c]">
          ~/subscriptions $ ls
        </div>
        <div className="flex items-center justify-between">
          <h1 className="font-mono text-xl font-bold tracking-tight text-[#e8edf0]">サブスク</h1>
          <Button asChild>
            <Link href="/subscriptions/new">
              <Plus className="h-4 w-4" />
              NEW
            </Link>
          </Button>
        </div>
      </div>
      <SubscriptionList subscriptions={allSubscriptions} />
    </div>
  );
}
