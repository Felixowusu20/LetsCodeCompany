import { NextResponse } from "next/server";
import { getAdminSessionOr401 } from "../../../../lib/auth";

export async function GET() {
  const auth = await getAdminSessionOr401();
  if (!auth.ok) return auth.response;
  return NextResponse.json({ email: auth.session.email });
}
