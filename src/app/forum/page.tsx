import Link from "next/link";
import { cookies } from "next/headers";
import { LockKeyhole, MessageSquare, PenLine, ShieldCheck, Sparkles } from "lucide-react";
import { verifySessionToken } from "../../lib/auth";
import { getMembershipTier } from "../../lib/membership";

export const dynamic = "force-dynamic";

export default async function ForumPage() {
  const session = verifySessionToken(cookies().get("betpay_session")?.value);
  if (!session) return <main className="simple-shell"><div className="simple-page"><div className="simple-kicker">BETPAY WEBBOARD</div><h1>เว็บบอร์ดสำหรับสมาชิก</h1><Link className="payment-submit" href="/login">เข้าสู่ระบบสมาชิก</Link></div></main>;
  const tier = session.role === "ADMIN" ? "GOLD" : await getMembershipTier(session.userId);
  const canWrite = session.role === "ADMIN" || tier === "GOLD";
  return <main className="simple-shell"><header className="simple-header"><Link href="/" className="back-link">กลับหน้าทีเด็ด</Link><span className="simple-brand">Bet<span>Pay</span></span><span className="muted-link">WEBBOARD</span></header><div className="community-page"><div className="simple-kicker">COMMUNITY BOARD</div><h1>เว็บบอร์ด BetPay</h1><p className="simple-lead">พื้นที่พูดคุยวิเคราะห์บอลสำหรับสมาชิก Gold และผู้ดูแลระบบ</p><section className="forum-panel"><div className="forum-toolbar"><div><ShieldCheck size={18} /><strong>กระทู้ล่าสุด</strong></div>{canWrite ? <button className="payment-submit" type="button"><PenLine size={15} />ตั้งกระทู้ใหม่</button> : <span className="forum-readonly"><LockKeyhole size={14} />Member/Silver อ่านได้อย่างเดียว</span>}</div><div className="thread-row"><MessageSquare size={18} /><div><strong>คุยก่อนเกม: คู่เด่นประจำวัน</strong><small>ทีมงาน BetPay · 12 ความคิดเห็น</small></div><span>วันนี้</span></div><div className="thread-row"><MessageSquare size={18} /><div><strong>สรุปผลและบทเรียนจากเมื่อวาน</strong><small>สมาชิก Gold · 8 ความคิดเห็น</small></div><span>เมื่อวาน</span></div>{!canWrite && <div className="forum-cover"><LockKeyhole size={20} /><p>อัปเกรดเป็น Gold เพื่ออ่านเนื้อหาภายในและร่วมตอบกระทู้</p><Link href="/plans"><Sparkles size={15} />ดูแพ็กเกจ Gold</Link></div>}</section></div></main>;
}
