import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users, type User } from "@/db/schema";

const DEFAULT_OWNER_EMAIL = "mei@fitplan.ge";

export async function getOwnerUser(): Promise<User> {
  const email = process.env.OWNER_EMAIL ?? DEFAULT_OWNER_EMAIL;
  const rows = await db.select().from(users).where(eq(users.email, email)).limit(1);
  const owner = rows[0];
  if (!owner) {
    throw new Error(
      `Owner user not found for ${email}. Run \`pnpm seed:owner\` to bootstrap the account.`,
    );
  }
  return owner;
}

export async function getOwnerUserId(): Promise<string> {
  const owner = await getOwnerUser();
  return owner.id;
}
