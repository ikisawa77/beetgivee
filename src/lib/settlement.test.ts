import assert from "node:assert/strict";
import test from "node:test";
import { calculateDailySummary } from "./settlement.ts";

test("calculates win count and one-unit return", () => {
  const result = calculateDailySummary([
    { outcome: "WON", odds: 1.8 },
    { outcome: "LOST", odds: 1.9 },
    { outcome: "VOID", odds: 2 },
  ]);
  assert.deepEqual(result, { settled: 2, won: 1, lost: 1, void: 1, winRate: 50, returnUnits: -0.2 });
});
