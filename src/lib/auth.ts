import { hash, verify } from "@node-rs/argon2";
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

export async function hashPassword(password: string): Promise<string> {
  return hash(password, { memoryCost: 19456, timeCost: 2, outputLen: 32, parallelism: 1 });
}

export async function verifyPassword(hashed: string, password: string): Promise<boolean> {
  return verify(hashed, password);
}
