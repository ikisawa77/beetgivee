"use client";

import Link from "next/link";
import { Check, ChevronLeft, CreditCard, UploadCloud } from "lucide-react";
import { useState } from "react";

const plans = [
  { months: 1, price: 199, note: "เริ่มทดลอง" },
  { months: 3, price: 499, note: "คุ้มที่สุด" },
  { months: 6, price: 899, note: "สายจริงจัง" },
  { months: 12, price: 1499, note: "แฟนพันธุ์แท้" },
];

export default function PlansPage() {
  const [selected, setSelected] = useState(1);
  const [sent, setSent] = useState(false);
  const plan = plans[selected];
  return <main className="simple-shell"><header className="simple-header"><Link href="/" className="back-link"><ChevronLeft size={17} />กลับหน้าทีเด็ด</Link><span className="simple-brand">Bet<span>Pay</span></span><Link href="/login" className="muted-link">เข้าสู่ระบบ</Link></header><div className="simple-page"><div className="simple-kicker">MEMBERSHIP</div><h1>เลือกแพ็กเกจที่ใช่สำหรับคุณ</h1><p className="simple-lead">ปลดล็อกทีเด็ดทั้งหมด พร้อมอันดับความมั่นใจ บทวิเคราะห์ และสรุปผลการแข่งขันรายวัน</p><div className="plan-grid">{plans.map((item, index) => <button key={item.months} className={`plan-card ${selected === index ? "selected" : ""}`} onClick={() => setSelected(index)}><span className="plan-note">{item.note}</span><span className="plan-duration">{item.months} เดือน</span><span className="plan-price">฿{item.price.toLocaleString()}<small>/แพ็กเกจ</small></span><span className="plan-check"><Check size={14} />เห็นทีเด็ดทุกคู่</span></button>)}</div><section className="payment-box"><div className="payment-heading"><div><div className="simple-kicker">STEP 02 · ชำระเงิน</div><h2>ส่งสลิปเพื่อเปิดใช้งาน Silver</h2></div><div className="payment-total">฿{plan.price.toLocaleString()}<small>{plan.months} เดือน</small></div></div><div className="payment-fields"><label>อัปโหลดสลิปธนาคาร<input type="file" accept="image/*" onChange={() => setSent(false)} /><span className="upload-hint"><UploadCloud size={18} />เลือกไฟล์สลิปเพื่อให้ระบบอ่าน QR</span></label><label>หมายเหตุ (ถ้ามี)<input placeholder="เช่น โอนจากบัญชีชื่อ..." /></label></div><button className="payment-submit" onClick={() => setSent(true)}><CreditCard size={17} />{sent ? "ส่งสลิปแล้ว · รอตรวจสอบ" : "ส่งสลิปตรวจสอบการชำระเงิน"}</button>{sent && <p className="success-note">รับข้อมูลแล้วครับ ระบบจะตรวจสอบกับ TMWEasyAPI และแจ้งผลในบัญชีของคุณ</p>}</section></div></main>;
}
