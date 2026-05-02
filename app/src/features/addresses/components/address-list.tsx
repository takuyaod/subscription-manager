"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Pencil, PowerOff } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      {/* Tab filter */}
      <div className="mb-4.5 flex gap-px bg-[#2a2f32]">
        {(["active", "inactive"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-1.5 font-mono text-[10px] font-bold tracking-[0.08em] uppercase transition-colors border-b-2 ${
              filter === tab
                ? "bg-[#1c2123] text-[#3dd68c] border-[#3dd68c]"
                : "bg-[#161a1c] text-[#4a5358] border-transparent hover:bg-[#1c2123]"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="border border-[#2a2f32] bg-[#111416] px-4.5 py-12 text-center">
          <div className="font-mono text-[11px] text-[#4a5358]">// no records found</div>
        </div>
      ) : (
        <div className="border border-[#2a2f32] bg-[#111416] overflow-hidden">
          {filtered.map((address, i) => (
            <div
              key={address.id}
              className={`group relative flex items-center gap-3.5 px-4.5 py-3 transition-colors hover:bg-[#1c2123] ${
                i < filtered.length - 1 ? "border-b border-[#2a2f32]" : ""
              }`}
            >
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#3dd68c] opacity-0 transition-opacity group-hover:opacity-100" />
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center font-mono text-base font-bold"
                style={{
                  border: `1px solid ${address.isActive ? "#3dd68c44" : "#2a2f3244"}`,
                  background: address.isActive ? "#3dd68c0e" : "transparent",
                  color: address.isActive ? "#3dd68c" : "#4a5358",
                }}
              >
                ⌂
              </div>
              <Link href={`/addresses/${address.id}`} className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-mono text-[13px] font-semibold text-[#e8edf0] truncate">
                    {address.label}
                  </p>
                  <span className={`inline-flex items-center border px-1.5 py-px font-mono text-[10px] font-bold uppercase tracking-[0.06em] shrink-0 ${
                    address.isActive
                      ? "border-[#3dd68c55] bg-[#3dd68c12] text-[#3dd68c]"
                      : "border-[#4a535855] text-[#4a5358]"
                  }`}>
                    {address.isActive ? "active" : "inactive"}
                  </span>
                </div>
                <p className="font-mono text-[10px] text-[#4a5358]">
                  {address.postalCode ? `〒${address.postalCode} ` : ""}
                  {address.prefecture}{address.city} · {address.street}
                  {address.building ? ` ${address.building}` : ""}
                </p>
              </Link>
              {address.isActive && (
                <div className="flex shrink-0 gap-1">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/addresses/${address.id}/edit`}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    disabled={isPending}
                    onClick={() => handleDeactivate(address.id)}
                  >
                    <PowerOff className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
