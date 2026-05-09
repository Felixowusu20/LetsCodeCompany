import { NextResponse } from "next/server";
import { getAdminSessionOr401 } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  const auth = await getAdminSessionOr401();
  if (!auth.ok) return auth.response;
  const rows = await prisma.service.findMany({ orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }] });
  return NextResponse.json(
    rows.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      icon: s.icon ?? null,
      image: s.image,
      sortOrder: s.sortOrder,
    })),
  );
}

export async function POST(req: Request) {
  const auth = await getAdminSessionOr401();
  if (!auth.ok) return auth.response;
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

  const created = await prisma.service.create({
    data: {
      title,
      description,
      icon: icon || null,
      image,
      sortOrder,
    },
  });

  return NextResponse.json({
    id: created.id,
    title: created.title,
    description: created.description,
    icon: created.icon ?? null,
    image: created.image,
    sortOrder: created.sortOrder,
  });
}

