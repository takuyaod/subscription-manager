import * as React from "react";
import { cn } from "@/lib/utils";

function Select({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "flex h-9 w-full border border-[#222729] bg-[#0c0e0f] px-3 py-1 font-mono text-sm text-[#e8edf0] tracking-[0.02em] transition-colors focus-visible:outline-none focus-visible:border-[#3dd68c] focus-visible:ring-1 focus-visible:ring-[#3dd68c44] disabled:cursor-not-allowed disabled:opacity-50 rounded-[6px]",
        className,
      )}
      {...props}
    />
  );
}

export { Select };
