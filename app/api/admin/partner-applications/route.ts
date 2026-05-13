import { NextResponse } from "next/server";
import { getAdminSessionOr401 } from "../../../../lib/auth";
import { partnerApplicationToApi } from "../../../../lib/partnerApplicationDto";
import { partnerApplicationsPrismaErrorResponse } from "../../../../lib/partnerApplicationsDbErrorResponse";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  const auth = await getAdminSessionOr401();
  if (!auth.ok) return auth.response;

  try {
    const rows = await prisma.partnerApplication.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(rows.map(partnerApplicationToApi));
  } catch (e) {
    return partnerApplicationsPrismaErrorResponse(e);
  }
}
