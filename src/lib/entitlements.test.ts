import assert from "node:assert/strict";
import test from "node:test";
import { addSubscriptionMonths, canViewFullTips } from "./entitlements.ts";

test("extends an active Silver subscription", () => {
  const now = new Date("2026-08-09T00:00:00.000Z");
  const expiry = new Date("2026-09-01T00:00:00.000Z");
  assert.deepEqual(addSubscriptionMonths(expiry, 3, now), new Date("2026-12-01T00:00:00.000Z"));
  assert.equal(canViewFullTips({ tier: "SILVER", expiresAt: expiry }, now), true);
});
