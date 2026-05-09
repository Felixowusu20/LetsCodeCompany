import { NextResponse } from "next/server";
import { getAdminSessionOr401 } from "../../../../../lib/auth";
import { prisma } from "../../../../../lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const auth = await getAdminSessionOr401();
  if (!auth.ok) return auth.response;
  const { id } = await ctx.params;
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
  const updated = await prisma.blogPost.update({
    where: { id },
    data: {
      title,
      excerpt,
      content: body.content?.trim() ?? "",
      author,
      date: body.date?.trim() ?? "",
      image: body.image?.trim() ?? "",
      authorAvatar: body.authorAvatar?.trim() ?? "",
      comments: typeof body.comments === "number" ? body.comments : undefined,
    },
  });
  return NextResponse.json({
    id: updated.id,
    title: updated.title,
    excerpt: updated.excerpt,
    content: updated.content,
    author: updated.author,
    date: updated.date,
    image: updated.image,
    authorAvatar: updated.authorAvatar,
    comments: updated.comments,
  });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const auth = await getAdminSessionOr401();
  if (!auth.ok) return auth.response;
  const { id } = await ctx.params;
  await prisma.blogPost.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
