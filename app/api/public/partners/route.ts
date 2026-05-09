import { NextResponse } from "next/server";
import { getPartners } from "../../../../lib/serverContent";

export async function GET() {
  const partners = await getPartners();
  return NextResponse.json(partners);
}

