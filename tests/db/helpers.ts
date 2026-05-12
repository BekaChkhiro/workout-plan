import { randomUUID } from "node:crypto";

import { sql } from "drizzle-orm";

import { db } from "../../src/db";
import { users } from "../../src/db/schema";
import { seedUserPlan } from "../../src/db/helpers/seedUserPlan";

export async function truncateUserData(): Promise<void> {
  await db.execute(sql`TRUNCATE TABLE users CASCADE`);
}

type CreateUserOptions = {
  email?: string;
  name?: string;
  planStartDate?: string;
  seedPlan?: boolean;
};

export async function createTestUser(
  options: CreateUserOptions = {},
): Promise<{ id: string; email: string; name: string }> {
  const id = randomUUID();
  const email = options.email ?? `test-${id}@example.com`;
  const name = options.name ?? "Test User";

  await db.insert(users).values({
    id,
    email,
    name,
    passwordHash: "test-not-a-real-hash",
  });

  if (options.seedPlan !== false) {
    await seedUserPlan(
      id,
      options.planStartDate !== undefined ? { planStartDate: options.planStartDate } : {},
    );
  }

  return { id, email, name };
}
