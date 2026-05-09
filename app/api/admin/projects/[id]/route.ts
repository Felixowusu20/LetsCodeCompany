import { NextResponse } from "next/server";
import { getAdminSessionOr401 } from "../../../../../lib/auth";
import { prisma } from "../../../../../lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const auth = await getAdminSessionOr401();
  if (!auth.ok) return auth.response;
  const { id } = await ctx.params;
  let body: { title?: string; description?: string; image?: string; tags?: string[]; websiteUrl?: string; downloadUrl?: string };
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
  const tags = Array.isArray(body.tags) ? body.tags.map((t) => String(t).trim()).filter(Boolean) : [];
  try {
    const updated = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        image: body.image?.trim() ?? "",
        tags,
        websiteUrl: body.websiteUrl?.trim() || null,
        downloadUrl: body.downloadUrl?.trim() || null,
      },
    });
    return NextResponse.json({
      id: updated.id,
      title: updated.title,
      description: updated.description,
      image: updated.image,
      tags: updated.tags,
      websiteUrl: updated.websiteUrl ?? null,
      downloadUrl: updated.downloadUrl ?? null,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        error:
          "Could not update project. Run `npx prisma db push` so the schema matches (websiteUrl / downloadUrl columns).",
      },
      { status: 503 },
    );
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const auth = await getAdminSessionOr401();
  if (!auth.ok) return auth.response;
  const { id } = await ctx.params;
  try {
    await prisma.project.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Could not delete project." }, { status: 503 });
  }
}
