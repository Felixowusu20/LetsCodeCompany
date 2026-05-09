import { NextResponse } from "next/server";
import { getAdminSessionOr401 } from "../../../../../lib/auth";
import { prisma } from "../../../../../lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const auth = await getAdminSessionOr401();
  if (!auth.ok) return auth.response;
  const { id } = await ctx.params;

  let body: { title?: string; description?: string; icon?: string; image?: string; sortOrder?: number };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const title = body.title?.trim();
  const description = body.description?.trim();
  if (!title || !description) {
    return NextResponse.json({ error: "Title and description are required." }, { status: 400 });
  }

  const icon = body.icon?.trim() ?? "";
  const image = body.image?.trim() ?? "";
  const sortOrder = Number.isFinite(body.sortOrder) ? Number(body.sortOrder) : 0;

  const updated = await prisma.service.update({
    where: { id },
    data: {
      title,
      description,
      icon: icon || null,
      image,
      sortOrder,
    },
  });

  return NextResponse.json({
    id: updated.id,
    title: updated.title,
    description: updated.description,
    icon: updated.icon ?? null,
    image: updated.image,
    sortOrder: updated.sortOrder,
  });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const auth = await getAdminSessionOr401();
  if (!auth.ok) return auth.response;
  const { id } = await ctx.params;
  await prisma.service.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}

