import { NextResponse } from "next/server";
import { getAdminSessionOr401 } from "../../../../../lib/auth";
import {
  companySizeToApi,
  partnerApplicationStatusToApi,
  partnerTimelineToApi,
  partnershipTypeToApi,
} from "../../../../../lib/partnerApplicationDto";
import {
  COMPANY_SIZE_LABELS,
  PARTNER_TIMELINE_LABELS,
  PARTNERSHIP_TYPE_LABELS,
} from "../../../../../lib/partnerApplicationShared";
import { partnerApplicationsPrismaErrorResponse } from "../../../../../lib/partnerApplicationsDbErrorResponse";
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

  let rows;
  try {
    rows = await prisma.partnerApplication.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    return partnerApplicationsPrismaErrorResponse(e);
  }

  const header = [
    "id",
    "createdAt",
    "status",
    "companyName",
    "website",
    "industry",
    "companySize",
    "headquarters",
    "contactName",
    "contactRole",
    "contactEmail",
    "contactPhone",
    "partnershipType",
    "timeline",
    "budgetRange",
    "referralSource",
    "goals",
    "audienceFit",
    "expertise",
    "notes",
  ];

  const body = rows.map((r) =>
    [
      r.id,
      r.createdAt.toISOString(),
      partnerApplicationStatusToApi(r.status),
      r.companyName,
      r.website ?? "",
      r.industry ?? "",
      COMPANY_SIZE_LABELS[companySizeToApi(r.companySize)],
      r.headquarters ?? "",
      r.contactName,
      r.contactRole ?? "",
      r.contactEmail,
      r.contactPhone ?? "",
      PARTNERSHIP_TYPE_LABELS[partnershipTypeToApi(r.partnershipType)],
      PARTNER_TIMELINE_LABELS[partnerTimelineToApi(r.timeline)],
      r.budgetRange ?? "",
      r.referralSource ?? "",
      r.goals,
      r.audienceFit ?? "",
      r.expertise ?? "",
      r.notes ?? "",
    ]
      .map(csvEscape)
      .join(","),
  );

  const csv = [header.join(","), ...body].join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="partner-applications.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
