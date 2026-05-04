import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { addresses } from "@/db/schema";
import { getUserId } from "@/utils/get-user-id";
import { Button } from "@/components/ui/button";
import { AddressList } from "@/features/addresses/components/address-list";

export default async function AddressesPage() {
  const userId = await getUserId();
  const allAddresses = await db
    .select()
    .from(addresses)
    .where(eq(addresses.userId, userId))
    .orderBy(desc(addresses.createdAt));

  return (
    <div>
      <div className="mb-6 border-b border-[#222729] pb-5">
        <div className="mb-2 font-mono text-[10px] font-bold tracking-[0.06em] text-[#3dd68c]">
          ~/subscriptions $ addr
        </div>
        <div className="flex items-center justify-between">
          <h1 className="font-mono text-xl font-bold tracking-tight text-[#e8edf0]">住所</h1>
          <Button asChild>
            <Link href="/addresses/new">
              <Plus className="h-4 w-4" />
              NEW
            </Link>
          </Button>
        </div>
      </div>
      <AddressList addresses={allAddresses} />
    </div>
  );
}
