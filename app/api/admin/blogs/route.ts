import { NextResponse } from "next/server";
import { getAdminSessionOr401 } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  const auth = await getAdminSessionOr401();
  if (!auth.ok) return auth.response;
  const rows = await prisma.blogPost.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json(
    rows.map((p) => ({
      id: p.id,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      author: p.author,
      date: p.date,
      image: p.image,
      authorAvatar: p.authorAvatar,
      comments: p.comments,
    })),
  );
}

export async function POST(req: Request) {
  const auth = await getAdminSessionOr401();
  if (!auth.ok) return auth.response;
  let body: {
    title?: string;
    excerpt?: string;
    content?: string;
    author?: string;
    date?: string;
    image?: string;
    authorAvatar?: string;
    comments?: number;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const title = body.title?.trim();
  const excerpt = body.excerpt?.trim();
  const author = body.author?.trim();
  if (!title || !excerpt || !author) {
    return NextResponse.json({ error: "Title, excerpt, and author are required." }, { status: 400 });
  }
  const created = await prisma.blogPost.create({
    data: {
      title,
      excerpt,
      content: body.content?.trim() ?? "",
      author,
      date: body.date?.trim() ?? "",
      image: body.image?.trim() ?? "",
      authorAvatar: body.authorAvatar?.trim() ?? "",
      comments: typeof body.comments === "number" ? body.comments : 0,
    },
  });
  return NextResponse.json({
    id: created.id,
    title: created.title,
    excerpt: created.excerpt,
    content: created.content,
    author: created.author,
    date: created.date,
    image: created.image,
    authorAvatar: created.authorAvatar,
    comments: created.comments,
  });
}
