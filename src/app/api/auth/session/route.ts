import { NextResponse } from "next/server";
import { verifySessionToken } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { getMembershipTier } from "../../../../lib/membership";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const cookie = request.headers.get("cookie")?.match(/(?:^|;\\s*)betpay_session=([^;]+)/)?.[1];
  const session = verifySessionToken(cookie);
  if (!session) return NextResponse.json({ member: null });
  try {
    const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { displayName: true, email: true, role: true } });
    return NextResponse.json({ member: user ? { displayName: user.displayName, email: user.email, role: user.role, tier: session.role === "ADMIN" ? "GOLD" : await getMembershipTier(session.userId) } : null });
  } catch {
    return NextResponse.json({ member: null });
  }
}
