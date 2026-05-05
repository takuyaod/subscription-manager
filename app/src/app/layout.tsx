import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { SidebarNav } from "@/components/sidebar-nav";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Subscription Manager",
  description: "個人用サブスクリプション管理アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${jetbrainsMono.variable} h-full`}>
      <body className="flex h-full font-mono antialiased bg-background text-foreground">
        <SidebarNav />
        <main className="flex-1 overflow-auto px-4 pt-15 pb-20 md:p-10 bg-background">
          <div className="max-w-3xl mx-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
