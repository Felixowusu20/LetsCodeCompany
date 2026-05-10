import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../prisma/generated/prisma/client";
import pg from "pg";
import { normalizePgConnectionString } from "./pgConnectionString";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrisma() {
  const raw =
    process.env.DATABASE_URL ??
    "postgresql://127.0.0.1:5432/prisma_generate_placeholder?schema=public";
  const connectionString = normalizePgConnectionString(raw);
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Stale long‑running dev servers can keep a PrismaClient instance from before
 * `npx prisma generate` (e.g. new `FooterContent` model) so `prisma.footerContent` is undefined.
 * Use this before calling a model delegate, or run `npx prisma generate` and restart `next dev`.
 */
export function prismaDelegateOrNull(
  name: "footerContent" | "aboutContent" | "siteBranding",
) {
  const d = (prisma as unknown as Record<string, unknown>)[name];
  if (d == null || typeof d !== "object") return null;
  return d as { findFirst: (args: unknown) => Promise<unknown> };
}

export const prismaOutOfDateMessage =
  'Prisma client is out of date. Run "npx prisma generate", then restart the dev server (or redeploy).';
