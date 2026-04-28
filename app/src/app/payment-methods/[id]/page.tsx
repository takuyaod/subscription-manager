import { notFound } from "next/navigation";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { paymentMethods } from "@/db/schema";
import { getUserId } from "@/utils/get-user-id";
import { PaymentMethodDetail } from "@/features/payment-methods/components/payment-method-detail";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PaymentMethodDetailPage({ params }: Props) {
  const { id } = await params;
  const userId = await getUserId();

  const [pm] = await db
    .select()
    .from(paymentMethods)
    .where(and(eq(paymentMethods.id, id), eq(paymentMethods.userId, userId)))
    .limit(1);

  if (!pm) notFound();

  const [parentResult, bankResult] = await Promise.all([
    pm.parentId
      ? db
          .select({ id: paymentMethods.id, nickname: paymentMethods.nickname })
          .from(paymentMethods)
          .where(and(eq(paymentMethods.id, pm.parentId), eq(paymentMethods.userId, userId)))
          .limit(1)
      : [],
    pm.bankAccountId
      ? db
          .select({ id: paymentMethods.id, nickname: paymentMethods.nickname })
          .from(paymentMethods)
          .where(and(eq(paymentMethods.id, pm.bankAccountId), eq(paymentMethods.userId, userId)))
          .limit(1)
      : [],
  ]);

  const parent = parentResult[0] ?? null;
  const bankAccount = bankResult[0] ?? null;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">{pm.nickname}</h1>
      <PaymentMethodDetail paymentMethod={pm} parent={parent} bankAccount={bankAccount} />
    </div>
  );
}
