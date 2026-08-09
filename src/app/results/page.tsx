import Link from "next/link";
import { ArrowLeft, Check, CircleAlert, Minus, X } from "lucide-react";
import { summarizeDailyPredictions } from "../../lib/daily-predictions";

const records = [
  { date: "2026-08-09", league: "สวีเดน ออลสเวนส์คาน", time: "19:00", home: "มัลโม่ FF", away: "ฮัมมาร์บี้", predictedTeam: "มัลโม่ FF", actualWinner: "มัลโม่ FF", score: "2 - 0" },
  { date: "2026-08-09", league: "สวีเดน ออลสเวนส์คาน", time: "21:30", home: "เยอร์การ์เด้น", away: "โกเตบอร์ก", predictedTeam: "เยอร์การ์เด้น", actualWinner: "โกเตบอร์ก", score: "0 - 1" },
  { date: "2026-08-09", league: "เดนมาร์ก ซูเปอร์ลีก", time: "21:00", home: "บรอนด์บี้", away: "แรนเดอร์ส", predictedTeam: "บรอนด์บี้", actualWinner: "DRAW", score: "1 - 1" },
  { date: "2026-08-09", league: "เดนมาร์ก ซูเปอร์ลีก", time: "23:00", home: "มิดทิลแลนด์", away: "นอร์ดเจลแลนด์", predictedTeam: "มิดทิลแลนด์", actualWinner: "PENDING", score: "-" },
].map((record) => ({ ...record }));

const summary = summarizeDailyPredictions(records);

function Outcome({ actualWinner, predictedTeam }: { actualWinner: string; predictedTeam: string }) {
  if (actualWinner === "PENDING") return <span className="result-status pending"><CircleAlert size={13} />รอผล</span>;
  if (actualWinner === "DRAW") return <span className="result-status draw"><Minus size={13} />เสมอ</span>;
  return actualWinner === predictedTeam ? <span className="result-status won"><Check size={13} />ทายถูก</span> : <span className="result-status lost"><X size={13} />ทายผิด</span>;
}

export default function ResultsPage() {
  return <main className="results-shell"><header className="results-header"><Link href="/" className="back-link"><ArrowLeft size={16} />กลับหน้าทีเด็ด</Link><div className="simple-brand">Bet<span>Pay</span></div><div className="results-header-note">ผลประจำวันที่ 09 ส.ค. 2026</div></header><div className="results-page"><div className="simple-kicker">DAILY PERFORMANCE</div><h1>สรุปผลการทำนาย</h1><p className="simple-lead">ตรวจสอบผลจากทีเด็ดที่เผยแพร่ในแต่ละวัน แยกชัดเจนว่าทายทีมชนะถูกหรือพลาด</p><section className="result-overview"><div><span className="overview-label">ความแม่นยำวันนี้</span><strong>{summary.accuracy}%</strong><span className="overview-sub">จาก {summary.settled} คู่ที่จบแล้ว</span></div><div className="overview-stat"><span>ทายถูก</span><b className="green-text">{summary.correct}</b></div><div className="overview-stat"><span>ทายผิด</span><b className="red-text">{summary.incorrect}</b></div><div className="overview-stat"><span>รอผล</span><b>{summary.pending}</b></div></section><section className="results-table-panel"><div className="panel-head"><strong>ผลการแข่งขันและการทำนาย</strong><small>คู่ที่เผยแพร่ทั้งหมดของวัน</small></div><div className="table-wrap"><table className="results-table"><thead><tr><th>เวลา</th><th>ลีก</th><th>คู่แข่งขัน</th><th>ทีมที่ทาย</th><th>ผลจริง</th><th>สถานะ</th></tr></thead><tbody>{records.map((record) => <tr key={`${record.league}-${record.time}`}><td className="fixture-time">{record.time}</td><td className="result-league">{record.league}</td><td><b>{record.home}</b><span className="versus"> vs </span><b>{record.away}</b><small className="score">{record.score}</small></td><td className="predicted">{record.predictedTeam}</td><td>{record.actualWinner === "PENDING" ? "-" : record.actualWinner === "DRAW" ? "เสมอ" : record.actualWinner}</td><td><Outcome actualWinner={record.actualWinner} predictedTeam={record.predictedTeam} /></td></tr>)}</tbody></table></div></section></div></main>;
}
