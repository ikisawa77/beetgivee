import Link from "next/link";
import { cookies } from "next/headers";
import { Bell, LockKeyhole, Sparkles } from "lucide-react";
import { verifySessionToken } from "../../lib/auth";
import { getMembershipTier } from "../../lib/membership";

export const dynamic = "force-dynamic";

export default async function AlertsPage() {
  const session = verifySessionToken(cookies().get("betpay_session")?.value);
  const tier = session?.role === "ADMIN" ? "GOLD" : session ? await getMembershipTier(session.userId) : "MEMBER";
  const allowed = tier === "GOLD";
  return <main className="simple-shell"><header className="simple-header"><Link href="/" className="back-link">กลับหน้าทีเด็ด</Link><span className="simple-brand">Bet<span>Pay</span></span><span className="muted-link">ALERT CENTER</span></header><div className="community-page"><div className="simple-kicker">TIP ALERTS</div><h1>แจ้งเตือนทีเด็ด</h1><p className="simple-lead">รับการแจ้งเตือนเมื่อมีทีเด็ดใหม่ อัปเดตผล และข่าวสารสำคัญจาก BetPay</p>{allowed ? <section className="alert-panel"><div><Bell size={22} /><strong>เปิดแจ้งเตือนแล้ว</strong><span>ระบบจะแจ้งเตือนเมื่อมีทีเด็ดคู่เด่นหรือผลสรุปใหม่</span></div><button className="payment-submit" type="button">ปิดการแจ้งเตือน</button></section> : <section className="community-lock"><LockKeyhole size={24} /><h2>แจ้งเตือนเปิดสำหรับ Gold</h2><p>อัปเกรดเป็น Gold เพื่อรับแจ้งเตือนทีเด็ดทันทีและเข้าร่วม Webboard</p><Link className="payment-submit" href="/plans"><Sparkles size={16} />อัปเกรดเป็น Gold</Link></section>}</div></main>;
}
