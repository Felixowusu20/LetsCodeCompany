import { NextResponse } from "next/server";
import type {
  AboutContent as AboutContentRow,
  Prisma,
} from "../../../../prisma/generated/prisma/client";
import { getAdminSessionOr401 } from "../../../../lib/auth";
import { aboutMock } from "../../../../lib/mockData";
import {
  prisma,
  prismaDelegateOrNull,
  prismaOutOfDateMessage,
} from "../../../../lib/prisma";

export const dynamic = "force-dynamic";

type AboutValueDto = { title: string; desc: string; image: string };

type AboutDto = {
  id: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  storyTitle: string;
  storyParagraphs: string[];
  storyImage: string;
  missionTitle: string;
  missionText: string;
  missionImage: string;
  visionTitle: string;
  visionText: string;
  visionImage: string;
  valuesTitle: string;
  valuesSubtitle: string;
  values: AboutValueDto[];
  updatedAt: string;
};

function defaultsFromMock(): Prisma.AboutContentCreateInput {
  const valuesJson = aboutMock.values.map((v) => ({
    title: v.title,
    desc: v.desc,
    image: v.image,
  })) satisfies AboutValueDto[];
  return {
    heroEyebrow: `About ${aboutMock.company}`,
    heroTitle: "Powerful service design for modern product teams.",
    heroSubtitle:
      "We combine engineering, design, and strategy to build digital products that feel premium and scale effortlessly.",
    storyTitle: aboutMock.story.title,
    storyParagraphs: aboutMock.story.paragraphs,
    storyImage: aboutMock.story.image,
    missionTitle: aboutMock.mission.title,
    missionText: aboutMock.mission.text,
    missionImage: aboutMock.mission.image,
    visionTitle: aboutMock.vision.title,
    visionText: aboutMock.vision.text,
    visionImage: aboutMock.vision.image,
    valuesTitle: "Our Values",
    valuesSubtitle:
      "The principles that guide our work and shape every customer experience.",
    values: valuesJson as Prisma.InputJsonValue,
  };
}

function coerceValues(raw: unknown): AboutValueDto[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((entry): AboutValueDto | null => {
      if (!entry || typeof entry !== "object") return null;
      const obj = entry as Record<string, unknown>;
      const title = typeof obj.title === "string" ? obj.title.trim() : "";
      const desc = typeof obj.desc === "string" ? obj.desc.trim() : "";
      const image = typeof obj.image === "string" ? obj.image.trim() : "";
      if (!title && !desc && !image) return null;
      return { title, desc, image };
    })
    .filter((v): v is AboutValueDto => v !== null);
}

function coerceParagraphs(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((p) => (typeof p === "string" ? p.trim() : ""))
    .filter((p) => p.length > 0);
}

function toDto(row: AboutContentRow): AboutDto {
  return {
    id: row.id,
    heroEyebrow: row.heroEyebrow,
    heroTitle: row.heroTitle,
    heroSubtitle: row.heroSubtitle,
    storyTitle: row.storyTitle,
    storyParagraphs: row.storyParagraphs ?? [],
    storyImage: row.storyImage,
    missionTitle: row.missionTitle,
    missionText: row.missionText,
    missionImage: row.missionImage,
    visionTitle: row.visionTitle,
    visionText: row.visionText,
    visionImage: row.visionImage,
    valuesTitle: row.valuesTitle,
    valuesSubtitle: row.valuesSubtitle,
    values: coerceValues(row.values),
    updatedAt: row.updatedAt.toISOString(),
  };
}

async function loadOrCreate(): Promise<AboutContentRow> {
  if (!prismaDelegateOrNull("aboutContent")) {
    throw new Error(prismaOutOfDateMessage);
  }
  const existing = await prisma.aboutContent!.findFirst({
    orderBy: [{ updatedAt: "desc" }],
  });
  if (existing) return existing;
  return prisma.aboutContent!.create({ data: defaultsFromMock() });
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
    console.error("[admin/about GET]", e);
    const msg =
      e instanceof Error ? e.message : "Could not load About content.";
    return jsonError(msg);
  }
}

type UpdateBody = Partial<Omit<AboutDto, "id" | "updatedAt">>;

function buildUpdateData(body: UpdateBody): Prisma.AboutContentUpdateInput {
  const data: Prisma.AboutContentUpdateInput = {};

  if (typeof body.heroEyebrow === "string") data.heroEyebrow = body.heroEyebrow.trim();
  if (typeof body.heroTitle === "string") data.heroTitle = body.heroTitle.trim();
  if (typeof body.heroSubtitle === "string") data.heroSubtitle = body.heroSubtitle.trim();

  if (typeof body.storyTitle === "string") data.storyTitle = body.storyTitle.trim();
  if (Array.isArray(body.storyParagraphs)) {
    data.storyParagraphs = { set: coerceParagraphs(body.storyParagraphs) };
  }
  if (typeof body.storyImage === "string") data.storyImage = body.storyImage.trim();

  if (typeof body.missionTitle === "string") data.missionTitle = body.missionTitle.trim();
  if (typeof body.missionText === "string") data.missionText = body.missionText.trim();
  if (typeof body.missionImage === "string") data.missionImage = body.missionImage.trim();

  if (typeof body.visionTitle === "string") data.visionTitle = body.visionTitle.trim();
  if (typeof body.visionText === "string") data.visionText = body.visionText.trim();
  if (typeof body.visionImage === "string") data.visionImage = body.visionImage.trim();

  if (typeof body.valuesTitle === "string") data.valuesTitle = body.valuesTitle.trim();
  if (typeof body.valuesSubtitle === "string") data.valuesSubtitle = body.valuesSubtitle.trim();
  if (Array.isArray(body.values)) {
    data.values = coerceValues(body.values) as Prisma.InputJsonValue;
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
    const updated = await prisma.aboutContent!.update({
      where: { id: existing.id },
      data,
    });
    return NextResponse.json(toDto(updated));
  } catch (e) {
    console.error("[admin/about PUT/PATCH]", e);
    const msg =
      e instanceof Error ? e.message : "Could not save About content.";
    return jsonError(msg);
  }
}

export async function PUT(req: Request) {
  return handleUpdate(req);
}

export async function PATCH(req: Request) {
  return handleUpdate(req);
}
