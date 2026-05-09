import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

/** Registration when zero admins (bootstrap), or when ADMIN_OPEN_REGISTRATION=true. */
export async function GET() {
  try {
    const count = await prisma.adminUser.count();
    const open = count === 0 || process.env.ADMIN_OPEN_REGISTRATION === "true";
    return NextResponse.json({ open, bootstrap: count === 0 });
  } catch {
    return NextResponse.json({ open: false, bootstrap: false });
  }
}
