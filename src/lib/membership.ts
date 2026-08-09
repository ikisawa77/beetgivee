import type { MembershipTier } from "@prisma/client";
import { prisma } from "./prisma";

export type AccessTier = "MEMBER" | "SILVER" | "GOLD";

export function tierRank(tier: AccessTier) { return tier === "GOLD" ? 3 : tier === "SILVER" ? 2 : 1; }

export function canUse(tier: AccessTier, feature: "results" | "full-results" | "chat" | "forum" | "alerts") {
  if (feature === "results") return tierRank(tier) >= 1;
  if (feature === "full-results" || feature === "chat") return tierRank(tier) >= 2;
  return tierRank(tier) >= 3;
}

export async function getMembershipTier(userId: string): Promise<AccessTier> {
  try {
    const active = await prisma.subscription.findFirst({ where: { userId, expiresAt: { gte: new Date() } }, orderBy: { expiresAt: "desc" }, select: { tier: true } });
    return active?.tier === ("GOLD" as MembershipTier) ? "GOLD" : active?.tier === ("SILVER" as MembershipTier) ? "SILVER" : "MEMBER";
  } catch { return "MEMBER"; }
}
