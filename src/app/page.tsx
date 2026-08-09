"use client";

import { LockKeyhole, ShieldCheck, Trophy } from "lucide-react";
import { visiblePicks } from "../lib/tips";

type Pick = { id: string; time: string; home: string; away: string; pick: string; odds: string; confidence: number; locked?: boolean };
type League = { name: string; country: string; picks: Pick[] };

const leagues: League[] = [
  { name: "สวีเดน ออลสเวนส์คาน", country: "SE", picks: [
    { id: "se-1", time: "19:00", home: "มัลโม่ FF", away: "ฮัมมาร์บี้", pick: "มัลโม่ ต่อ", odds: "1.25", confidence: 86 },
    { id: "se-2", time: "21:30", home: "เยอร์การ์เด้น", away: "โกเตบอร์ก", pick: "เยอร์การ์เด้น ต่อ", odds: "0.75", confidence: 78 },
    { id: "se-3", time: "21:30", home: "เอล์ฟส์บอร์ก", away: "ฮัคเค่น", pick: "เอล์ฟส์บอร์ก ต่อ", odds: "0.5", confidence: 74, locked: true },
  ] },
  { name: "เดนมาร์ก ซูเปอร์ลีก", country: "DK", picks: [
    { id: "dk-1", time: "21:00", home: "บรอนด์บี้", away: "แรนเดอร์ส", pick: "บรอนด์บี้ ต่อ", odds: "0.75", confidence: 81 },
    { id: "dk-2", time: "23:00", home: "มิดทิลแลนด์", away: "นอร์ดเจลแลนด์", pick: "มิดทิลแลนด์ ต่อ", odds: "0.5", confidence: 70, locked: true },
  ] },
];

function Logo() { return <div className="brand"><div className="brand-ball">⚽</div><div className="brand-word">Bet<span>Pay</span></div></div>; }

export default function HomePage() {
  const allPicks = leagues.flatMap((league) => league.picks);
  const isMember = false;
  const displayPicks = visiblePicks(allPicks, isMember);
  const visibleIds = new Set(displayPicks.map((pick) => pick.id));
  return <main className="site-shell">
    <header className="topbar"><div className="topbar-inner"><Logo /><nav className="nav-links"><a href="#tips">ทีเด็ดวันนี้</a><a href="#results">สรุปผลการแข่งขัน</a><a href="#plans">แพ็กเกจสมาชิก</a></nav><div className="nav-actions"><button className="ghost-btn">เข้าสู่ระบบ</button><button className="solid-btn">สมัครสมาชิก</button></div></div></header>
    <section className="hero"><div className="hero-inner"><div><div className="eyebrow">AI SCOUTING · EDITOR'S PICK</div><h1>คู่บอลที่น่าเล่น<br />คัดให้เห็นแบบมีเหตุผล</h1><p className="hero-copy">ข้อมูลอัตราต่อรองจากภาพ วิเคราะห์ด้วย AI และตรวจซ้ำโดยทีมงานก่อนเผยแพร่ เพื่อให้คุณตัดสินใจได้ในจังหวะที่สำคัญ</p></div><div className="hero-date"><div className="date">09 ส.ค. 2026</div><div className="label">วันอาทิตย์ · อัปเดตล่าสุด 10:30 น.</div></div></div></section>
    <div className="page" id="tips"><div className="toolbar"><h2>ทีเด็ดฟุตบอลวันนี้</h2><div className="toolbar-meta"><span className="live-dot" />กำลังเปิดรับข้อมูล <span>·</span> {allPicks.length} คู่</div></div>
      <div className="dashboard-grid"><section className="fixture-panel"><div className="panel-head"><strong>โปรแกรมพร้อมทีเด็ด</strong><small>{isMember ? "Silver · เห็นข้อมูลทั้งหมด" : "Visitor เห็น 2 คู่ · Silver เห็นทั้งหมด"}</small></div>{leagues.map((league) => { const picks = isMember ? league.picks : league.picks.filter((pick) => visibleIds.has(pick.id)); if (!picks.length) return null; return <div className="league-block" key={league.name}><div className="league-title"><div className="league-name"><span className="league-mark">{league.country}</span>{league.name}</div><span className="league-count">{picks.length} คู่</span></div><div className="table-wrap"><table className="fixture-table"><thead><tr><th>เวลา</th><th>เจ้าบ้าน</th><th>ทีเด็ด</th><th>ทีมเยือน</th><th>ความมั่นใจ</th><th>ราคา</th></tr></thead><tbody>{picks.map((pick) => <tr key={pick.id} className={pick.locked ? "locked-row" : ""} data-testid="published-pick"><td className="fixture-time">{pick.time}</td><td><span className="team-name home">{pick.home}</span></td><td><span className="pick-pill"><Trophy size={12} />{pick.pick}</span></td><td><span className="team-name">{pick.away}</span></td><td className="confidence">{pick.confidence}%</td><td className="odds">{pick.odds}</td></tr>)}</tbody></table></div></div>; })}<div className="lock-banner"><LockKeyhole size={15} /><span>อีก {allPicks.length - displayPicks.length} คู่พร้อมบทวิเคราะห์และราคาต่อรองสำหรับสมาชิก</span><button>สมัครสมาชิกเพื่อดูทีเด็ดทั้งหมด</button></div></section>
        <aside className="side-panel"><div className="panel-head"><strong>อันดับความมั่นใจ</strong><small>AI + ทีมงาน</small></div><div className="rank-list">{displayPicks.filter((pick) => !pick.locked).sort((a, b) => b.confidence - a.confidence).slice(0, 4).map((pick, index) => <div className="rank-row" key={pick.id}><span className="rank-no">0{index + 1}</span><div><div className="rank-team">{pick.pick}</div><div className="rank-league">{pick.home} vs {pick.away}</div></div><span className="rank-score">{pick.confidence}%</span></div>)}</div><div className="upgrade"><strong>ปลดล็อกทีเด็ดทั้งหมด</strong><p>สมาชิก Silver เห็นทุกคู่ พร้อมบทวิเคราะห์และประวัติผลการแข่งขัน</p><button>ดูแพ็กเกจสมาชิก →</button></div></aside>
      </div><div className="stats-row"><div className="stat"><div className="stat-label">ทีเด็ดเข้าเมื่อวาน</div><div className="stat-value green">7 / 9</div></div><div className="stat"><div className="stat-label">อัตราเข้าเฉลี่ย 7 วัน</div><div className="stat-value">76.4%</div></div><div className="stat"><div className="stat-label">ตรวจสอบโดยทีมงาน</div><div className="stat-value"><ShieldCheck size={22} color="var(--green)" /></div></div></div>
    </div><footer className="footer"><span>© 2026 BetPay · ข้อมูลเพื่อประกอบการตัดสินใจเท่านั้น</span><span>ช่วยเหลือ · เงื่อนไขการใช้งาน</span></footer>
  </main>;
}
