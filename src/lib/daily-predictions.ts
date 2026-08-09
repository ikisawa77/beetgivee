export type PredictionRecord = { date: string; predictedTeam: string; actualWinner: string };

export function summarizeDailyPredictions(records: PredictionRecord[], date = records[0]?.date ?? "") {
  const day = records.filter((record) => record.date === date);
  let correct = 0;
  let incorrect = 0;
  let draw = 0;
  let pending = 0;
  for (const record of day) {
    if (record.actualWinner === "PENDING") pending += 1;
    else if (record.actualWinner === "DRAW") draw += 1;
    else if (record.predictedTeam === record.actualWinner) correct += 1;
    else incorrect += 1;
  }
  const settled = correct + incorrect;
  return { date, total: day.length, settled, correct, incorrect, draw, pending, accuracy: settled ? Number(((correct / settled) * 100).toFixed(2)) : 0 };
}
