import { config } from "dotenv";
import { defineConfig } from "prisma/config";
import { normalizePgConnectionString } from "./lib/pgConnectionString";

// Next.js commonly keeps secrets in `.env.local`; Prisma CLI only auto-loads `.env`.
config({ path: ".env" });
config({ path: ".env.local", override: true });

const explicitUrl = process.env.DATABASE_URL?.trim();

/**
 * Fallback URL only so `prisma generate` / postinstall works without a live DB.
 * For `db push`, `migrate`, etc. set DATABASE_URL in `.env` or `.env.local` to your Neon string.
 */
const databaseUrl =
  explicitUrl && explicitUrl.length > 0
    ? normalizePgConnectionString(explicitUrl)
    : "postgresql://127.0.0.1:5432/prisma_generate_placeholder?schema=public";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: databaseUrl,
  },
});
