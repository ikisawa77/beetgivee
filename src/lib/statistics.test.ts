import assert from "node:assert/strict";
import test from "node:test";
import { summarizePicks } from "./statistics.ts";

test("summarizes settled picks and return units", () => {
  assert.deepEqual(summarizePicks([
    { outcome: "WON", odds: 1.8 },
    { outcome: "LOST", odds: 1.9 },
    { outcome: "VOID", odds: 2 },
    { outcome: "PENDING", odds: 1.7 },
  ]), { total: 4, settled: 2, won: 1, lost: 1, void: 1, pending: 1, winRate: 50, returnUnits: -0.2 });
});
