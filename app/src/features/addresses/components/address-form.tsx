"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RequiredMark } from "@/components/ui/required-mark";

type Address = {
  id: string;
  label: string;
  postalCode: string | null;
  prefecture: string | null;
  city: string | null;
  street: string | null;
  building: string | null;
};

type Props = {
  address?: Address;
  action: (formData: FormData) => Promise<void>;
};

export function AddressForm({ address, action }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => action(formData));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div className="space-y-1">
        <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#3d4549]">ラベル <RequiredMark /></label>
        <Input name="label" defaultValue={address?.label} required />
      </div>
      <div className="space-y-1">
        <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#3d4549]">郵便番号</label>
        <Input name="postalCode" defaultValue={address?.postalCode ?? ""} placeholder="000-0000" />
      </div>
      <div className="space-y-1">
        <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#3d4549]">都道府県</label>
        <Input name="prefecture" defaultValue={address?.prefecture ?? ""} />
      </div>
      <div className="space-y-1">
        <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#3d4549]">市区町村</label>
        <Input name="city" defaultValue={address?.city ?? ""} />
      </div>
      <div className="space-y-1">
        <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#3d4549]">番地</label>
        <Input name="street" defaultValue={address?.street ?? ""} />
      </div>
      <div className="space-y-1">
        <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#3d4549]">建物名・部屋番号</label>
        <Input name="building" defaultValue={address?.building ?? ""} />
      </div>
      <div className="flex gap-2 border-t border-[#222729] pt-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "保存中…" : "SAVE"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          CANCEL
        </Button>
      </div>
    </form>
  );
}
