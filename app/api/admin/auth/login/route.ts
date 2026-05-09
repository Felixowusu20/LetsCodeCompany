import { NextResponse } from "next/server";
import { attachSessionCookie, signSession } from "../../../../../lib/auth";
import { verifyPassword } from "../../../../../lib/password";
import { prisma } from "../../../../../lib/prisma";

function isJwtSecretError(err: unknown): boolean {
  return err instanceof Error && /ADMIN_JWT_SECRET|JWT_SECRET/.test(err.message);
}

export async function POST(req: Request) {
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

  try {
    const user = await prisma.adminUser.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const token = await signSession({ sub: user.id, email: user.email });
    const res = NextResponse.json({ ok: true, email: user.email });
    return attachSessionCookie(res, token);
  } catch (err) {
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
    return NextResponse.json({ error: "Sign-in failed." }, { status: 500 });
  }
}
