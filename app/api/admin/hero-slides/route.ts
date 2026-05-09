import { NextResponse } from "next/server";
import { getAdminSessionOr401 } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  const auth = await getAdminSessionOr401();
  if (!auth.ok) return auth.response;
  const rows = await prisma.heroSlide.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json(
    rows.map((s) => ({
      id: s.id,
      title: s.title,
      subtitle: s.subtitle,
      image: s.image,
      cta: s.cta,
      sortOrder: s.sortOrder,
    })),
  );
}

export async function POST(req: Request) {
  const auth = await getAdminSessionOr401();
  if (!auth.ok) return auth.response;
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
  const created = await prisma.heroSlide.create({
    data: {
      title,
      subtitle,
      image,
      cta: body.cta?.trim() || "Get Started",
      sortOrder: typeof body.sortOrder === "number" ? body.sortOrder : 0,
    },
  });
  return NextResponse.json({
    id: created.id,
    title: created.title,
    subtitle: created.subtitle,
    image: created.image,
    cta: created.cta,
    sortOrder: created.sortOrder,
  });
}
