import { NextResponse } from "next/server";
import { getAdminSessionOr401 } from "../../../../lib/auth";
import { contactToApi } from "../../../../lib/contactDto";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  const auth = await getAdminSessionOr401();
  if (!auth.ok) return auth.response;
  const rows = await prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(rows.map(contactToApi));
}
