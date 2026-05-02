import { notFound } from "next/navigation";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { addresses } from "@/db/schema";
import { getUserId } from "@/utils/get-user-id";
import { AddressForm } from "@/features/addresses/components/address-form";
import { updateAddress } from "@/features/addresses/api/actions";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditAddressPage({ params }: Props) {
  const { id } = await params;
  const userId = await getUserId();

  const [address] = await db
    .select()
    .from(addresses)
    .where(and(eq(addresses.id, id), eq(addresses.userId, userId)))
    .limit(1);

  if (!address || !address.isActive) notFound();

  async function action(formData: FormData) {
    "use server";
    await updateAddress(id, formData);
  }

  return (
    <div>
      <h1 className="mb-6 font-mono text-xl font-bold tracking-tight text-[#e8edf0]">住所を編集</h1>
      <AddressForm address={address} action={action} />
    </div>
  );
}
