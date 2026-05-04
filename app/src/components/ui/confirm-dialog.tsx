"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const FOCUSABLE_SELECTORS =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "CONFIRM",
  cancelLabel = "CANCEL",
  onConfirm,
  onCancel,
}: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusable = dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
    focusable[0]?.focus();

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onCancel();
        return;
      }
      if (e.key === "Tab" && dialog) {
        const nodes = dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    }

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onCancel]);

  if (!open) return null;

  return createPortal(
    <div
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-message"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog box */}
      <div className="relative z-10 w-full max-w-sm border border-[#222729] bg-[#111416] rounded-[10px] shadow-xl">
        {/* Header */}
        <div className="border-b border-[#222729] px-5 py-3">
          <div className="font-mono text-[9px] font-bold tracking-widest uppercase text-[#3d4549] mb-1">
            // CONFIRM ACTION
          </div>
          <p
            id="confirm-dialog-title"
            className="font-mono text-[13px] font-semibold text-[#e8edf0]"
          >
            {title}
          </p>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          <p
            id="confirm-dialog-message"
            className="font-mono text-[11px] text-[#8b9499] leading-relaxed"
          >
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-[#222729] px-5 py-3">
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
