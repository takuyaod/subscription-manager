import Link from "next/link";
import type { DashboardAlert } from "../types/alert";

type Props = {
  alerts: DashboardAlert[];
};

function AlertItem({ alert }: { alert: DashboardAlert }) {
  switch (alert.type) {
    case "card_expiry":
      return (
        <li className="flex items-center gap-2.5 border border-[#f5a62344] bg-[#f5a62310] px-3.5 py-2.25">
          <span className="font-mono text-[11px] font-bold text-[#f5a623]">[WARNING]</span>
          <span className="flex-1 font-mono text-[12px] text-[#e8edf0]">
            カード有効期限が30日以内です —{" "}
            <span className="text-[#f5a623]">
              {alert.nickname}（{alert.expiryYear}/{String(alert.expiryMonth).padStart(2, "0")}）
            </span>
          </span>
          <Link
            href={`/payment-methods/${alert.id}`}
            className="shrink-0 font-mono text-[11px] font-bold tracking-[0.04em] text-[#4dabf7] hover:underline"
          >
            詳細 →
          </Link>
        </li>
      );
    case "service_expiry":
      return (
        <li className="flex items-center gap-2.5 border border-[#f5a62344] bg-[#f5a62310] px-3.5 py-2.25">
          <span className="font-mono text-[11px] font-bold text-[#f5a623]">[WARNING]</span>
          <span className="flex-1 font-mono text-[12px] text-[#e8edf0]">
            サービス有効期限が30日以内です —{" "}
            <span className="text-[#f5a623]">
              {alert.name}（期限: {alert.expiresAt}）
            </span>
          </span>
          <Link
            href={`/subscriptions/${alert.id}`}
            className="shrink-0 font-mono text-[11px] font-bold tracking-[0.04em] text-[#4dabf7] hover:underline"
          >
            詳細 →
          </Link>
        </li>
      );
    case "address_inactive":
      return (
        <li className="flex items-center gap-2.5 border border-[#f5a62344] bg-[#f5a62310] px-3.5 py-2.25">
          <span className="font-mono text-[11px] font-bold text-[#f5a623]">[WARNING]</span>
          <span className="flex-1 font-mono text-[12px] text-[#e8edf0]">
            住所変更が未完了 —{" "}
            <span className="text-[#f5a623]">
              {alert.subscriptionName}（住所: {alert.addressLabel}）
            </span>
          </span>
          <Link
            href="/moving"
            className="shrink-0 font-mono text-[11px] font-bold tracking-[0.04em] text-[#4dabf7] hover:underline"
          >
            住所変更フローへ →
          </Link>
        </li>
      );
  }
}

function alertKey(alert: DashboardAlert): string {
  switch (alert.type) {
    case "card_expiry":
      return `card_expiry_${alert.id}`;
    case "service_expiry":
      return `service_expiry_${alert.id}`;
    case "address_inactive":
      return `address_inactive_${alert.subscriptionId}`;
  }
}

export function AlertList({ alerts }: Props) {
  if (alerts.length === 0) return null;

  return (
    <ul className="flex flex-col gap-1.5">
      {alerts.map((alert) => (
        <AlertItem key={alertKey(alert)} alert={alert} />
      ))}
    </ul>
  );
}
