import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full border border-[#2a2f32] bg-[#0c0e0f] px-3 py-2 font-mono text-sm text-[#e8edf0] tracking-[0.02em] transition-colors placeholder:text-[#4a5358] focus-visible:outline-none focus-visible:border-[#3dd68c] focus-visible:ring-1 focus-visible:ring-[#3dd68c44] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
