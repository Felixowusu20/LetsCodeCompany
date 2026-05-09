import { NextResponse } from "next/server";
import { getAdminSessionOr401 } from "../../../../../lib/auth";
import { prisma } from "../../../../../lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const auth = await getAdminSessionOr401();
  if (!auth.ok) return auth.response;
  const { id } = await ctx.params;
  let body: { title?: string; subtitle?: string; image?: string; cta?: string; sortOrder?: number };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const title = body.title?.trim();
  const subtitle = body.subtitle?.trim();
  const image = body.image?.trim() ?? "";
  if (!title || !subtitle || !image) {
    return NextResponse.json({ error: "Title, subtitle, and image are required." }, { status: 400 });
  }
  const updated = await prisma.heroSlide.update({
    where: { id },
    data: {
      title,
      subtitle,
      image,
      cta: body.cta?.trim() || "Get Started",
      sortOrder: typeof body.sortOrder === "number" ? body.sortOrder : undefined,
    },
  });
  return NextResponse.json({
    id: updated.id,
    title: updated.title,
    subtitle: updated.subtitle,
    image: updated.image,
    cta: updated.cta,
    sortOrder: updated.sortOrder,
  });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const auth = await getAdminSessionOr401();
  if (!auth.ok) return auth.response;
  const { id } = await ctx.params;
  await prisma.heroSlide.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
