import { NextResponse } from "next/server";
import { getAdminSessionOr401 } from "../../../../../lib/auth";
import { prisma } from "../../../../../lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const auth = await getAdminSessionOr401();
  if (!auth.ok) return auth.response;
  const { id } = await ctx.params;
  let body: { name?: string; role?: string; bio?: string; image?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const name = body.name?.trim();
  const role = body.role?.trim();
  if (!name || !role) {
    return NextResponse.json({ error: "Name and role are required." }, { status: 400 });
  }
  const updated = await prisma.member.update({
    where: { id },
    data: {
      name,
      role,
      bio: body.bio?.trim() ?? "",
      image: body.image?.trim() ?? "",
    },
  });
  return NextResponse.json({
    id: updated.id,
    name: updated.name,
    role: updated.role,
    bio: updated.bio,
    image: updated.image,
  });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const auth = await getAdminSessionOr401();
  if (!auth.ok) return auth.response;
  const { id } = await ctx.params;
  await prisma.member.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
