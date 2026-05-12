import { config } from "dotenv";

config({ path: ".env.local" });

const testUrl = process.env.DATABASE_URL_TEST;

if (!testUrl) {
  throw new Error(
    "DATABASE_URL_TEST is required for `pnpm test:db`. Set it in .env.local to an isolated Neon test branch.",
  );
}

process.env.DATABASE_URL = testUrl;
