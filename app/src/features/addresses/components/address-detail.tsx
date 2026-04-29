"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Pencil, PowerOff, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deactivateAddress } from "@/features/addresses/api/actions";

type Address = {
  id: string;
  label: string;
  postalCode: string;
  prefecture: string;
  city: string;
  street: string;
  building: string | null;
  isActive: boolean;
};

type Subscription = {
  id: string;
  name: string;
  status: string;
  amount: string;
};

type Props = {
  address: Address;
  subscriptions: Subscription[];
};

export function AddressDetail({ address, subscriptions }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleDeactivate() {
    startTransition(() => deactivateAddress(address.id));
  }

  const activeLinked = subscriptions.filter((s) => s.status === "active");

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{address.label}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            〒{address.postalCode} {address.prefecture}
            {address.city}
            {address.street}
            {address.building ? ` ${address.building}` : ""}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {address.isActive ? "有効" : "無効"}
          </p>
        </div>
        {address.isActive && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/addresses/${address.id}/edit`}>
                <Pencil className="mr-1 h-4 w-4" />
                編集
              </Link>
            </Button>
            <Button variant="outline" size="sm" disabled={isPending} onClick={handleDeactivate}>
              <PowerOff className="mr-1 h-4 w-4" />
              無効化
            </Button>
          </div>
        )}
      </div>

      {!address.isActive && activeLinked.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <p className="text-sm text-orange-700">
                この住所は無効です。紐付くサブスク {activeLinked.length}
                件の住所変更が未完了です。
              </p>
            </div>
            <Button size="sm" asChild>
              <Link href="/moving">住所変更フローへ</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {!address.isActive && activeLinked.length === 0 && (
        <div className="rounded-md border bg-muted/30 p-3">
          <p className="text-sm text-muted-foreground">この住所は無効です。</p>
        </div>
      )}

      <div>
        <h2 className="mb-3 text-lg font-semibold">紐付くサブスク</h2>
        {subscriptions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            このアドレスに紐付くサブスクはありません。
          </p>
        ) : (
          <ul className="space-y-2">
            {subscriptions.map((sub) => (
              <li key={sub.id}>
                <Card>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">{sub.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {sub.status === "active" ? "有効" : "解約済み"}
                      </p>
                    </div>
                    {sub.status === "active" && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/subscriptions/${sub.id}/edit`}>住所を変更</Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
