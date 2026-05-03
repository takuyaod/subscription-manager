import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCycleLabel, getBillingDayLabel } from "@/features/subscriptions/utils/cycle-label";
import { CancelButton } from "@/features/subscriptions/components/cancel-button";

type Subscription = {
  id: string;
  name: string;
  amount: string;
  currency: string;
  cycle: string;
  cycleInterval: number;
  billingDay: number | null;
  isPhysical: boolean;
  status: string;
  startDate: string;
  expiresAt: string | null;
  cancelledAt: Date | null;
  memo: string | null;
};

type Props = {
  subscription: Subscription;
  paymentMethod: { id: string; nickname: string } | null;
  address: { id: string; label: string; prefecture: string | null; city: string | null } | null;
};

function DetailRow({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="flex border-b border-[#222729] py-2.25">
      <span className="w-40 shrink-0 font-mono text-[11px] font-semibold tracking-[0.03em] text-[#3d4549]">
        {label}
      </span>
      <span className={`font-mono text-[12px] font-medium ${accent ?? "text-[#dde3e7]"}`}>
        {value || "—"}
      </span>
    </div>
  );
}

export function SubscriptionDetail({ subscription, paymentMethod, address }: Props) {
  const cycleLabel = getCycleLabel(subscription.cycle, subscription.cycleInterval);
  const billingLabel = getBillingDayLabel(subscription.cycle, subscription.billingDay);

  return (
    <div className="space-y-6 max-w-xl">
      {/* Amount hero */}
      <div className="flex gap-2.5">
        <div className="flex-1 border border-[#222729] bg-[#111416] p-[18px_22px] rounded-[10px]">
          <div className="mb-2 font-mono text-[9px] font-bold tracking-widest text-[#3d4549] uppercase">
            // AMOUNT
          </div>
          <div className="font-mono text-[32px] font-bold leading-none tracking-tight text-[#3dd68c] tabular-nums">
            ¥{Number(subscription.amount).toLocaleString()}
          </div>
          <div className="mt-1 font-mono text-[10px] text-[#3d4549]">
            per {cycleLabel}
          </div>
        </div>
        <div className="flex-1 border border-[#222729] bg-[#111416] p-[18px_22px] rounded-[10px]">
          <div className="mb-2 font-mono text-[9px] font-bold tracking-widest text-[#3d4549] uppercase">
            // STATUS
          </div>
          <div className="mb-2">
            <span className={`inline-flex items-center border px-1.5 py-px font-mono text-[10px] font-bold uppercase tracking-[0.06em] rounded-[4px] ${
              subscription.status === "active"
                ? "border-[#3dd68c55] bg-[#3dd68c12] text-[#3dd68c]"
                : "border-[#3d454955] bg-transparent text-[#3d4549]"
            }`}>
              {subscription.status === "active" ? "active" : "cancelled"}
            </span>
          </div>
          <div className="font-mono text-[10px] text-[#3d4549]">
            開始: {subscription.startDate}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="border border-[#222729] bg-[#111416] p-5 rounded-[10px]">
        <div className="mb-3 font-mono text-[9px] font-bold tracking-widest text-[#3d4549] uppercase">
          // DETAILS
        </div>
        <DetailRow label="service" value={subscription.name} />
        <DetailRow label="billing_cycle" value={cycleLabel} />
        {billingLabel && <DetailRow label="billing_day" value={billingLabel} />}
        {subscription.expiresAt && (
          <DetailRow label="expires_at" value={subscription.expiresAt} accent="text-[#3dd68c]" />
        )}
        {paymentMethod && (
          <div className="flex border-b border-[#222729] py-2.25">
            <span className="w-40 shrink-0 font-mono text-[11px] font-semibold tracking-[0.03em] text-[#3d4549]">
              payment_method
            </span>
            <Link
              href={`/payment-methods/${paymentMethod.id}`}
              className="font-mono text-[12px] font-medium text-[#3dd68c] hover:underline"
            >
              {paymentMethod.nickname}
            </Link>
          </div>
        )}
        {subscription.isPhysical && address && (
          <DetailRow
            label="ship_address"
            value={`${address.label}${address.prefecture || address.city ? `（${address.prefecture ?? ""}${address.city ?? ""}）` : ""}`}
          />
        )}
        {subscription.cancelledAt && (
          <DetailRow
            label="cancelled_at"
            value={subscription.cancelledAt.toLocaleDateString("ja-JP")}
            accent="text-[#3d4549]"
          />
        )}
        {subscription.memo && (
          <div className="py-2.25">
            <div className="mb-1.5 font-mono text-[11px] font-semibold tracking-[0.03em] text-[#3d4549]">memo</div>
            <div className="font-mono text-[12px] text-[#8b9499]">{subscription.memo}</div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {subscription.status === "active" && (
          <>
            <Button asChild>
              <Link href={`/subscriptions/${subscription.id}/edit`}>~ EDIT</Link>
            </Button>
            <CancelButton id={subscription.id} />
          </>
        )}
        <Button variant="secondary" asChild>
          <Link href="/subscriptions">← BACK</Link>
        </Button>
      </div>
    </div>
  );
}
