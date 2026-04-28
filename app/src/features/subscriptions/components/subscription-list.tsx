"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
      <div className="mb-4 flex gap-2">
        <Button
          variant={activeTab === "active" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("active")}
        >
          有効
        </Button>
        <Button
          variant={activeTab === "cancelled" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("cancelled")}
        >
          解約済み
        </Button>
      </div>

      {error && (
        <p className="mb-4 rounded-md border border-destructive bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {activeTab === "active" ? "有効なサブスクがありません。" : "解約済みのサブスクがありません。"}
        </p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((sub) => {
            const cycleLabel = getCycleLabel(sub.cycle, sub.cycleInterval);
            const billingLabel = getBillingDayLabel(sub.cycle, sub.billingDay);

            return (
              <li key={sub.id}>
                <Card>
                  <CardContent className="flex items-center justify-between p-4">
                    <Link href={`/subscriptions/${sub.id}`} className="flex-1 min-w-0">
                      <p className="font-medium truncate">{sub.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ¥{Number(sub.amount).toLocaleString()} / {cycleLabel}
                        {billingLabel && (
                          <span className="ml-2 text-xs">{billingLabel}</span>
                        )}
                      </p>
                      {sub.paymentMethodNickname && (
                        <p className="text-xs text-muted-foreground">{sub.paymentMethodNickname}</p>
                      )}
                    </Link>
                    {sub.status === "active" && (
                      <div className="flex gap-2 ml-2 shrink-0">
                        <Button variant="outline" size="icon" asChild>
                          <Link href={`/subscriptions/${sub.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isPending}
                          onClick={() => handleCancel(sub.id)}
                        >
                          解約
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
