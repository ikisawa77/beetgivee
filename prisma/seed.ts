import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/passwords.ts";

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
if (!email || !password) throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required");

const prisma = new PrismaClient();
await prisma.user.upsert({
  where: { email: email.toLowerCase() },
  update: { role: "ADMIN", passwordHash: hashPassword(password) },
  create: { email: email.toLowerCase(), displayName: "ผู้ดูแลระบบ", role: "ADMIN", passwordHash: hashPassword(password) },
});
await prisma.$disconnect();
