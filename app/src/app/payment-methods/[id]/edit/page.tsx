import { notFound } from "next/navigation";
import { eq, and, ne, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { paymentMethods } from "@/db/schema";
import { getUserId } from "@/utils/get-user-id";
import { PaymentMethodForm } from "@/features/payment-methods/components/payment-method-form";
import { updatePaymentMethod } from "@/features/payment-methods/api/actions";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditPaymentMethodPage({ params }: Props) {
  const { id } = await params;
  const userId = await getUserId();

  const [[pm], others] = await Promise.all([
    db
      .select()
      .from(paymentMethods)
      .where(and(eq(paymentMethods.id, id), eq(paymentMethods.userId, userId)))
      .limit(1),
    db
      .select({ id: paymentMethods.id, nickname: paymentMethods.nickname, type: paymentMethods.type })
      .from(paymentMethods)
      .where(and(ne(paymentMethods.id, id), eq(paymentMethods.userId, userId)))
      .orderBy(desc(paymentMethods.createdAt)),
  ]);

  if (!pm) notFound();

  async function action(formData: FormData) {
    "use server";
    await updatePaymentMethod(id, formData);
  }

  return (
    <div>
      <h1 className="mb-6 font-mono text-xl font-bold tracking-tight text-[#e8edf0]">支払い元を編集</h1>
      <PaymentMethodForm paymentMethod={pm} allPaymentMethods={others} action={action} />
    </div>
  );
}
