import { NextResponse } from "next/server";
import { Prisma } from "../prisma/generated/prisma/client";

/** Maps Prisma failures to JSON responses for admin client-project routes. */
export function clientProjectsPrismaErrorResponse(error: unknown): NextResponse {
  console.error("[client-projects]", error);
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
    return NextResponse.json({ error: "Client project not found." }, { status: 404 });
  }
  const migrateHint =
    "Apply pending migrations: npx prisma migrate deploy — or dev: npx prisma migrate dev — then restart the server.";
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2022") {
    return NextResponse.json(
      { error: `Database schema is out of date (${String(error.meta?.column ?? "column")}). ${migrateHint}` },
      { status: 503 },
    );
  }
  return NextResponse.json(
    { error: `Database error while accessing client projects. ${migrateHint}` },
    { status: 503 },
  );
}
