"use client";

import Link from "next/link";
import { ArrowRight, UserRoundPlus } from "lucide-react";
import { FormEvent, useState } from "react";

export default function SignupPage() {
  const [created, setCreated] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const form = new FormData(event.currentTarget); const response = await fetch("/api/auth/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ displayName: form.get("displayName"), email: form.get("email"), password: form.get("password") }) }); if (response.ok) setCreated(true); }
  return <main className="auth-shell"><Link href="/" className="auth-logo">Bet<span>Pay</span></Link><section className="auth-card"><div className="auth-icon"><UserRoundPlus size={19} /></div><div className="simple-kicker">JOIN BETPAY</div><h1>สมัครสมาชิก</h1><p>เริ่มต้นด้วยบัญชีฟรี แล้วเลือกแพ็กเกจ Silver</p>{created ? <><div className="success-note">สร้างบัญชีแล้ว กรุณาเข้าสู่ระบบเพื่อเลือกแพ็กเกจ</div><Link className="auth-submit as-link" href="/login">เข้าสู่ระบบ <ArrowRight size={17} /></Link></> : <form onSubmit={submit}><label>ชื่อที่แสดง<input name="displayName" required placeholder="ชื่อเล่นของคุณ" /></label><label>อีเมล<input name="email" type="email" required placeholder="you@example.com" /></label><label>รหัสผ่าน<input name="password" type="password" required minLength={8} placeholder="อย่างน้อย 8 ตัวอักษร" /></label><button className="auth-submit">สร้างบัญชี <ArrowRight size={17} /></button></form>}<div className="auth-foot">มีบัญชีแล้ว? <Link href="/login">เข้าสู่ระบบ</Link></div></section></main>;
}
