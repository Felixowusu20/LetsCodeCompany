import { NextResponse } from "next/server";
import { getAdminSessionOr401 } from "../../../../../lib/auth";
import { contactStatusFromApi, contactToApi } from "../../../../../lib/contactDto";
import { prisma } from "../../../../../lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const auth = await getAdminSessionOr401();
  if (!auth.ok) return auth.response;
  const { id } = await ctx.params;
  let body: { status?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const status = body.status;
  if (!status) {
    return NextResponse.json({ error: "status is required." }, { status: 400 });
  }
  const updated = await prisma.contactSubmission.update({
    where: { id },
    data: { status: contactStatusFromApi(status) },
  });
  return NextResponse.json(contactToApi(updated));
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const auth = await getAdminSessionOr401();
  if (!auth.ok) return auth.response;
  const { id } = await ctx.params;
  await prisma.contactSubmission.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
