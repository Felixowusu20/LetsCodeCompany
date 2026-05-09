import { NextResponse } from "next/server";
import { getAdminSessionOr401 } from "../../../../../lib/auth";
import { prisma } from "../../../../../lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const auth = await getAdminSessionOr401();
  if (!auth.ok) return auth.response;
  const { id } = await ctx.params;
  let body: { name?: string; logo?: string; website?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const name = body.name?.trim();
  const logo = body.logo?.trim() ?? "";
  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (!logo) {
    return NextResponse.json({ error: "Logo image is required (upload a file)." }, { status: 400 });
  }
  const website = body.website?.trim();
  const updated = await prisma.partner.update({
    where: { id },
    data: {
      name,
      logo,
      website: website || null,
    },
  });
  return NextResponse.json({
    id: updated.id,
    name: updated.name,
    logo: updated.logo,
    website: updated.website ?? undefined,
  });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const auth = await getAdminSessionOr401();
  if (!auth.ok) return auth.response;
  const { id } = await ctx.params;
  await prisma.partner.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
