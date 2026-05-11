import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

config({ path: '.env.local' });

async function main() {
  const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

  if (!url) {
    throw new Error('DATABASE_URL_UNPOOLED (preferred) or DATABASE_URL must be set in .env.local');
  }

  const client = postgres(url, { max: 1, prepare: false });

  await migrate(drizzle(client), { migrationsFolder: './drizzle' });
  await client.end();

  console.log('Migrations applied.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
