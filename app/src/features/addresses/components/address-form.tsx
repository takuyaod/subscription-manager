"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RequiredMark } from "@/components/ui/required-mark";

type Address = {
  id: string;
  label: string;
  postalCode: string;
  prefecture: string;
  city: string;
  street: string;
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
        <label className="text-sm font-medium">ラベル <RequiredMark /></label>
        <Input name="label" defaultValue={address?.label} required />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">郵便番号 <RequiredMark /></label>
        <Input name="postalCode" defaultValue={address?.postalCode} placeholder="000-0000" required />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">都道府県 <RequiredMark /></label>
        <Input name="prefecture" defaultValue={address?.prefecture} required />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">市区町村 <RequiredMark /></label>
        <Input name="city" defaultValue={address?.city} required />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">番地 <RequiredMark /></label>
        <Input name="street" defaultValue={address?.street} required />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">建物名・部屋番号</label>
        <Input name="building" defaultValue={address?.building ?? ""} />
      </div>
      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "保存中…" : "保存"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          キャンセル
        </Button>
      </div>
    </form>
  );
}
