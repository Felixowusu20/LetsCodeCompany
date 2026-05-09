import { NextResponse } from "next/server";
import { contactProjectTypeFromApi } from "../../../lib/contactDto";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  let body: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    projectType?: string;
    projectDetails?: string;
    message?: string;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  const phone = body.phone?.trim();
  const message = body.message?.trim();
  const projectType = contactProjectTypeFromApi(String(body.projectType ?? "").trim());

  if (!name || !email || !phone || !message || !projectType) {
    return NextResponse.json(
      { error: "Name, email, phone, project interest, and message are required." },
      { status: 400 },
    );
  }

  try {
    await prisma.contactSubmission.create({
      data: {
        name,
        email,
        phone,
        company: body.company?.trim() || null,
        projectType,
        projectDetails: body.projectDetails?.trim() || null,
        message,
      },
    });
  } catch {
    return NextResponse.json({ error: "Could not save your message. Try again later." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
