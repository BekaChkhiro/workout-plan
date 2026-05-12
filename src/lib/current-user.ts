import { asc } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";

export async function getCurrentUserId(): Promise<string> {
  const rows = await db.select({ id: users.id }).from(users).orderBy(asc(users.createdAt)).limit(1);

  const row = rows[0];
  if (!row) {
    throw new Error("No user found. Run `pnpm seed:owner` to create one.");
  }
  return row.id;
}
