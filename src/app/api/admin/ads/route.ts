import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { requireAdmin, verifySessionToken } from "../../../../lib/auth";
import { logger } from "../../../../lib/logger";
import { prisma } from "../../../../lib/prisma";

export const dynamic = "force-dynamic";

const placements = new Set(["HOME_SLIDER", "HOME_MID", "HOME_SIDEBAR", "HOME_BOTTOM"]);

function adminSession(request: Request) {
  const cookie = request.headers.get("cookie")?.match(/(?:^|;\s*)betpay_session=([^;]+)/)?.[1];
  return requireAdmin(verifySessionToken(cookie));
}

export async function GET(request: Request) {
  adminSession(request);
  return NextResponse.json(await prisma.advertisement.findMany({ orderBy: [{ placement: "asc" }, { sortOrder: "asc" }] }));
}

export async function POST(request: Request) {
  try {
    const session = adminSession(request);
    const form = await request.formData();
    const title = String(form.get("title") ?? "").trim();
    const targetUrl = String(form.get("targetUrl") ?? "").trim();
    const placement = String(form.get("placement") ?? "");
    const image = form.get("image");
    if (!title || !targetUrl || !placements.has(placement) || !(image instanceof File)) return NextResponse.json({ error: "ข้อมูลโฆษณาไม่ครบ" }, { status: 400 });
    if (!image.type.match(/^image\/(jpeg|png|webp)$/) || image.size > 5 * 1024 * 1024) return NextResponse.json({ error: "รองรับ JPG, PNG, WEBP ขนาดไม่เกิน 5MB" }, { status: 400 });
    const extension = image.type === "image/png" ? "png" : image.type === "image/webp" ? "webp" : "jpg";
    const fileName = `${randomUUID()}.${extension}`;
    const outputDirectory = join(process.cwd(), "public", "uploads", "ads");
    await mkdir(outputDirectory, { recursive: true });
    await writeFile(join(outputDirectory, fileName), Buffer.from(await image.arrayBuffer()));
    const ad = await prisma.advertisement.create({ data: { title, targetUrl, placement: placement as "HOME_SLIDER" | "HOME_MID" | "HOME_SIDEBAR" | "HOME_BOTTOM", imageUrl: `/uploads/ads/${fileName}` } });
    await logger.info("advertisement.created", { userId: session.userId, advertisementId: ad.id, placement });
    return NextResponse.json(ad, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error && error.message === "ADMIN_REQUIRED" ? "ไม่มีสิทธิ์ผู้ดูแล" : "ไม่สามารถบันทึกโฆษณาได้" }, { status: 401 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = adminSession(request);
    const body = await request.json() as { id?: string; active?: boolean; sortOrder?: number };
    if (!body.id) return NextResponse.json({ error: "ไม่พบรายการโฆษณา" }, { status: 400 });
    const ad = await prisma.advertisement.update({ where: { id: body.id }, data: { active: body.active, sortOrder: body.sortOrder } });
    await logger.info("advertisement.updated", { userId: session.userId, advertisementId: ad.id, active: ad.active });
    return NextResponse.json(ad);
  } catch { return NextResponse.json({ error: "ไม่มีสิทธิ์ผู้ดูแล" }, { status: 401 }); }
}
