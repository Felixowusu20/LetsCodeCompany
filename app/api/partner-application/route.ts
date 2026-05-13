import { NextResponse } from "next/server";
import {
  companySizeFromApi,
  partnerTimelineFromApi,
  partnershipTypeFromApi,
} from "../../../lib/partnerApplicationDto";
import { partnerApplicationsPrismaErrorResponse } from "../../../lib/partnerApplicationsDbErrorResponse";
import { prisma } from "../../../lib/prisma";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const str = (k: string) => {
    const v = body[k];
    return typeof v === "string" ? v.trim() : "";
  };
  const optStr = (k: string) => {
    const v = str(k);
    return v.length > 0 ? v : null;
  };

  const companyName = str("companyName");
  const contactName = str("contactName");
  const contactEmail = str("contactEmail").toLowerCase();
  const goals = str("goals");
  const companySize = companySizeFromApi(str("companySize"));
  const partnershipType = partnershipTypeFromApi(str("partnershipType"));
  const timeline = partnerTimelineFromApi(str("timeline"));

  if (
    !companyName ||
    !contactName ||
    !contactEmail ||
    !goals ||
    !companySize ||
    !partnershipType ||
    !timeline
  ) {
    return NextResponse.json(
      {
        error:
          "Company name, contact name, email, goals, company size, partnership type, and timeline are required.",
      },
      { status: 400 },
    );
  }

  if (!EMAIL_RE.test(contactEmail)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 },
    );
  }

  if (goals.length < 10) {
    return NextResponse.json(
      { error: "Tell us a little more about your goals (10+ characters)." },
      { status: 400 },
    );
  }

  try {
    await prisma.partnerApplication.create({
      data: {
        companyName,
        website: optStr("website"),
        industry: optStr("industry"),
        companySize,
        headquarters: optStr("headquarters"),
        contactName,
        contactRole: optStr("contactRole"),
        contactEmail,
        contactPhone: optStr("contactPhone"),
        partnershipType,
        goals,
        audienceFit: optStr("audienceFit"),
        expertise: optStr("expertise"),
        timeline,
        budgetRange: optStr("budgetRange"),
        referralSource: optStr("referralSource"),
      },
    });
  } catch (e) {
    return partnerApplicationsPrismaErrorResponse(e);
  }

  return NextResponse.json({ ok: true });
}
