import { NextResponse } from "next/server";
import { getAdminSessionOr401 } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  const auth = await getAdminSessionOr401();
  if (!auth.ok) return auth.response;
  const rows = await prisma.partner.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json(
    rows.map((p) => ({
      id: p.id,
      name: p.name,
      logo: p.logo,
      website: p.website ?? undefined,
    })),
  );
}

export async function POST(req: Request) {
  const auth = await getAdminSessionOr401();
  if (!auth.ok) return auth.response;
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
  const created = await prisma.partner.create({
    data: {
      name,
      logo,
      website: website || null,
    },
  });
  return NextResponse.json({
    id: created.id,
    name: created.name,
    logo: created.logo,
    website: created.website ?? undefined,
  });
}
