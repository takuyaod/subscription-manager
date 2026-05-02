import { notFound } from "next/navigation";
import { eq, and, inArray } from "drizzle-orm";
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

  const directDebitCards =
    pm.type === "bank"
      ? await db
          .select({ id: paymentMethods.id, nickname: paymentMethods.nickname, type: paymentMethods.type })
          .from(paymentMethods)
          .where(and(eq(paymentMethods.bankAccountId, id), eq(paymentMethods.userId, userId)))
      : [];

  const allLinkedCards =
    directDebitCards.length > 0
      ? await db
          .select({ id: paymentMethods.id, nickname: paymentMethods.nickname, type: paymentMethods.type, parentId: paymentMethods.parentId })
          .from(paymentMethods)
          .where(
            and(
              inArray(
                paymentMethods.parentId,
                directDebitCards.map((c) => c.id)
              ),
              eq(paymentMethods.userId, userId)
            )
          )
      : [];

  const directDebitCardsWithLinked = directDebitCards.map((card) => ({
    ...card,
    linkedCards: allLinkedCards.filter((l) => l.parentId === card.id),
  }));

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
      <h1 className="mb-6 font-mono text-xl font-bold tracking-tight text-[#e8edf0]">{pm.nickname}</h1>
      <PaymentMethodDetail
        paymentMethod={pm}
        parent={parent}
        bankAccount={bankAccount}
        directDebitCards={directDebitCardsWithLinked}
      />
    </div>
  );
}
