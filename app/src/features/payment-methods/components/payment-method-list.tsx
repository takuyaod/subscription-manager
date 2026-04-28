"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    return <p className="text-muted-foreground text-sm">支払い元がありません。</p>;
  }

  return (
    <div>
      {error && (
        <p className="mb-4 rounded-md border border-destructive bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      <ul className="space-y-3">
        {paymentMethods.map((pm) => {
          const config = typeConfig[pm.type] ?? typeConfig.other;
          const Icon = config.icon;
          const hasExpiry = pm.expiryYear && pm.expiryMonth;

          return (
            <li key={pm.id}>
              <Card>
                <CardContent className="flex items-center justify-between p-4">
                  <Link href={`/payment-methods/${pm.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                    <Icon className="h-5 w-5 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium truncate">{pm.nickname}</p>
                      <p className="text-muted-foreground text-xs">
                        {config.label}
                        {hasExpiry && (
                          <span className="ml-2">
                            有効期限: {pm.expiryMonth}/{pm.expiryYear}
                          </span>
                        )}
                      </p>
                    </div>
                  </Link>
                  <div className="flex gap-2 ml-2">
                    <Button variant="outline" size="icon" asChild>
                      <Link href={`/payment-methods/${pm.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={isPending}
                      onClick={() => handleDelete(pm.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
