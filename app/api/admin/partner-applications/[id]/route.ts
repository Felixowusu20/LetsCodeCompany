import { NextResponse } from "next/server";
import { getAdminSessionOr401 } from "../../../../../lib/auth";
import {
  partnerApplicationStatusFromApi,
  partnerApplicationToApi,
} from "../../../../../lib/partnerApplicationDto";
import { partnerApplicationsPrismaErrorResponse } from "../../../../../lib/partnerApplicationsDbErrorResponse";
import { prisma } from "../../../../../lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const auth = await getAdminSessionOr401();
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  let body: { status?: string; notes?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const data: { status?: ReturnType<typeof partnerApplicationStatusFromApi>; notes?: string | null } = {};
  if (typeof body.status === "string" && body.status.trim().length > 0) {
    data.status = partnerApplicationStatusFromApi(body.status);
  }
  if (typeof body.notes === "string") {
    const trimmed = body.notes.trim();
    data.notes = trimmed.length > 0 ? trimmed : null;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  try {
    const updated = await prisma.partnerApplication.update({
      where: { id },
      data,
    });
    return NextResponse.json(partnerApplicationToApi(updated));
  } catch (e) {
    return partnerApplicationsPrismaErrorResponse(e);
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const auth = await getAdminSessionOr401();
  if (!auth.ok) return auth.response;
  const { id } = await ctx.params;
  try {
    await prisma.partnerApplication.delete({ where: { id } });
  } catch (e) {
    return partnerApplicationsPrismaErrorResponse(e);
  }
  return new NextResponse(null, { status: 204 });
}
