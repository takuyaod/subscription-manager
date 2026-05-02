import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { paymentMethods } from "@/db/schema";
import { getUserId } from "@/utils/get-user-id";
import { PaymentMethodForm } from "@/features/payment-methods/components/payment-method-form";
import { createPaymentMethod } from "@/features/payment-methods/api/actions";

export default async function NewPaymentMethodPage() {
  const userId = await getUserId();
  const allPaymentMethods = await db
    .select({ id: paymentMethods.id, nickname: paymentMethods.nickname, type: paymentMethods.type })
    .from(paymentMethods)
    .where(eq(paymentMethods.userId, userId))
    .orderBy(desc(paymentMethods.createdAt));

  return (
    <div>
      <h1 className="mb-6 font-mono text-xl font-bold tracking-tight text-[#e8edf0]">支払い元を追加</h1>
      <PaymentMethodForm allPaymentMethods={allPaymentMethods} action={createPaymentMethod} />
    </div>
  );
}
