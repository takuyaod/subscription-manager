"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Pencil, PowerOff, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { deactivateAddress, reactivateAddress } from "@/features/addresses/api/actions";

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

type Subscription = {
  id: string;
  name: string;
  status: "active" | "cancelled";
};

type Props = {
  address: Address;
  subscriptions: Subscription[];
};

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex border-b border-[#222729] py-2.25">
      <span className="w-36 shrink-0 font-mono text-[11px] font-semibold tracking-[0.03em] text-[#3d4549]">
        {label}
      </span>
      <span className="font-mono text-[12px] text-[#dde3e7]">{value || "—"}</span>
    </div>
  );
}

export function AddressDetail({ address, subscriptions }: Props) {
  const [isPending, startTransition] = useTransition();
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [reactivateOpen, setReactivateOpen] = useState(false);

  function handleDeactivate() {
    setDeactivateOpen(false);
    startTransition(() => deactivateAddress(address.id));
  }

  function handleReactivate() {
    setReactivateOpen(false);
    startTransition(() => reactivateAddress(address.id));
  }

  const activeLinked = subscriptions.filter((s) => s.status === "active");

  return (
    <div className="space-y-6 max-w-xl">
      {/* Inactive warning */}
      {!address.isActive && activeLinked.length > 0 && (
        <div className="flex items-center justify-between border border-[#3dd68c44] bg-[#3dd68c10] px-3.5 py-2.25">
          <span className="font-mono text-[12px] text-[#3dd68c]">
            [WARNING] この住所は無効です — 紐付くサブスク {activeLinked.length} 件の住所変更が未完了です
          </span>
          <Button size="sm" asChild className="ml-4 shrink-0">
            <Link href="/moving">住所変更フローへ</Link>
          </Button>
        </div>
      )}
      {!address.isActive && activeLinked.length === 0 && (
        <div className="border border-[#4a535855] bg-[#161a1c] px-3.5 py-2.25">
          <p className="font-mono text-[12px] text-[#3d4549]">// この住所は無効です</p>
        </div>
      )}

      {/* Address record */}
      <div className="border border-[#222729] bg-[#111416] p-5 rounded-[10px]">
        <div className="mb-3 flex items-center gap-3">
          <div className="font-mono text-[9px] font-bold tracking-widest text-[#3d4549] uppercase">
            // ADDRESS RECORD
          </div>
          <span className={`inline-flex items-center border px-1.5 py-px font-mono text-[10px] font-bold uppercase tracking-[0.06em] rounded-[4px] ${
            address.isActive
              ? "border-[#3dd68c55] bg-[#3dd68c12] text-[#3dd68c]"
              : "border-[#3d454955] text-[#3d4549]"
          }`}>
            {address.isActive ? "active" : "inactive"}
          </span>
        </div>
        {address.postalCode && <DetailRow label="postal_code" value={address.postalCode} />}
        {address.prefecture && <DetailRow label="prefecture" value={address.prefecture} />}
        {address.city && <DetailRow label="city" value={address.city} />}
        {address.street && <DetailRow label="street" value={address.street} />}
        {address.building && <DetailRow label="building" value={address.building} />}
      </div>

      <div className="flex gap-2">
        {address.isActive && (
          <>
            <Button asChild>
              <Link href={`/addresses/${address.id}/edit`}>
                <Pencil className="mr-1 h-3.5 w-3.5" />
                ~ EDIT
              </Link>
            </Button>
            <Button variant="destructive" disabled={isPending} onClick={() => setDeactivateOpen(true)}>
              <PowerOff className="mr-1 h-3.5 w-3.5" />
              DEACTIVATE
            </Button>
          </>
        )}
        {!address.isActive && activeLinked.length === 0 && (
          <Button disabled={isPending} onClick={() => setReactivateOpen(true)}>
            <RotateCcw className="mr-1 h-3.5 w-3.5" />
            REACTIVATE
          </Button>
        )}
        <Button variant="secondary" asChild>
          <Link href="/addresses">← BACK</Link>
        </Button>
      </div>

      {/* Linked subscriptions */}
      {subscriptions.length > 0 && (
        <div>
          <div className="mb-2 font-mono text-[11px] font-bold tracking-[0.08em] text-[#3d4549]">
            # 利用中のサブスク
          </div>
          <div className="border border-[#222729] bg-[#111416] overflow-hidden rounded-[10px]">
            {subscriptions.map((sub, i) => (
              <div
                key={sub.id}
                className={`group relative flex items-center justify-between px-4.5 py-3 transition-colors hover:bg-[#181d1f] ${
                  i < subscriptions.length - 1 ? "border-b border-[#222729]" : ""
                }`}
              >
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#3dd68c] opacity-0 transition-opacity group-hover:opacity-100" />
                <div>
                  <p className="font-mono text-[13px] font-semibold text-[#e8edf0]">{sub.name}</p>
                  <p className="font-mono text-[10px] text-[#3d4549]">
                    {sub.status === "active" ? "active" : "cancelled"}
                  </p>
                </div>
                {sub.status === "active" && (
                  <Button variant="secondary" size="sm" asChild>
                    <Link href={`/subscriptions/${sub.id}/edit`}>住所を変更</Link>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      <ConfirmDialog
        open={deactivateOpen}
        title="住所を無効化しますか？"
        message="無効化後もデータは保持されます（isActive: false）。この操作は取り消せません。"
        confirmLabel="DEACTIVATE"
        onConfirm={handleDeactivate}
        onCancel={() => setDeactivateOpen(false)}
      />
      <ConfirmDialog
        open={reactivateOpen}
        title="住所を再度アクティブにしますか？"
        message="この住所をアクティブ状態に戻します。"
        confirmLabel="REACTIVATE"
        onConfirm={handleReactivate}
        onCancel={() => setReactivateOpen(false)}
      />
    </div>
  );
}
