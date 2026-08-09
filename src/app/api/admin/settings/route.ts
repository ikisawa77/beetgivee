import { NextResponse } from "next/server";
import { requireAdmin, verifySessionToken } from "../../../../lib/auth";
import { logger } from "../../../../lib/logger";
import { prisma } from "../../../../lib/prisma";
import { normalizeSiteSettings } from "../../../../lib/site-settings";

export const dynamic = "force-dynamic";

function adminSession(request: Request) {
  const cookie = request.headers.get("cookie")?.match(/(?:^|;\\s*)betpay_session=([^;]+)/)?.[1];
  return requireAdmin(verifySessionToken(cookie));
}

export async function GET(request: Request) {
  try {
    adminSession(request);
    const settings = await prisma.siteSetting.findUnique({ where: { id: 1 } });
    return NextResponse.json(normalizeSiteSettings(settings));
  } catch {
    return NextResponse.json({ error: "ไม่มีสิทธิ์ผู้ดูแล" }, { status: 401 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = adminSession(request);
    const body = normalizeSiteSettings(await request.json());
    const settings = await prisma.siteSetting.upsert({ where: { id: 1 }, create: { id: 1, ...body }, update: body });
    await logger.info("site-settings.updated", { userId: session.userId });
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error && error.message === "ADMIN_REQUIRED" ? "ไม่มีสิทธิ์ผู้ดูแล" : "ไม่สามารถบันทึกข้อมูลเว็บไซต์ได้" }, { status: 401 });
  }
}
