import assert from "node:assert/strict";
import test from "node:test";
import { summarizeDailyPredictions } from "./daily-predictions.ts";

test("reports daily prediction accuracy from settled matches", () => {
  assert.deepEqual(summarizeDailyPredictions([
    { date: "2026-08-09", predictedTeam: "A", actualWinner: "A" },
    { date: "2026-08-09", predictedTeam: "B", actualWinner: "A" },
    { date: "2026-08-09", predictedTeam: "C", actualWinner: "DRAW" },
    { date: "2026-08-09", predictedTeam: "D", actualWinner: "PENDING" },
  ]), { date: "2026-08-09", total: 4, settled: 2, correct: 1, incorrect: 1, draw: 1, pending: 1, accuracy: 50 });
});
