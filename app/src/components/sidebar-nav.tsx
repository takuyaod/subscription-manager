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

const mobileNavItems = [
  { href: "/", label: "home", cmd: "~/" },
  { href: "/subscriptions", label: "subs", cmd: "ls" },
  { href: "/payment-methods", label: "pay", cmd: "pm" },
  { href: "/addresses", label: "addr", cmd: "addr" },
];

export function SidebarNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex h-full w-[220px] shrink-0 flex-col border-r border-[#222729] bg-[#111416] rounded-r-[14px]">
        {/* macOS window chrome */}
        <div className="border-b border-[#222729] px-4 pb-3 pt-[14px]">
          <div className="mb-[14px] flex items-center gap-[7px]">
            <div className="h-[11px] w-[11px] shrink-0 rounded-full bg-[#ff5f57]" />
            <div className="h-[11px] w-[11px] shrink-0 rounded-full bg-[#ffbd2e]" />
            <div className="h-[11px] w-[11px] shrink-0 rounded-full bg-[#28c840]" />
          </div>
          <div className="font-mono text-[11px] text-[#8b9499]">
            subscriptions
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3">
          {navItems.map(({ href, label, cmd }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative flex items-center gap-[10px] border-l-2 px-[18px] py-[9px] font-mono transition-colors",
                  active
                    ? "border-[#3dd68c] bg-[#181d1f]"
                    : "border-transparent hover:bg-[#181d1f]",
                )}
              >
                <span
                  className={cn(
                    "w-7 shrink-0 text-[10px] font-bold tracking-[0.04em]",
                    active ? "text-[#3dd68c]" : "text-[#3d4549]",
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
        </nav>
      </aside>

      {/* Mobile top header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex md:hidden items-center px-4 py-3 bg-[#111416] border-b border-[#222729]">
        <span className="font-mono text-[13px] font-bold text-[#dde3e7] tracking-[0.02em]">
          サブスク管理
        </span>
        <span className="ml-auto font-mono text-[10px] text-[#3d4549]">
          ~/subscriptions
        </span>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden bg-[#111416] border-t border-[#222729]">
        {mobileNavItems.map(({ href, label, cmd }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-[3px] py-2.5 border-t-2 font-mono transition-colors",
                active ? "border-[#3dd68c]" : "border-transparent",
              )}
            >
              <span
                className={cn(
                  "text-[11px] font-bold tracking-[0.04em]",
                  active ? "text-[#3dd68c]" : "text-[#3d4549]",
                )}
              >
                {cmd}
              </span>
              <span
                className={cn(
                  "text-[9px] tracking-[0.04em] uppercase",
                  active ? "text-[#e8edf0]" : "text-[#8b9499]",
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
