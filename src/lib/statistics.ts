export type StatPick = { outcome: "PENDING" | "WON" | "LOST" | "VOID"; odds: number };

export function summarizePicks(picks: StatPick[]) {
  let won = 0;
  let lost = 0;
  let voided = 0;
  let pending = 0;
  let returnUnits = 0;
  for (const pick of picks) {
    if (pick.outcome === "WON") { won += 1; returnUnits += pick.odds - 1; }
    else if (pick.outcome === "LOST") { lost += 1; returnUnits -= 1; }
    else if (pick.outcome === "VOID") voided += 1;
    else pending += 1;
  }
  const settled = won + lost;
  return {
    total: picks.length,
    settled,
    won,
    lost,
    void: voided,
    pending,
    winRate: settled ? Number(((won / settled) * 100).toFixed(2)) : 0,
    returnUnits: Number(returnUnits.toFixed(2)),
  };
}
