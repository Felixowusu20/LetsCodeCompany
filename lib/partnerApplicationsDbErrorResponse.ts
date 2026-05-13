import { NextResponse } from "next/server";
import { Prisma } from "../prisma/generated/prisma/client";

/**
 * Maps Prisma failures to JSON responses for partner-application routes.
 * Gives a clear hint if the schema is out of date (table/enum missing).
 */
export function partnerApplicationsPrismaErrorResponse(
  error: unknown,
): NextResponse {
  console.error("[partner-applications]", error);

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  ) {
    return NextResponse.json(
      { error: "Partner application not found." },
      { status: 404 },
    );
  }

  const migrateHint =
    "Apply pending migrations: npx prisma migrate deploy — or dev: npx prisma migrate dev — then restart the server.";

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    (error.code === "P2021" || error.code === "P2022")
  ) {
    return NextResponse.json(
      {
        error: `Database schema is out of date for PartnerApplication. ${migrateHint}`,
      },
      { status: 503 },
    );
  }

  return NextResponse.json(
    {
      error: `Database error while accessing partner applications. ${migrateHint}`,
    },
    { status: 503 },
  );
}
