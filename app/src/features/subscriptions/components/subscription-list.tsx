"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cancelSubscription } from "@/features/subscriptions/api/actions";
import { getCycleLabel, getBillingDayLabel } from "@/features/subscriptions/utils/cycle-label";

type Subscription = {
  id: string;
  name: string;
  amount: string;
  cycle: string;
  cycleInterval: number;
  billingDay: number | null;
  status: string;
  paymentMethodNickname: string | null;
};

type Props = {
  subscriptions: Subscription[];
};

export function SubscriptionList({ subscriptions }: Props) {
  const [activeTab, setActiveTab] = useState<"active" | "cancelled">("active");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const filtered = subscriptions.filter((s) => s.status === activeTab);

  function handleCancel(id: string) {
    if (!confirm("このサブスクを解約しますか？解約後も履歴として残ります。")) return;
    setError(null);
    startTransition(async () => {
      try {
        await cancelSubscription(id);
      } catch (e) {
        setError(e instanceof Error ? e.message : "解約に失敗しました");
      }
    });
  }

  return (
    <div>
      {/* Tab filter */}
      <div className="mb-4.5 flex gap-px bg-[#222729]">
        {(["active", "cancelled"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`cursor-pointer px-3.5 py-1.5 font-mono text-[10px] font-bold tracking-[0.08em] uppercase transition-colors border-b-2 ${
              activeTab === tab
                ? "bg-[#181d1f] text-[#3dd68c] border-[#3dd68c]"
                : "bg-[#161a1c] text-[#3d4549] border-transparent hover:bg-[#181d1f]"
            }`}
          >
            {tab === "active" ? "ACTIVE" : "CANCELLED"}
          </button>
        ))}
      </div>

      {error && (
        <p className="mb-4 border border-[#3dd68c44] bg-[#3dd68c10] px-3 py-2 font-mono text-sm text-[#3dd68c]">
          {error}
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="border border-[#222729] bg-[#111416] px-4.5 py-12 text-center">
          <div className="font-mono text-[11px] text-[#3d4549]">// no records found</div>
        </div>
      ) : (
        <div className="border border-[#222729] bg-[#111416] overflow-hidden rounded-[10px]">
          {/* Table header */}
          <div className="flex items-center gap-3.5 border-b border-[#222729] bg-[#161a1c] px-4.5 py-2 rounded-t-[10px]">
            <div className="flex-1 font-mono text-[9px] font-bold tracking-widest text-[#3d4549] uppercase">SERVICE</div>
            <div className="w-24 font-mono text-[9px] font-bold tracking-widest text-[#3d4549] uppercase">PAYMENT</div>
            <div className="w-20 text-right font-mono text-[9px] font-bold tracking-widest text-[#3d4549] uppercase">AMOUNT</div>
            <div className="w-16 shrink-0" />
          </div>
          {filtered.map((sub, i) => {
            const cycleLabel = getCycleLabel(sub.cycle, sub.cycleInterval);
            const billingLabel = getBillingDayLabel(sub.cycle, sub.billingDay);
            return (
              <div
                key={sub.id}
                className={`group relative flex items-center gap-3.5 px-4.5 py-3 transition-colors hover:bg-[#181d1f] ${
                  i < filtered.length - 1 ? "border-b border-[#222729]" : ""
                }`}
              >
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#3dd68c] opacity-0 transition-opacity group-hover:opacity-100" />
                <Link href={`/subscriptions/${sub.id}`} className="flex flex-1 items-center gap-3.5 min-w-0">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center font-mono text-sm font-bold rounded-[8px]"
                    style={{
                      background: "#3dd68c14",
                      border: "1px solid #3dd68c44",
                      color: "#3dd68c",
                    }}
                  >
                    {sub.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[13px] font-semibold text-[#e8edf0] truncate">{sub.name}</p>
                    <p className="font-mono text-[10px] text-[#3d4549]">
                      {cycleLabel}
                      {billingLabel && <span className="ml-2">{billingLabel}</span>}
                    </p>
                  </div>
                </Link>
                <div className="w-24 shrink-0">
                  {sub.paymentMethodNickname && (
                    <span className="inline-flex items-center border border-[#3dd68c44] bg-[#3dd68c12] px-1.5 py-px font-mono text-[10px] font-bold uppercase tracking-[0.06em] text-[#3dd68c] rounded-[4px]">
                      {sub.paymentMethodNickname}
                    </span>
                  )}
                </div>
                <div className="w-20 shrink-0 text-right">
                  <p className={`font-mono text-[13px] font-bold tabular-nums ${sub.status === "cancelled" ? "text-[#3d4549]" : "text-[#3dd68c]"}`}>
                    ¥{Number(sub.amount).toLocaleString()}
                  </p>
                </div>
                <div className="flex w-16 shrink-0 items-center justify-end gap-1">
                  {sub.status === "active" && (
                    <>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/subscriptions/${sub.id}/edit`}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={isPending}
                        onClick={() => handleCancel(sub.id)}
                      >
                        解約
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
