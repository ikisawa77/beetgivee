import { createHmac, timingSafeEqual } from "node:crypto";

export type Session = { userId: string; role: "ADMIN" | "MEMBER" };
const encoder = new TextEncoder();

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function createSessionToken(session: Session, secret = process.env.AUTH_SECRET) {
  if (!secret) throw new Error("AUTH_SECRET_NOT_CONFIGURED");
  const payload = Buffer.from(JSON.stringify({ ...session, expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7 })).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

export function verifySessionToken(token: string | undefined, secret = process.env.AUTH_SECRET): Session | null {
  if (!token || !secret) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload, secret);
  if (signature.length !== expected.length || !timingSafeEqual(encoder.encode(signature), encoder.encode(expected))) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Session & { expiresAt: number };
    if (parsed.expiresAt < Date.now() || (parsed.role !== "ADMIN" && parsed.role !== "MEMBER")) return null;
    return { userId: parsed.userId, role: parsed.role };
  } catch { return null; }
}

export function requireAdmin(session: Session | null) {
  if (!session || session.role !== "ADMIN") throw new Error("ADMIN_REQUIRED");
  return session;
}
