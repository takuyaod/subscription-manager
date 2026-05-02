"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deletePaymentMethod } from "@/features/payment-methods/api/actions";
import { typeConfig } from "@/features/payment-methods/utils/type-config";

type PaymentMethod = {
  id: string;
  nickname: string;
  type: string;
  expiryYear: number | null;
  expiryMonth: number | null;
};

type Props = {
  paymentMethods: PaymentMethod[];
};

export function PaymentMethodList({ paymentMethods }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete(id: string) {
    if (!confirm("この支払い元を削除しますか？")) return;
    setError(null);
    startTransition(async () => {
      try {
        await deletePaymentMethod(id);
      } catch (e) {
        setError(e instanceof Error ? e.message : "削除に失敗しました");
      }
    });
  }

  if (paymentMethods.length === 0) {
    return (
      <div className="border border-[#2a2f32] bg-[#111416] px-4.5 py-12 text-center">
        <div className="font-mono text-[11px] text-[#4a5358]">// no records found</div>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <p className="mb-4 border border-[#ff4d4f55] bg-[#ff4d4f14] px-3 py-2 font-mono text-sm text-[#ff4d4f]">
          {error}
        </p>
      )}
      <div className="border border-[#2a2f32] bg-[#111416] overflow-hidden">
        {/* Table header */}
        <div className="flex items-center gap-3.5 border-b border-[#2a2f32] bg-[#161a1c] px-4.5 py-2">
          <div className="w-9 shrink-0" />
          <div className="flex-1 font-mono text-[9px] font-bold tracking-widest text-[#4a5358] uppercase">NAME</div>
          <div className="w-24 font-mono text-[9px] font-bold tracking-widest text-[#4a5358] uppercase">TYPE</div>
          <div className="w-24 font-mono text-[9px] font-bold tracking-widest text-[#4a5358] uppercase">EXPIRY</div>
          <div className="w-16 shrink-0" />
        </div>
        {paymentMethods.map((pm, i) => {
          const config = typeConfig[pm.type] ?? typeConfig.other;
          const hasExpiry = pm.expiryYear && pm.expiryMonth;
          const isExpiring =
            hasExpiry &&
            (() => {
              const d = Math.round(
                (new Date(pm.expiryYear!, pm.expiryMonth! - 1, 1).getTime() - Date.now()) /
                  86400000,
              );
              return d >= 0 && d <= 30;
            })();

          return (
            <div
              key={pm.id}
              className={`group relative flex items-center gap-3.5 px-4.5 py-3 transition-colors hover:bg-[#1c2123] ${
                i < paymentMethods.length - 1 ? "border-b border-[#2a2f32]" : ""
              }`}
            >
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#3dd68c] opacity-0 transition-opacity group-hover:opacity-100" />
              <Link href={`/payment-methods/${pm.id}`} className="flex flex-1 items-center gap-3.5 min-w-0">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center font-mono text-sm font-bold"
                  style={{
                    background: `${config.color}12`,
                    border: `1px solid ${config.color}44`,
                    color: config.color,
                  }}
                >
                  {pm.nickname.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[13px] font-semibold text-[#e8edf0] truncate">{pm.nickname}</p>
                </div>
              </Link>
              <div className="w-24 shrink-0">
                <span
                  className="inline-flex items-center border px-1.5 py-px font-mono text-[10px] font-bold uppercase tracking-[0.06em]"
                  style={{
                    borderColor: `${config.color}55`,
                    background: `${config.color}12`,
                    color: config.color,
                  }}
                >
                  {config.label}
                </span>
              </div>
              <div className="w-24 shrink-0">
                {hasExpiry ? (
                  <div>
                    <span className={`font-mono text-[11px] ${isExpiring ? "text-[#ff4d4f]" : "text-[#8b9499]"}`}>
                      {pm.expiryMonth}/{pm.expiryYear}
                    </span>
                    {isExpiring && (
                      <div className="font-mono text-[9px] font-bold text-[#ff4d4f]">EXPIRING</div>
                    )}
                  </div>
                ) : (
                  <span className="font-mono text-[11px] text-[#4a5358]">—</span>
                )}
              </div>
              <div className="flex w-16 shrink-0 items-center justify-end gap-1">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/payment-methods/${pm.id}/edit`}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  disabled={isPending}
                  onClick={() => handleDelete(pm.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
