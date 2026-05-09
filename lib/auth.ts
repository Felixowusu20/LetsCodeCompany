import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "./prisma";

export { hashPassword, verifyPassword } from "./password";

const COOKIE = "admin_session";
const DAY = 60 * 60 * 24;

function jwtSecretRaw() {
  return process.env.ADMIN_JWT_SECRET ?? process.env.JWT_SECRET ?? "";
}

function secretKey() {
  const s = jwtSecretRaw();
  if (!s || s.length < 16) {
    throw new Error("ADMIN_JWT_SECRET (or JWT_SECRET) must be set (min 16 characters)");
  }
  return new TextEncoder().encode(s);
}

export type SessionPayload = { sub: string; email: string };

export async function signSession(payload: SessionPayload) {
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${7 * DAY}s`)
    .sign(secretKey());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    const sub = typeof payload.sub === "string" ? payload.sub : null;
    const email = typeof payload.email === "string" ? payload.email : null;
    if (!sub || !email) return null;
    return { sub, email };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function setSessionCookie(token: string) {
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * DAY,
  });
}

/** Prefer this in Route Handlers so Set-Cookie is reliably applied to the outgoing response. */
export function attachSessionCookie(res: NextResponse, token: string): NextResponse {
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * DAY,
  });
  return res;
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export function attachClearSessionCookie(res: NextResponse): NextResponse {
  res.cookies.set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}

const unauthorized = () => NextResponse.json({ error: "Unauthorized" }, { status: 401 });

export async function getAdminSessionOr401(): Promise<
  { ok: true; session: SessionPayload } | { ok: false; response: NextResponse }
> {
  let session: SessionPayload | null;
  try {
    session = await getSession();
  } catch {
    return { ok: false, response: unauthorized() };
  }
  if (!session) return { ok: false, response: unauthorized() };

  const user = await prisma.adminUser.findUnique({ where: { id: session.sub } });
  if (!user || user.email.toLowerCase() !== session.email.toLowerCase()) {
    return { ok: false, response: unauthorized() };
  }
  return { ok: true, session };
}

export { COOKIE };
