import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { paymentMethods } from "@/db/schema";
import { getUserId } from "@/utils/get-user-id";
import { Button } from "@/components/ui/button";
import { PaymentMethodList } from "@/features/payment-methods/components/payment-method-list";

export default async function PaymentMethodsPage() {
  const userId = await getUserId();
  const allPaymentMethods = await db
    .select()
    .from(paymentMethods)
    .where(eq(paymentMethods.userId, userId))
    .orderBy(desc(paymentMethods.createdAt));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">支払い元</h1>
        <Button asChild>
          <Link href="/payment-methods/new">
            <Plus className="h-4 w-4" />
            新規追加
          </Link>
        </Button>
      </div>
      <PaymentMethodList paymentMethods={allPaymentMethods} />
    </div>
  );
}
