"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type PaymentMethod = { id: string; nickname: string };
type Address = { id: string; label: string; prefecture: string; city: string };

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
        <label className="text-sm font-medium">サービス名</label>
        <Input name="name" defaultValue={subscription?.name} required />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">金額（JPY）</label>
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
        <label className="text-sm font-medium">サイクル</label>
        <Select name="cycle" value={cycle} onChange={(e) => setCycle(e.target.value)}>
          <option value="monthly">月払い</option>
          <option value="yearly">年払い</option>
          <option value="once">買い切り</option>
        </Select>
      </div>

      {cycle !== "once" && (
        <div className="space-y-1">
          <label className="text-sm font-medium">
            間隔（{cycle === "monthly" ? "ヶ月ごと" : "年ごと"}）
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
          <label className="text-sm font-medium">引き落とし日</label>
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
          <label className="text-sm font-medium">引き落とし日</label>
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
          <label className="text-sm font-medium">有効期限（任意）</label>
          <Input name="expiresAt" type="date" defaultValue={subscription?.expiresAt ?? ""} />
          <p className="text-xs text-muted-foreground">期限なし買い切りは空欄のまま</p>
        </div>
      )}

      <div className="space-y-1">
        <label className="text-sm font-medium">支払い元</label>
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
        <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
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
          <label className="text-sm font-medium">配送先住所</label>
          <Select name="addressId" defaultValue={subscription?.addressId ?? ""}>
            <option value="">選択なし</option>
            {addresses.map((addr) => (
              <option key={addr.id} value={addr.id}>
                {addr.label}（{addr.prefecture}{addr.city}）
              </option>
            ))}
          </Select>
        </div>
      )}

      <div className="space-y-1">
        <label className="text-sm font-medium">開始日</label>
        <Input
          name="startDate"
          type="date"
          defaultValue={subscription?.startDate ?? today}
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">メモ</label>
        <Input name="memo" defaultValue={subscription?.memo ?? ""} />
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
