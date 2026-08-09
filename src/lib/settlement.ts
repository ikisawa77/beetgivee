export type PickOutcome = "PENDING" | "WON" | "LOST" | "VOID";

export function calculateDailySummary(picks: Array<{ outcome: PickOutcome; odds: number }>) {
  let won = 0;
  let lost = 0;
  let voided = 0;
  let returnUnits = 0;

  for (const pick of picks) {
    if (pick.outcome === "WON") {
      won += 1;
      returnUnits += pick.odds - 1;
    } else if (pick.outcome === "LOST") {
      lost += 1;
      returnUnits -= 1;
    } else if (pick.outcome === "VOID") {
      voided += 1;
    }
  }

  const settled = won + lost;
  return {
    settled,
    won,
    lost,
    void: voided,
    winRate: settled ? Number(((won / settled) * 100).toFixed(2)) : 0,
    returnUnits: Number(returnUnits.toFixed(2)),
  };
}
