import { NextResponse } from "next/server";
import { getAdminSessionOr401 } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  const auth = await getAdminSessionOr401();
  if (!auth.ok) return auth.response;
  const rows = await prisma.member.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json(
    rows.map((m) => ({
      id: m.id,
      name: m.name,
      role: m.role,
      bio: m.bio,
      image: m.image,
    })),
  );
}

export async function POST(req: Request) {
  const auth = await getAdminSessionOr401();
  if (!auth.ok) return auth.response;
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
  const created = await prisma.member.create({
    data: {
      name,
      role,
      bio: body.bio?.trim() ?? "",
      image: body.image?.trim() ?? "",
    },
  });
  return NextResponse.json({
    id: created.id,
    name: created.name,
    role: created.role,
    bio: created.bio,
    image: created.image,
  });
}
