import { NextResponse } from "next/server";
import { getAdminSessionOr401 } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  const auth = await getAdminSessionOr401();
  if (!auth.ok) return auth.response;
  try {
    const rows = await prisma.project.findMany({ orderBy: { updatedAt: "desc" } });
    return NextResponse.json(
      rows.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        image: p.image,
        tags: p.tags,
        websiteUrl: p.websiteUrl ?? null,
        downloadUrl: p.downloadUrl ?? null,
      })),
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        error:
          "Could not load projects. Run `npx prisma db push` so the database schema matches (including websiteUrl / downloadUrl).",
      },
      { status: 503 },
    );
  }
}

export async function POST(req: Request) {
  const auth = await getAdminSessionOr401();
  if (!auth.ok) return auth.response;
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
    const created = await prisma.project.create({
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
      id: created.id,
      title: created.title,
      description: created.description,
      image: created.image,
      tags: created.tags,
      websiteUrl: created.websiteUrl ?? null,
      downloadUrl: created.downloadUrl ?? null,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        error:
          "Could not save project. Run `npx prisma db push` so the Project table includes websiteUrl and downloadUrl.",
      },
      { status: 503 },
    );
  }
}
