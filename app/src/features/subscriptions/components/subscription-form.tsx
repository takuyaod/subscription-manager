"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RequiredMark } from "@/components/ui/required-mark";

type PaymentMethod = { id: string; nickname: string };
type Address = { id: string; label: string; prefecture: string | null; city: string | null };

type Subscription = {
  id: string;
  name: string;
  amount: string;
  cycle: string;
  cycleInterval: number;
  billingDay: number | null;
  paymentMethodId: string;
  addressId: string | null;
  isPhysical: boolean;
  startDate: string;
  expiresAt: string | null;
  memo: string | null;
};

type Props = {
  subscription?: Subscription;
  paymentMethods: PaymentMethod[];
  addresses: Address[];
  action: (formData: FormData) => Promise<void>;
};

export function SubscriptionForm({ subscription, paymentMethods, addresses, action }: Props) {
  const [cycle, setCycle] = useState(subscription?.cycle ?? "monthly");
  const [isPhysical, setIsPhysical] = useState(subscription?.isPhysical ?? false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const today = new Date().toISOString().split("T")[0];

  const initBillingMonth =
    subscription?.cycle === "yearly" && subscription.billingDay
      ? String(Math.floor(subscription.billingDay / 100))
      : "";
  const initBillingDayYearly =
    subscription?.cycle === "yearly" && subscription.billingDay
      ? String(subscription.billingDay % 100)
      : "";
  const initBillingDayMonthly =
    subscription?.cycle === "monthly" && subscription.billingDay
      ? String(subscription.billingDay)
      : "";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("isPhysical", isPhysical ? "true" : "false");
    startTransition(() => action(formData));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div className="space-y-1">
        <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#3d4549]">サービス名 <RequiredMark /></label>
        <Input name="name" defaultValue={subscription?.name} required />
      </div>

      <div className="space-y-1">
        <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#3d4549]">金額（JPY） <RequiredMark /></label>
        <Input
          name="amount"
          type="number"
          min="0"
          step="any"
          defaultValue={subscription?.amount ? Number(subscription.amount) : ""}
          required
          className="w-40"
        />
      </div>

      <div className="space-y-1">
        <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#3d4549]">サイクル</label>
        <Select name="cycle" value={cycle} onChange={(e) => setCycle(e.target.value)}>
          <option value="monthly">月払い</option>
          <option value="yearly">年払い</option>
          <option value="once">買い切り</option>
        </Select>
      </div>

      {cycle !== "once" && (
        <div className="space-y-1">
          <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#3d4549]">
            間隔（{cycle === "monthly" ? "ヶ月ごと" : "年ごと"}） <RequiredMark />
          </label>
          <Input
            name="cycleInterval"
            type="number"
            min="1"
            defaultValue={subscription?.cycleInterval ?? 1}
            required
            className="w-24"
          />
        </div>
      )}

      {cycle === "monthly" && (
        <div className="space-y-1">
          <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#3d4549]">引き落とし日</label>
          <Select name="billingDayMonthly" defaultValue={initBillingDayMonthly} className="w-28">
            <option value="">指定なし</option>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                {d}日
              </option>
            ))}
          </Select>
        </div>
      )}

      {cycle === "yearly" && (
        <div className="space-y-1">
          <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#3d4549]">引き落とし日</label>
          <div className="flex items-center gap-2">
            <Select name="billingMonth" defaultValue={initBillingMonth} className="w-24">
              <option value="">月</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {m}月
                </option>
              ))}
            </Select>
            <Select name="billingDayYearly" defaultValue={initBillingDayYearly} className="w-24">
              <option value="">日</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  {d}日
                </option>
              ))}
            </Select>
          </div>
        </div>
      )}

      {cycle === "once" && (
        <div className="space-y-1">
          <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#3d4549]">有効期限（任意）</label>
          <Input name="expiresAt" type="date" defaultValue={subscription?.expiresAt ?? ""} />
          <p className="text-xs text-muted-foreground">期限なし買い切りは空欄のまま</p>
        </div>
      )}

      <div className="space-y-1">
        <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#3d4549]">支払い元 <RequiredMark /></label>
        <Select name="paymentMethodId" defaultValue={subscription?.paymentMethodId ?? ""} required>
          <option value="">選択してください</option>
          {paymentMethods.map((pm) => (
            <option key={pm.id} value={pm.id}>
              {pm.nickname}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-1">
        <label className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-[#3d4549] cursor-pointer">
          <input
            type="checkbox"
            checked={isPhysical}
            onChange={(e) => setIsPhysical(e.target.checked)}
            className="h-4 w-4 rounded border-input"
          />
          物理配送あり
        </label>
      </div>

      {isPhysical && (
        <div className="space-y-1">
          <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#3d4549]">配送先住所</label>
          <Select name="addressId" defaultValue={subscription?.addressId ?? ""}>
            <option value="">選択なし</option>
            {addresses.map((addr) => (
              <option key={addr.id} value={addr.id}>
                {addr.label}{addr.prefecture || addr.city ? `（${addr.prefecture ?? ""}${addr.city ?? ""}）` : ""}
              </option>
            ))}
          </Select>
        </div>
      )}

      <div className="space-y-1">
        <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#3d4549]">開始日 <RequiredMark /></label>
        <Input
          name="startDate"
          type="date"
          defaultValue={subscription?.startDate ?? today}
          required
        />
      </div>

      <div className="space-y-1">
        <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#3d4549]">メモ</label>
        <Input name="memo" defaultValue={subscription?.memo ?? ""} />
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
