"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "dashboard", cmd: "~/" },
  { href: "/subscriptions", label: "subscriptions", cmd: "ls" },
  { href: "/payment-methods", label: "payment", cmd: "pm" },
  { href: "/addresses", label: "address", cmd: "addr" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[220px] shrink-0 flex-col border-r border-[#2a2f32] bg-[#111416]">
      {/* macOS window chrome */}
      <div className="border-b border-[#2a2f32] px-4 pb-3 pt-[14px]">
        <div className="mb-[14px] flex items-center gap-[7px]">
          <div className="h-[11px] w-[11px] shrink-0 rounded-full bg-[#ff5f57]" />
          <div className="h-[11px] w-[11px] shrink-0 rounded-full bg-[#ffbd2e]" />
          <div className="h-[11px] w-[11px] shrink-0 rounded-full bg-[#28c840]" />
        </div>
        <div className="font-mono text-[11px]">
          <span className="text-[#3dd68c]">user</span>
          <span className="text-[#4a5358]">@</span>
          <span className="text-[#4dabf7]">macbook</span>
          <span className="text-[#4a5358]"> — </span>
          <span className="text-[#8b9499]">subscriptions</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3">
        {navItems.map(({ href, label, cmd }) => {
          const active =
            pathname === href ||
            (href !== "/" && pathname.startsWith(href + "/"));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex items-center gap-[10px] border-l-2 px-[18px] py-[9px] font-mono transition-colors",
                active
                  ? "border-[#3dd68c] bg-[#1c2123]"
                  : "border-transparent hover:bg-[#1c2123]",
              )}
            >
              <span
                className={cn(
                  "w-7 shrink-0 text-[10px] font-bold tracking-[0.04em]",
                  active ? "text-[#3dd68c]" : "text-[#4a5358]",
                )}
              >
                {cmd}
              </span>
              <span
                className={cn(
                  "text-xs tracking-[0.01em]",
                  active
                    ? "font-bold text-[#e8edf0]"
                    : "font-normal text-[#8b9499]",
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}

        <div className="mt-2 border-t border-[#2a2f32] px-[18px] py-5 font-mono text-[10px] tracking-[0.06em] text-[#4a5358]">
          # QUICK NAV
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-[#2a2f32] px-[18px] py-[14px]">
        <div className="font-mono text-[10px] leading-[1.8] text-[#4a5358]">
          <div>
            <span className="text-[#3dd68c]">●</span> サブスク管理 v1.0
          </div>
          <div>2026-05-02</div>
        </div>
      </div>
    </aside>
  );
}
