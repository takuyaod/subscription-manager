import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardAlert } from "../types/alert";

type Props = {
  alerts: DashboardAlert[];
};

function AlertItem({ alert }: { alert: DashboardAlert }) {
  switch (alert.type) {
    case "card_expiry":
      return (
        <li className="flex items-start justify-between py-3">
          <div>
            <p className="text-sm font-medium text-orange-600">カード有効期限が30日以内です</p>
            <p className="text-xs text-muted-foreground">
              {alert.nickname}（{alert.expiryYear}/{String(alert.expiryMonth).padStart(2, "0")}）
            </p>
          </div>
          <Link href={`/payment-methods/${alert.id}`} className="text-xs text-blue-600 hover:underline shrink-0 ml-4">
            詳細を見る
          </Link>
        </li>
      );
    case "service_expiry":
      return (
        <li className="flex items-start justify-between py-3">
          <div>
            <p className="text-sm font-medium text-orange-600">サービス有効期限が30日以内です</p>
            <p className="text-xs text-muted-foreground">
              {alert.name}（期限: {alert.expiresAt}）
            </p>
          </div>
          <Link href={`/subscriptions/${alert.id}`} className="text-xs text-blue-600 hover:underline shrink-0 ml-4">
            詳細を見る
          </Link>
        </li>
      );
    case "address_inactive":
      return (
        <li className="flex items-start justify-between py-3">
          <div>
            <p className="text-sm font-medium text-orange-600">住所変更が未完了のサブスクがあります</p>
            <p className="text-xs text-muted-foreground">
              {alert.subscriptionName}（住所: {alert.addressLabel}）
            </p>
          </div>
          <Link href={`/subscriptions/${alert.subscriptionId}`} className="text-xs text-blue-600 hover:underline shrink-0 ml-4">
            詳細を見る
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>アラート</CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground">アラートはありません</p>
        ) : (
          <ul className="divide-y">
            {alerts.map((alert) => (
              <AlertItem key={alertKey(alert)} alert={alert} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
