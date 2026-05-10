import { NextResponse } from "next/server";
import type { Prisma } from "../../../../prisma/generated/prisma/client";
import type { SiteBranding as SiteBrandingRow } from "../../../../prisma/generated/prisma/client";
import { getAdminSessionOr401 } from "../../../../lib/auth";
import { prisma, prismaDelegateOrNull, prismaOutOfDateMessage } from "../../../../lib/prisma";

export const dynamic = "force-dynamic";

type BrandingDto = {
  id: string;
  logoWhenUiLightUrl: string;
  logoWhenUiDarkUrl: string;
  adminPanelLogoUrl: string;
  updatedAt: string;
};

function defaultsRow(): Prisma.SiteBrandingCreateInput {
  return {
    logoWhenUiLightUrl: "",
    logoWhenUiDarkUrl: "",
    adminPanelLogoUrl: "",
  };
}

function toDto(row: SiteBrandingRow): BrandingDto {
  return {
    id: row.id,
    logoWhenUiLightUrl: row.logoWhenUiLightUrl,
    logoWhenUiDarkUrl: row.logoWhenUiDarkUrl,
    adminPanelLogoUrl: row.adminPanelLogoUrl,
    updatedAt: row.updatedAt.toISOString(),
  };
}

async function loadOrCreate(): Promise<SiteBrandingRow> {
  if (!prismaDelegateOrNull("siteBranding")) {
    throw new Error(prismaOutOfDateMessage);
  }
  const existing = await prisma.siteBranding!.findFirst({
    orderBy: [{ updatedAt: "desc" }],
  });
  if (existing) return existing;
  return prisma.siteBranding!.create({ data: defaultsRow() });
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
    console.error("[admin/branding GET]", e);
    const msg =
      e instanceof Error ? e.message : "Could not load branding.";
    return jsonError(msg);
  }
}

type UpdateBody = Partial<
  Pick<BrandingDto, "logoWhenUiLightUrl" | "logoWhenUiDarkUrl" | "adminPanelLogoUrl">
>;

function buildUpdateData(body: UpdateBody): Prisma.SiteBrandingUpdateInput {
  const data: Prisma.SiteBrandingUpdateInput = {};
  if (typeof body.logoWhenUiLightUrl === "string") {
    data.logoWhenUiLightUrl = body.logoWhenUiLightUrl.trim();
  }
  if (typeof body.logoWhenUiDarkUrl === "string") {
    data.logoWhenUiDarkUrl = body.logoWhenUiDarkUrl.trim();
  }
  if (typeof body.adminPanelLogoUrl === "string") {
    data.adminPanelLogoUrl = body.adminPanelLogoUrl.trim();
  }
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
    const updated = await prisma.siteBranding!.update({
      where: { id: existing.id },
      data,
    });
    return NextResponse.json(toDto(updated));
  } catch (e) {
    console.error("[admin/branding PUT/PATCH]", e);
    const msg =
      e instanceof Error ? e.message : "Could not save branding.";
    return jsonError(msg);
  }
}

export async function PUT(req: Request) {
  return handleUpdate(req);
}

export async function PATCH(req: Request) {
  return handleUpdate(req);
}
