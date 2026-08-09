import { NextResponse } from "next/server";
import { hashPassword } from "../../../../lib/passwords";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request) {
  const body = await request.json() as { displayName?: string; email?: string; password?: string; termsAccepted?: boolean };
  if (!body.displayName || !body.email || !body.password || body.password.length < 8) return NextResponse.json({ error: "ข้อมูลไม่ครบหรือรหัสผ่านสั้นเกินไป" }, { status: 400 });
  if (!body.termsAccepted) return NextResponse.json({ error: "กรุณายอมรับข้อตกลงการใช้งานก่อนสมัครสมาชิก" }, { status: 400 });
  try {
    const user = await prisma.user.create({ data: { displayName: body.displayName, email: body.email.toLowerCase(), passwordHash: hashPassword(body.password) } });
    return NextResponse.json({ id: user.id }, { status: 201 });
  } catch { return NextResponse.json({ error: "อีเมลนี้ถูกใช้แล้ว" }, { status: 409 }); }
}
