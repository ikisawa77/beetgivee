export type MembershipTier = "SILVER" | "GOLD";

export function addSubscriptionMonths(currentExpiry: Date | null, months: number, now: Date) {
  if (!Number.isInteger(months) || months < 1) {
    throw new Error("INVALID_MONTHS");
  }
  const base = currentExpiry && currentExpiry > now ? currentExpiry : now;
  return new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth() + months, base.getUTCDate()));
}

export function canViewFullTips(
  subscription: { tier: MembershipTier; expiresAt: Date } | null,
  now: Date,
) {
  return Boolean(subscription && subscription.expiresAt > now);
}
