"use client";

import Link from "next/link";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [message, setMessage] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setMessage("ตัวอย่างหน้าล็อกอินพร้อมเชื่อมต่อระบบบัญชี"); }
  return <main className="auth-shell"><Link href="/" className="auth-logo">Bet<span>Pay</span></Link><section className="auth-card"><div className="auth-icon"><LockKeyhole size={19} /></div><div className="simple-kicker">WELCOME BACK</div><h1>เข้าสู่ระบบ</h1><p>กลับไปดูคู่เด็ดที่คุณติดตาม</p><form onSubmit={submit}><label>อีเมล<input type="email" required placeholder="you@example.com" /></label><label>รหัสผ่าน<input type="password" required placeholder="••••••••" /></label><button className="auth-submit">เข้าสู่ระบบ <ArrowRight size={17} /></button></form>{message && <div className="success-note">{message}</div>}<div className="auth-foot">ยังไม่มีบัญชี? <Link href="/signup">สมัครสมาชิก</Link></div></section></main>;
}
