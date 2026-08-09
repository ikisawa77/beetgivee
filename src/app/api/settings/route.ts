import { NextResponse } from "next/server";
import { defaultSiteSettings, normalizeSiteSettings } from "../../../lib/site-settings";
import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findUnique({ where: { id: 1 } });
    return NextResponse.json(normalizeSiteSettings(settings));
  } catch {
    return NextResponse.json(defaultSiteSettings);
  }
}
