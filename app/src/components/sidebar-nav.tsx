"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CreditCard, MapPin, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/subscriptions", label: "サブスク", icon: RefreshCcw },
  { href: "/payment-methods", label: "支払い元", icon: CreditCard },
  { href: "/addresses", label: "住所", icon: MapPin },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-56 flex-col border-r bg-background px-3 py-4">
      <div className="mb-6 px-3">
        <h1 className="text-lg font-semibold">Subscription Manager</h1>
      </div>
      <nav className="flex flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              pathname === href || (href !== "/" && pathname.startsWith(href + "/"))
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
