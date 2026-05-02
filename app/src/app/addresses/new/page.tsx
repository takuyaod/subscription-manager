import { AddressForm } from "@/features/addresses/components/address-form";
import { createAddress } from "@/features/addresses/api/actions";

export default function NewAddressPage() {
  return (
    <div>
      <h1 className="mb-6 font-mono text-xl font-bold tracking-tight text-[#e8edf0]">住所を追加</h1>
      <AddressForm action={createAddress} />
    </div>
  );
}
