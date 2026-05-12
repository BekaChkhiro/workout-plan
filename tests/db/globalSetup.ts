import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

config({ path: ".env.local" });

export default async function globalSetup(): Promise<void> {
  const url = process.env.DATABASE_URL_TEST;
  if (!url) {
    throw new Error(
      "DATABASE_URL_TEST is required for `pnpm test:db`. Set it in .env.local to an isolated Neon test branch.",
    );
  }

  process.env.DATABASE_URL = url;

  const client = postgres(url, { max: 1, prepare: false });
  try {
    // Start from a clean slate every run — guarantees the schema matches
    // ./drizzle migrations regardless of how the test branch was created
    // (Current data / Schema only / leftover from a previous run).
    await client.unsafe(`DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;`);
    await client.unsafe(`DROP SCHEMA IF EXISTS drizzle CASCADE;`);
    await migrate(drizzle(client), { migrationsFolder: "./drizzle" });
  } finally {
    await client.end();
  }

  const { seedDefaultMeals } = await import("../../src/db/seed");
  await seedDefaultMeals();
}
