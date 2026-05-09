import { NextResponse } from "next/server";
import { contactProjectTypeToApi, CONTACT_PROJECT_TYPE_LABELS } from "../../../../../lib/contactDto";
import { getAdminSessionOr401 } from "../../../../../lib/auth";
import { prisma } from "../../../../../lib/prisma";

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replaceAll('"', '""')}"`;
  return s;
}

export async function GET() {
  const auth = await getAdminSessionOr401();
  if (!auth.ok) return auth.response;

  const rows = await prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" } });

  const header = [
    "id",
    "name",
    "email",
    "phone",
    "company",
    "projectType",
    "projectDetails",
    "message",
    "status",
    "createdAt",
  ];
  const body = rows.map((r) =>
    [
      r.id,
      r.name,
      r.email,
      r.phone,
      r.company ?? "",
      CONTACT_PROJECT_TYPE_LABELS[contactProjectTypeToApi(r.projectType)],
      r.projectDetails ?? "",
      r.message,
      r.status,
      r.createdAt.toISOString(),
    ]
      .map(csvEscape)
      .join(","),
  );

  const csv = [header.join(","), ...body].join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="contact-submissions.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
