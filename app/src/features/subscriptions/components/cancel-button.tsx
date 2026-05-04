"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { cancelSubscription } from "@/features/subscriptions/api/actions";

type Props = { id: string };

export function CancelButton({ id }: Props) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  function handleConfirm() {
    setOpen(false);
    startTransition(() => cancelSubscription(id));
  }

  return (
    <>
      <Button variant="destructive" disabled={isPending} onClick={() => setOpen(true)}>
        {isPending ? "解約中…" : "解約"}
      </Button>
      <ConfirmDialog
        open={open}
        title="サブスクを解約しますか？"
        message="解約後もデータは履歴として保持されます（status: cancelled）。この操作は取り消せません。"
        confirmLabel="CANCEL SUB"
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
