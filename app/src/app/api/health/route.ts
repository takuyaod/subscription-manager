import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export async function GET() {
  const result = await db.execute(sql`SELECT 1 AS ok`);
  return Response.json({ status: "ok", db: result.rows[0] });
}
