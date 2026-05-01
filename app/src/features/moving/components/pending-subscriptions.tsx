"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  updateSubscriptionAddress,
  bulkUpdateSubscriptionAddress,
} from "@/features/moving/api/actions";

type PendingSubscription = {
  subscriptionId: string;
  subscriptionName: string;
  addressId: string;
  addressLabel: string;
  addressPrefecture: string | null;
  addressCity: string | null;
};

type ActiveAddress = {
  id: string;
  label: string;
  prefecture: string | null;
  city: string | null;
};

type Props = {
  pendingSubscriptions: PendingSubscription[];
  activeAddresses: ActiveAddress[];
};

export function PendingSubscriptions({ pendingSubscriptions, activeAddresses }: Props) {
  const grouped = pendingSubscriptions.reduce<
    Record<
      string,
      {
        addressLabel: string;
        addressPrefecture: string | null;
        addressCity: string | null;
        subscriptions: PendingSubscription[];
      }
    >
  >((acc, sub) => {
    if (!acc[sub.addressId]) {
      acc[sub.addressId] = {
        addressLabel: sub.addressLabel,
        addressPrefecture: sub.addressPrefecture,
        addressCity: sub.addressCity,
        subscriptions: [],
      };
    }
    acc[sub.addressId].subscriptions.push(sub);
    return acc;
  }, {});

  const [selectedNewAddress, setSelectedNewAddress] = useState<Record<string, string>>({});
  const [checkedSubs, setCheckedSubs] = useState<Set<string>>(new Set());
  const [bulkAddress, setBulkAddress] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleUpdate(subscriptionId: string) {
    const newAddressId = selectedNewAddress[subscriptionId] || null;
    startTransition(() => updateSubscriptionAddress(subscriptionId, newAddressId));
  }

  function toggleCheck(subscriptionId: string) {
    setCheckedSubs((prev) => {
      const next = new Set(prev);
      if (next.has(subscriptionId)) {
        next.delete(subscriptionId);
      } else {
        next.add(subscriptionId);
      }
      return next;
    });
  }

  function handleBulkUpdate() {
    const ids = Array.from(checkedSubs);
    startTransition(() => bulkUpdateSubscriptionAddress(ids, bulkAddress || null));
    setCheckedSubs(new Set());
    setBulkAddress("");
  }

  return (
    <div className="space-y-6">
      {checkedSubs.size > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="flex flex-wrap items-center gap-4 p-4">
            <span className="text-sm font-medium">{checkedSubs.size}件を一括更新</span>
            <Select
              value={bulkAddress}
              onChange={(e) => setBulkAddress(e.target.value)}
              className="w-56"
            >
              <option value="">新住所を選択</option>
              {activeAddresses.map((addr) => (
                <option key={addr.id} value={addr.id}>
                  {addr.label}{addr.prefecture || addr.city ? `（${addr.prefecture ?? ""}${addr.city ?? ""}）` : ""}
                </option>
              ))}
            </Select>
            <Button onClick={handleBulkUpdate} disabled={isPending || !bulkAddress}>
              一括更新
            </Button>
            <Button variant="outline" onClick={() => setCheckedSubs(new Set())} disabled={isPending}>
              選択解除
            </Button>
          </CardContent>
        </Card>
      )}

      {Object.entries(grouped).map(([addressId, group]) => (
        <div key={addressId}>
          <h2 className="mb-3 text-base font-semibold text-muted-foreground">
            旧住所: {group.addressLabel}{group.addressPrefecture || group.addressCity ? `（${group.addressPrefecture ?? ""}${group.addressCity ?? ""}）` : ""}
          </h2>
          <ul className="space-y-3">
            {group.subscriptions.map((sub) => (
              <li key={sub.subscriptionId}>
                <Card>
                  <CardContent className="flex flex-wrap items-center gap-4 p-4">
                    <input
                      type="checkbox"
                      className="h-4 w-4 shrink-0"
                      checked={checkedSubs.has(sub.subscriptionId)}
                      onChange={() => toggleCheck(sub.subscriptionId)}
                    />
                    <span className="flex-1 font-medium">{sub.subscriptionName}</span>
                    <Select
                      value={selectedNewAddress[sub.subscriptionId] ?? ""}
                      onChange={(e) =>
                        setSelectedNewAddress((prev) => ({
                          ...prev,
                          [sub.subscriptionId]: e.target.value,
                        }))
                      }
                      className="w-56"
                    >
                      <option value="">新住所を選択</option>
                      {activeAddresses.map((addr) => (
                        <option key={addr.id} value={addr.id}>
                          {addr.label}{addr.prefecture || addr.city ? `（${addr.prefecture ?? ""}${addr.city ?? ""}）` : ""}
                        </option>
                      ))}
                    </Select>
                    <Button
                      size="sm"
                      onClick={() => handleUpdate(sub.subscriptionId)}
                      disabled={isPending || !selectedNewAddress[sub.subscriptionId]}
                    >
                      更新
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/subscriptions/${sub.subscriptionId}/edit`}>詳細編集</Link>
                    </Button>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
