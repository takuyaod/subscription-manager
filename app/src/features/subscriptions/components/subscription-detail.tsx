import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

export function SubscriptionDetail({ subscription, paymentMethod, address }: Props) {
  const cycleLabel = getCycleLabel(subscription.cycle, subscription.cycleInterval);
  const billingLabel = getBillingDayLabel(subscription.cycle, subscription.billingDay);

  return (
    <div className="space-y-4 max-w-md">
      <Card>
        <CardContent className="p-4 space-y-3">
          <div>
            <p className="font-semibold text-lg">{subscription.name}</p>
            <p className="text-sm text-muted-foreground">{cycleLabel}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">金額</p>
            <p className="text-sm font-medium">
              ¥{Number(subscription.amount).toLocaleString()} {subscription.currency}
            </p>
          </div>

          {billingLabel && (
            <div>
              <p className="text-sm text-muted-foreground">引き落とし日</p>
              <p className="text-sm font-medium">{billingLabel}</p>
            </div>
          )}

          {subscription.expiresAt && (
            <div>
              <p className="text-sm text-muted-foreground">有効期限</p>
              <p className="text-sm font-medium">{subscription.expiresAt}</p>
            </div>
          )}

          {paymentMethod && (
            <div>
              <p className="text-sm text-muted-foreground">支払い元</p>
              <Link
                href={`/payment-methods/${paymentMethod.id}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                {paymentMethod.nickname}
              </Link>
            </div>
          )}

          {subscription.isPhysical && address && (
            <div>
              <p className="text-sm text-muted-foreground">配送先</p>
              <p className="text-sm font-medium">
                {address.label}{address.prefecture || address.city ? `（${address.prefecture ?? ""}${address.city ?? ""}）` : ""}
              </p>
            </div>
          )}

          <div>
            <p className="text-sm text-muted-foreground">開始日</p>
            <p className="text-sm font-medium">{subscription.startDate}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">ステータス</p>
            <p className="text-sm font-medium">
              {subscription.status === "active" ? "有効" : "解約済み"}
            </p>
          </div>

          {subscription.cancelledAt && (
            <div>
              <p className="text-sm text-muted-foreground">解約日</p>
              <p className="text-sm font-medium">
                {subscription.cancelledAt.toLocaleDateString("ja-JP")}
              </p>
            </div>
          )}

          {subscription.memo && (
            <div>
              <p className="text-sm text-muted-foreground">メモ</p>
              <p className="text-sm">{subscription.memo}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-2">
        {subscription.status === "active" && (
          <>
            <Button asChild>
              <Link href={`/subscriptions/${subscription.id}/edit`}>編集</Link>
            </Button>
            <CancelButton id={subscription.id} />
          </>
        )}
        <Button variant="outline" asChild>
          <Link href="/subscriptions">一覧に戻る</Link>
        </Button>
      </div>
    </div>
  );
}
