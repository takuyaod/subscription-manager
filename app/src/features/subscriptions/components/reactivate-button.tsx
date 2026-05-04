"use client";

import { useTransition } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { reactivateSubscription } from "@/features/subscriptions/api/actions";

type Props = { id: string };

export function ReactivateButton({ id }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleReactivate() {
    if (!confirm("このサブスクを再度アクティブにしますか？")) return;
    startTransition(() => reactivateSubscription(id));
  }

  return (
    <Button disabled={isPending} onClick={handleReactivate}>
      <RotateCcw className="mr-1 h-3.5 w-3.5" />
      {isPending ? "処理中…" : "REACTIVATE"}
    </Button>
  );
}
