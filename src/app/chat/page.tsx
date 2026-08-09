import Link from "next/link";
import { cookies } from "next/headers";
import { LockKeyhole, MessageCircle, Send, Sparkles } from "lucide-react";
import { verifySessionToken } from "../../lib/auth";
import { getMembershipTier, tierRank } from "../../lib/membership";

export const dynamic = "force-dynamic";

export default async function ChatPage() {
  const session = verifySessionToken(cookies().get("betpay_session")?.value);
  if (!session) return <main className="simple-shell"><div className="simple-page"><div className="simple-kicker">MEMBER CHAT</div><h1>เข้าสู่ระบบเพื่อใช้ Chat</h1><Link className="payment-submit" href="/login">เข้าสู่ระบบสมาชิก</Link></div></main>;
  const tier = session.role === "ADMIN" ? "GOLD" : await getMembershipTier(session.userId);
  const allowed = tierRank(tier) >= 2;
  return <main className="simple-shell"><header className="simple-header"><Link href="/" className="back-link">กลับหน้าทีเด็ด</Link><span className="simple-brand">Bet<span>Pay</span></span><span className="muted-link">CHAT ROOM</span></header><div className="community-page"><div className="simple-kicker">LIVE MEMBER CHAT</div><h1>ห้องแชทสมาชิก</h1><p className="simple-lead">พูดคุยก่อนเกม แชร์มุมมอง และติดตามอัปเดตจากทีมงาน BetPay</p>{allowed ? <section className="chat-panel"><div className="chat-head"><MessageCircle size={20} /><strong>BetPay Match Room</strong><span>ออนไลน์</span></div><div className="chat-messages"><div className="chat-message"><b>ทีมงาน BetPay</b><p>คืนนี้คู่เด่นมีสัญญาณชัดเจน อย่าลืมเช็กทีเด็ดก่อนเวลาแข่ง</p><small>10:30 น.</small></div><div className="chat-message self"><b>คุณ</b><p>รับทราบครับ</p><small>10:32 น.</small></div></div><div className="chat-compose"><input placeholder="พิมพ์ข้อความในห้องสมาชิก..." /><button type="button" aria-label="ส่งข้อความ"><Send size={17} /></button></div></section> : <section className="community-lock"><LockKeyhole size={24} /><h2>Chat เปิดสำหรับ Silver และ Gold</h2><p>อัปเกรดเป็น Silver เพื่อเข้าห้อง Chat และรับบทวิเคราะห์จากสมาชิก</p><Link className="payment-submit" href="/plans"><Sparkles size={16} />อัปเกรดสมาชิก</Link></section>}</div></main>;
}
