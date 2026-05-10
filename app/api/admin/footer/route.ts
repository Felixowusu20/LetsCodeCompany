import { NextResponse } from "next/server";
import type {
  FooterContent as FooterContentRow,
  Prisma,
} from "../../../../prisma/generated/prisma/client";
import { getAdminSessionOr401 } from "../../../../lib/auth";
import { footerMock } from "../../../../lib/mockData";
import {
  prisma,
  prismaDelegateOrNull,
  prismaOutOfDateMessage,
} from "../../../../lib/prisma";

export const dynamic = "force-dynamic";

type FooterLinkDto = { label: string; href: string };

type FooterDto = {
  id: string;
  companyName: string;
  tagline: string;
  exploreColumnTitle: string;
  exploreLinks: FooterLinkDto[];
  companyColumnTitle: string;
  companyLinks: FooterLinkDto[];
  ctaTitle: string;
  ctaBody: string;
  ctaButtonLabel: string;
  ctaButtonHref: string;
  copyrightText: string;
  termsLabel: string;
  termsHref: string;
  updatedAt: string;
};

function defaultsFromMock(): Prisma.FooterContentCreateInput {
  return {
    companyName: footerMock.companyName,
    tagline: footerMock.tagline,
    exploreColumnTitle: footerMock.exploreColumnTitle,
    exploreLinks: footerMock.exploreLinks as Prisma.InputJsonValue,
    companyColumnTitle: footerMock.companyColumnTitle,
    companyLinks: footerMock.companyLinks as Prisma.InputJsonValue,
    ctaTitle: footerMock.ctaTitle,
    ctaBody: footerMock.ctaBody,
    ctaButtonLabel: footerMock.ctaButtonLabel,
    ctaButtonHref: footerMock.ctaButtonHref,
    copyrightText: footerMock.copyrightText,
    termsLabel: footerMock.termsLabel,
    termsHref: footerMock.termsHref,
  };
}

function coerceFooterLinks(raw: unknown): FooterLinkDto[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((entry): FooterLinkDto | null => {
      if (!entry || typeof entry !== "object") return null;
      const obj = entry as Record<string, unknown>;
      const label = typeof obj.label === "string" ? obj.label.trim() : "";
      const href = typeof obj.href === "string" ? obj.href.trim() : "";
      if (!label || !href) return null;
      return { label, href };
    })
    .filter((v): v is FooterLinkDto => v !== null);
}

function toDto(row: FooterContentRow): FooterDto {
  return {
    id: row.id,
    companyName: row.companyName,
    tagline: row.tagline,
    exploreColumnTitle: row.exploreColumnTitle,
    exploreLinks: coerceFooterLinks(row.exploreLinks),
    companyColumnTitle: row.companyColumnTitle,
    companyLinks: coerceFooterLinks(row.companyLinks),
    ctaTitle: row.ctaTitle,
    ctaBody: row.ctaBody,
    ctaButtonLabel: row.ctaButtonLabel,
    ctaButtonHref: row.ctaButtonHref,
    copyrightText: row.copyrightText,
    termsLabel: row.termsLabel,
    termsHref: row.termsHref,
    updatedAt: row.updatedAt.toISOString(),
  };
}

async function loadOrCreate(): Promise<FooterContentRow> {
  if (!prismaDelegateOrNull("footerContent")) {
    throw new Error(prismaOutOfDateMessage);
  }
  const existing = await prisma.footerContent!.findFirst({
    orderBy: [{ updatedAt: "desc" }],
  });
  if (existing) return existing;
  return prisma.footerContent!.create({ data: defaultsFromMock() });
}

function jsonError(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET() {
  try {
    const auth = await getAdminSessionOr401();
    if (!auth.ok) return auth.response;
    const row = await loadOrCreate();
    return NextResponse.json(toDto(row));
  } catch (e) {
    console.error("[admin/footer GET]", e);
    const msg =
      e instanceof Error ? e.message : "Could not load Footer content.";
    return jsonError(msg);
  }
}

type UpdateBody = Partial<Omit<FooterDto, "id" | "updatedAt">>;

function buildUpdateData(body: UpdateBody): Prisma.FooterContentUpdateInput {
  const data: Prisma.FooterContentUpdateInput = {};

  if (typeof body.companyName === "string") data.companyName = body.companyName.trim();
  if (typeof body.tagline === "string") data.tagline = body.tagline.trim();
  if (typeof body.exploreColumnTitle === "string") {
    data.exploreColumnTitle = body.exploreColumnTitle.trim();
  }
  if (Array.isArray(body.exploreLinks)) {
    data.exploreLinks = coerceFooterLinks(body.exploreLinks) as Prisma.InputJsonValue;
  }
  if (typeof body.companyColumnTitle === "string") {
    data.companyColumnTitle = body.companyColumnTitle.trim();
  }
  if (Array.isArray(body.companyLinks)) {
    data.companyLinks = coerceFooterLinks(body.companyLinks) as Prisma.InputJsonValue;
  }
  if (typeof body.ctaTitle === "string") data.ctaTitle = body.ctaTitle.trim();
  if (typeof body.ctaBody === "string") data.ctaBody = body.ctaBody.trim();
  if (typeof body.ctaButtonLabel === "string") data.ctaButtonLabel = body.ctaButtonLabel.trim();
  if (typeof body.ctaButtonHref === "string") data.ctaButtonHref = body.ctaButtonHref.trim();
  if (typeof body.copyrightText === "string") data.copyrightText = body.copyrightText.trim();
  if (typeof body.termsLabel === "string") data.termsLabel = body.termsLabel.trim();
  if (typeof body.termsHref === "string") data.termsHref = body.termsHref.trim();

  return data;
}

async function handleUpdate(req: Request) {
  try {
    const auth = await getAdminSessionOr401();
    if (!auth.ok) return auth.response;

    let body: UpdateBody;
    try {
      body = (await req.json()) as UpdateBody;
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const existing = await loadOrCreate();
    const data = buildUpdateData(body);
    if (Object.keys(data).length === 0) {
      return NextResponse.json(toDto(existing));
    }
    const updated = await prisma.footerContent!.update({
      where: { id: existing.id },
      data,
    });
    return NextResponse.json(toDto(updated));
  } catch (e) {
    console.error("[admin/footer PUT/PATCH]", e);
    const msg =
      e instanceof Error ? e.message : "Could not save Footer content.";
    return jsonError(msg);
  }
}

export async function PUT(req: Request) {
  return handleUpdate(req);
}

export async function PATCH(req: Request) {
  return handleUpdate(req);
}
