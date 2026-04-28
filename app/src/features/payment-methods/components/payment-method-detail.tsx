import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { typeConfig } from "@/features/payment-methods/utils/type-config";

type PaymentMethod = {
  id: string;
  nickname: string;
  type: string;
  parentId: string | null;
  bankAccountId: string | null;
  expiryYear: number | null;
  expiryMonth: number | null;
  memo: string | null;
};

type Props = {
  paymentMethod: PaymentMethod;
  parent: { id: string; nickname: string } | null;
  bankAccount: { id: string; nickname: string } | null;
};

export function PaymentMethodDetail({ paymentMethod, parent, bankAccount }: Props) {
  const config = typeConfig[paymentMethod.type] ?? typeConfig.other;
  const Icon = config.icon;

  return (
    <div className="space-y-4 max-w-md">
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Icon className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="font-semibold text-lg">{paymentMethod.nickname}</p>
              <p className="text-muted-foreground text-sm">{config.label}</p>
            </div>
          </div>

          {paymentMethod.expiryYear && paymentMethod.expiryMonth && (
            <div>
              <p className="text-sm text-muted-foreground">有効期限</p>
              <p className="text-sm font-medium">
                {paymentMethod.expiryMonth}/{paymentMethod.expiryYear}
              </p>
            </div>
          )}

          {parent && (
            <div>
              <p className="text-sm text-muted-foreground">親カード</p>
              <Link
                href={`/payment-methods/${parent.id}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                {parent.nickname}
              </Link>
            </div>
          )}

          {bankAccount && (
            <div>
              <p className="text-sm text-muted-foreground">引き落とし口座</p>
              <Link
                href={`/payment-methods/${bankAccount.id}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                {bankAccount.nickname}
              </Link>
            </div>
          )}

          {paymentMethod.memo && (
            <div>
              <p className="text-sm text-muted-foreground">メモ</p>
              <p className="text-sm">{paymentMethod.memo}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button asChild>
          <Link href={`/payment-methods/${paymentMethod.id}/edit`}>編集</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/payment-methods">一覧に戻る</Link>
        </Button>
      </div>
    </div>
  );
}
