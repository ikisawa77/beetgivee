import { NextResponse } from "next/server";
import { createSessionToken } from "../../../../lib/auth";
import { verifyPassword } from "../../../../lib/passwords";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request) {
  const body = await request.json() as { email?: string; password?: string };
  if (!body.email || !body.password) return NextResponse.json({ error: "กรอกอีเมลและรหัสผ่าน" }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { email: body.email.toLowerCase() } });
  if (!user || !verifyPassword(body.password, user.passwordHash)) return NextResponse.json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 });
  const response = NextResponse.json({ role: user.role });
  response.cookies.set("betpay_session", createSessionToken({ userId: user.id, role: user.role }), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 });
  return response;
}
