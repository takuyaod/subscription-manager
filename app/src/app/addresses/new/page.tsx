import { AddressForm } from "@/features/addresses/components/address-form";
import { createAddress } from "@/features/addresses/api/actions";

export default function NewAddressPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">住所を追加</h1>
      <AddressForm action={createAddress} />
    </div>
  );
}
