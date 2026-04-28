"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type PaymentMethod = {
  id: string;
  nickname: string;
  type: string;
};

type PaymentMethodDetail = PaymentMethod & {
  parentId: string | null;
  bankAccountId: string | null;
  expiryYear: number | null;
  expiryMonth: number | null;
  memo: string | null;
};

type Props = {
  paymentMethod?: PaymentMethodDetail;
  allPaymentMethods: PaymentMethod[];
  action: (formData: FormData) => Promise<void>;
};

const typeOptions = [
  { value: "credit", label: "クレジットカード" },
  { value: "debit", label: "デビットカード" },
  { value: "bank", label: "銀行口座" },
  { value: "apple", label: "Apple ID" },
  { value: "google", label: "Google Pay" },
  { value: "linked", label: "付帯カード" },
  { value: "postpay", label: "ポストペイ" },
  { value: "other", label: "その他" },
];

const TYPES_WITH_EXPIRY = ["credit", "postpay", "linked"];
const TYPES_WITH_BANK = ["credit", "debit", "postpay"];

export function PaymentMethodForm({ paymentMethod, allPaymentMethods, action }: Props) {
  const [type, setType] = useState(paymentMethod?.type ?? "credit");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const hasExpiry = TYPES_WITH_EXPIRY.includes(type);
  const hasBank = TYPES_WITH_BANK.includes(type);
  const isLinked = type === "linked";

  const bankAccounts = allPaymentMethods.filter((pm) => pm.type === "bank");
  const parentCandidates = allPaymentMethods.filter(
    (pm) => pm.id !== paymentMethod?.id,
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => action(formData));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div className="space-y-1">
        <label className="text-sm font-medium">ニックネーム</label>
        <Input name="nickname" defaultValue={paymentMethod?.nickname} required />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">種別</label>
        <Select
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          {typeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      </div>

      {hasExpiry && (
        <div className="space-y-1">
          <label className="text-sm font-medium">有効期限</label>
          <div className="flex gap-2">
            <Select
              name="expiryMonth"
              defaultValue={paymentMethod?.expiryMonth?.toString() ?? ""}
              className="w-24"
            >
              <option value="">月</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {m}月
                </option>
              ))}
            </Select>
            <Select
              name="expiryYear"
              defaultValue={paymentMethod?.expiryYear?.toString() ?? ""}
              className="w-28"
            >
              <option value="">年</option>
              {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() + i).map((y) => (
                <option key={y} value={y}>
                  {y}年
                </option>
              ))}
            </Select>
          </div>
        </div>
      )}

      {isLinked && (
        <div className="space-y-1">
          <label className="text-sm font-medium">親カード</label>
          <Select name="parentId" defaultValue={paymentMethod?.parentId ?? ""}>
            <option value="">選択なし</option>
            {parentCandidates.map((pm) => (
              <option key={pm.id} value={pm.id}>
                {pm.nickname}
              </option>
            ))}
          </Select>
        </div>
      )}

      {hasBank && (
        <div className="space-y-1">
          <label className="text-sm font-medium">引き落とし口座</label>
          <Select name="bankAccountId" defaultValue={paymentMethod?.bankAccountId ?? ""}>
            <option value="">選択なし</option>
            {bankAccounts.map((pm) => (
              <option key={pm.id} value={pm.id}>
                {pm.nickname}
              </option>
            ))}
          </Select>
        </div>
      )}

      <div className="space-y-1">
        <label className="text-sm font-medium">メモ</label>
        <Input name="memo" defaultValue={paymentMethod?.memo ?? ""} />
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
