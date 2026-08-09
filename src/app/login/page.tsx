"use client";

import Link from "next/link";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const form = new FormData(event.currentTarget); const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: form.get("email"), password: form.get("password") }) }); const result = await response.json(); if (!response.ok) { setMessage(result.error ?? "ไม่สามารถเข้าสู่ระบบได้"); return; } window.location.href = result.role === "ADMIN" ? "/admin/ads" : "/"; }
  return <main className="auth-shell"><Link href="/" className="auth-logo">Bet<span>Pay</span></Link><section className="auth-card"><div className="auth-icon"><LockKeyhole size={19} /></div><div className="simple-kicker">WELCOME BACK</div><h1>เข้าสู่ระบบ</h1><p>กลับไปดูคู่เด็ดที่คุณติดตาม</p><form onSubmit={submit}><label>อีเมล<input name="email" type="email" required placeholder="you@example.com" /></label><label>รหัสผ่าน<input name="password" type="password" required placeholder="••••••••" /></label><button className="auth-submit">เข้าสู่ระบบ <ArrowRight size={17} /></button></form>{message && <div className="success-note">{message}</div>}<div className="auth-foot">ยังไม่มีบัญชี? <Link href="/signup">สมัครสมาชิก</Link></div></section></main>;
}
