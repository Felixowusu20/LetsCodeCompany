import { NextResponse } from "next/server";
import { Prisma } from "../prisma/generated/prisma/client";

/** Maps Prisma failures (e.g. missing column after schema change) to a JSON 503 instead of an uncaught 500. */
export function heroSlidesPrismaErrorResponse(error: unknown): NextResponse {
  console.error("[hero-slides]", error);
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  ) {
    return NextResponse.json({ error: "Hero slide not found." }, { status: 404 });
  }
  const migrateHint =
    'Apply pending migrations: npx prisma migrate deploy — or dev: npx prisma db push — then restart the server.';
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2022"
  ) {
    return NextResponse.json(
      { error: `Database schema is out of date (${error.meta?.column ?? "column"}). ${migrateHint}` },
      { status: 503 },
    );
  }
  return NextResponse.json(
    { error: `Database error while accessing hero slides. ${migrateHint}` },
    { status: 503 },
  );
}
