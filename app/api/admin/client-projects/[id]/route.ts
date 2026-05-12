import { NextResponse } from "next/server";
import { getAdminSessionOr401 } from "../../../../../lib/auth";
import { clientProjectsPrismaErrorResponse } from "../../../../../lib/clientProjectsDbErrorResponse";
import { prisma } from "../../../../../lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

function normalizeHttpUrl(raw: string | undefined | null): string | null {
  if (raw === undefined || raw === null) return null;
  const s = String(raw).trim();
  if (!s) return null;
  try {
    const u = new URL(s);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.href;
  } catch {
    return null;
  }
}

export async function PATCH(req: Request, ctx: Ctx) {
  const auth = await getAdminSessionOr401();
  if (!auth.ok) return auth.response;
  const { id } = await ctx.params;
  let body: {
    title?: string;
    description?: string;
    projectUrl?: string;
    imageUrl?: string;
    iconUrl?: string | null;
    iconLucide?: string | null;
    clientName?: string | null;
    year?: number | null;
    tags?: string[];
    featured?: boolean;
    sortOrder?: number;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const title = body.title?.trim();
  const description = body.description?.trim();
  const projectUrl = normalizeHttpUrl(body.projectUrl);
  if (!title || !description || !projectUrl) {
    return NextResponse.json(
      { error: "Title, description, and a valid http(s) project URL are required." },
      { status: 400 },
    );
  }
  const iconUrlNorm = normalizeHttpUrl(body.iconUrl);
  if (body.iconUrl != null && String(body.iconUrl).trim() && !iconUrlNorm) {
    return NextResponse.json({ error: "Icon URL must be a valid http(s) URL when provided." }, { status: 400 });
  }
  const tags = Array.isArray(body.tags) ? body.tags.map((t) => String(t).trim()).filter(Boolean) : [];
  const year =
    body.year === undefined || body.year === null || Number.isNaN(Number(body.year))
      ? null
      : Math.trunc(Number(body.year));
  try {
    const updated = await prisma.clientProject.update({
      where: { id },
      data: {
        title,
        description,
        projectUrl,
        imageUrl: body.imageUrl?.trim() ?? "",
        iconUrl: iconUrlNorm,
        iconLucide: body.iconLucide != null ? String(body.iconLucide).trim() || null : null,
        clientName: body.clientName != null ? String(body.clientName).trim() || null : null,
        year,
        tags,
        featured: Boolean(body.featured),
        sortOrder: typeof body.sortOrder === "number" ? body.sortOrder : undefined,
      },
    });
    return NextResponse.json(updated);
  } catch (e) {
    return clientProjectsPrismaErrorResponse(e);
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const auth = await getAdminSessionOr401();
  if (!auth.ok) return auth.response;
  const { id } = await ctx.params;
  try {
    await prisma.clientProject.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    return clientProjectsPrismaErrorResponse(e);
  }
}
