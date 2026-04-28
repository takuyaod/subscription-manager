"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { cancelSubscription } from "@/features/subscriptions/api/actions";

type Props = { id: string };

export function CancelButton({ id }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleCancel() {
    if (!confirm("このサブスクを解約しますか？解約後も履歴として残ります。")) return;
    startTransition(() => cancelSubscription(id));
  }

  return (
    <Button variant="destructive" disabled={isPending} onClick={handleCancel}>
      {isPending ? "解約中…" : "解約"}
    </Button>
  );
}
