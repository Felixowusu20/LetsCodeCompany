import { NextResponse } from "next/server";
import { attachSessionCookie, signSession } from "../../../../../lib/auth";
import { hashPassword } from "../../../../../lib/password";
import { prisma } from "../../../../../lib/prisma";

function isUniqueViolation(err: unknown): boolean {
  return typeof err === "object" && err !== null && "code" in err && (err as { code: string }).code === "P2002";
}

function isJwtSecretError(err: unknown): boolean {
  return err instanceof Error && /ADMIN_JWT_SECRET|JWT_SECRET/.test(err.message);
}

export async function POST(req: Request) {
  const openRegistration = process.env.ADMIN_OPEN_REGISTRATION === "true";
  let count: number;
  try {
    count = await prisma.adminUser.count();
  } catch {
    return NextResponse.json({ error: "Database unavailable." }, { status: 503 });
  }

  if (count > 0 && !openRegistration) {
    return NextResponse.json({ error: "Registration is closed. Sign in with an existing admin account." }, { status: 403 });
  }

  let body: { email?: string; password?: string };
  try {
    body = (await req.json()) as { email?: string; password?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  try {
    const existing = await prisma.adminUser.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "An admin with this email already exists." }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.adminUser.create({
      data: { email, passwordHash },
    });

    const token = await signSession({ sub: user.id, email: user.email });
    const res = NextResponse.json({ ok: true, email: user.email });
    return attachSessionCookie(res, token);
  } catch (err) {
    if (isUniqueViolation(err)) {
      return NextResponse.json({ error: "An admin with this email already exists." }, { status: 409 });
    }
    if (isJwtSecretError(err)) {
      return NextResponse.json(
        {
          error:
            "Server misconfiguration: set ADMIN_JWT_SECRET or JWT_SECRET (min 16 characters) for admin sessions.",
        },
        { status: 500 },
      );
    }
    console.error(err);
    return NextResponse.json({ error: "Registration failed." }, { status: 500 });
  }
}
