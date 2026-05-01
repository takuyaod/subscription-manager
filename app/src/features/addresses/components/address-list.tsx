"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Pencil, PowerOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { deactivateAddress } from "@/features/addresses/api/actions";

type Address = {
  id: string;
  label: string;
  postalCode: string | null;
  prefecture: string | null;
  city: string | null;
  street: string | null;
  building: string | null;
  isActive: boolean;
};

type Props = {
  addresses: Address[];
};

export function AddressList({ addresses }: Props) {
  const [filter, setFilter] = useState<"active" | "inactive">("active");
  const [isPending, startTransition] = useTransition();

  const filtered = addresses.filter((a) =>
    filter === "active" ? a.isActive : !a.isActive,
  );

  function handleDeactivate(id: string) {
    startTransition(() => deactivateAddress(id));
  }

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <Button
          variant={filter === "active" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("active")}
        >
          有効
        </Button>
        <Button
          variant={filter === "inactive" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("inactive")}
        >
          無効
        </Button>
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-sm">住所がありません。</p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((address) => (
            <li key={address.id}>
              <Card>
                <CardContent className="flex items-start justify-between p-4">
                  <Link href={`/addresses/${address.id}`} className="flex-1">
                    <p className="font-medium hover:underline">{address.label}</p>
                    <p className="text-muted-foreground text-sm">
                      {address.postalCode ? `〒${address.postalCode} ` : ""}
                      {address.prefecture}{address.city}{address.street}
                      {address.building ? ` ${address.building}` : ""}
                    </p>
                  </Link>
                  {address.isActive && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" asChild>
                        <Link href={`/addresses/${address.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={isPending}
                        onClick={() => handleDeactivate(address.id)}
                      >
                        <PowerOff className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
