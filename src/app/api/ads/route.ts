import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!process.env.DATABASE_URL) return NextResponse.json([]);
  try {
    const ads = await prisma.advertisement.findMany({ where: { active: true, OR: [{ startsAt: null }, { startsAt: { lte: new Date() } }], AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: new Date() } }] }] }, orderBy: [{ placement: "asc" }, { sortOrder: "asc" }] });
    return NextResponse.json(ads);
  } catch {
    return NextResponse.json([]);
  }
}
