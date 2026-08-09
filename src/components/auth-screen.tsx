"use client";

import Link from "next/link";
import { ArrowRight, Check, CircleHelp, Eye, EyeOff, FileText, LockKeyhole, ShieldCheck, Sparkles, UserRoundPlus, X } from "lucide-react";
import { FormEvent, useState } from "react";

type AuthMode = "login" | "signup";

export function AuthScreen({ initialMode = "login" }: { initialMode?: AuthMode }) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [message, setMessage] = useState("");
  const [created, setCreated] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isSignup = mode === "signup";

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setMessage("");
    setCreated(false);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const form = new FormData(event.currentTarget);
    if (isSignup && !termsAccepted) {
      setMessage("กรุณาอ่านและยอมรับข้อตกลงการใช้งานก่อนสมัครสมาชิก");
      return;
    }
    const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login";
    const body = isSignup
      ? { displayName: form.get("displayName"), email: form.get("email"), password: form.get("password"), termsAccepted }
      : { email: form.get("email"), password: form.get("password") };
    const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const result = await response.json();
    if (!response.ok) {
      setMessage(result.error ?? (isSignup ? "ไม่สามารถสร้างบัญชีได้" : "ไม่สามารถเข้าสู่ระบบได้"));
      return;
    }
    if (isSignup) {
      setCreated(true);
      setMessage("สร้างบัญชีสำเร็จ กรุณาเข้าสู่ระบบเพื่อเลือกแพ็กเกจสมาชิก");
      return;
    }
    window.location.href = result.role === "ADMIN" ? "/admin/ads" : "/";
  }

  return <main className="auth-shell auth-shell-modern"><Link href="/" className="auth-logo">Bet<span>Pay</span></Link><div className="auth-layout"><section className="auth-pitch"><div className="auth-pitch-image" role="img" aria-label="สนามฟุตบอลภายใต้แสงไฟ" /><div className="auth-pitch-overlay"><span className="auth-pitch-kicker"><Sparkles size={14} />BETPAY MEMBERS CLUB</span><h1>อ่านเกมให้ขาด<br /><span>ก่อนเสียงนกหวีด</span></h1><p>พื้นที่สมาชิกสำหรับทีเด็ดเต็มรูปแบบ สถิติรายวัน และบทวิเคราะห์จาก AI พร้อมทีมงาน</p><div className="auth-proof"><span><ShieldCheck size={16} />ข้อมูลสรุปทุกวัน</span><span><LockKeyhole size={16} />ระบบปลอดภัย</span></div></div></section><section className="auth-card auth-card-modern"><div className="auth-mode-switch" role="tablist" aria-label="เลือกโหมดสมาชิก"><button type="button" className={!isSignup ? "active" : ""} onClick={() => switchMode("login")} role="tab" aria-selected={!isSignup}><LockKeyhole size={16} />เข้าสู่ระบบ</button><button type="button" className={isSignup ? "active" : ""} onClick={() => switchMode("signup")} role="tab" aria-selected={isSignup}><UserRoundPlus size={16} />สมัครสมาชิก</button></div><div className="auth-card-heading"><div className="auth-icon">{isSignup ? <UserRoundPlus size={19} /> : <LockKeyhole size={19} />}</div><div><div className="simple-kicker">{isSignup ? "JOIN BETPAY" : "WELCOME BACK"}</div><h2>{isSignup ? "สร้างบัญชีสมาชิก" : "กลับเข้าสู่ BetPay"}</h2><p>{isSignup ? "เริ่มต้นด้วยบัญชีฟรี แล้วเลือกแพ็กเกจ Silver" : "กลับไปดูคู่เด็ดที่คุณติดตาม"}</p></div></div>{created ? <><div className="success-note"><Check size={16} />{message}</div><button type="button" className="auth-submit" onClick={() => { setCreated(false); setMessage(""); switchMode("login"); }}>เข้าสู่ระบบต่อ <ArrowRight size={17} /></button></> : <form onSubmit={submit}><div className="auth-field"><label htmlFor="auth-email">อีเมล</label><div className="auth-input-wrap"><FileText size={16} /><input id="auth-email" name="email" type="email" required placeholder="you@example.com" /></div></div>{isSignup && <div className="auth-field"><label htmlFor="auth-name">ชื่อที่แสดง</label><div className="auth-input-wrap"><UserRoundPlus size={16} /><input id="auth-name" name="displayName" required placeholder="ชื่อเล่นของคุณ" /></div></div>}<div className="auth-field"><div className="auth-label-row"><label htmlFor="auth-password">รหัสผ่าน</label>{!isSignup && <button type="button" className="auth-help" title="รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"><CircleHelp size={14} />ช่วยเหลือ</button>}</div><div className="auth-input-wrap"><LockKeyhole size={16} /><input id="auth-password" name="password" type={showPassword ? "text" : "password"} required minLength={isSignup ? 8 : undefined} placeholder={isSignup ? "อย่างน้อย 8 ตัวอักษร" : "รหัสผ่านของคุณ"} /><button type="button" className="password-toggle" aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"} onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></div>{isSignup && <label className="terms-check"><input type="checkbox" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} /><span><span>ฉันยอมรับ</span> <button type="button" onClick={() => setTermsOpen(true)}>ข้อตกลงและเงื่อนไขการใช้งาน</button> และนโยบายความเป็นส่วนตัว</span></label>}<button className="auth-submit" type="submit">{isSignup ? "สร้างบัญชีสมาชิก" : "เข้าสู่ระบบ"} <ArrowRight size={17} /></button></form>}{message && !created && <div className="auth-error">{message}</div>}<div className="auth-foot">{isSignup ? "มีบัญชีแล้ว?" : "ยังไม่มีบัญชี?"} <button type="button" onClick={() => switchMode(isSignup ? "login" : "signup")}>{isSignup ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}</button></div></section></div>{termsOpen && <div className="terms-popover-backdrop" role="presentation" onClick={() => setTermsOpen(false)}><aside className="terms-popover" role="dialog" aria-modal="true" aria-labelledby="terms-title" onClick={(event) => event.stopPropagation()}><div className="terms-popover-head"><div><span className="simple-kicker">BETPAY POLICY</span><h2 id="terms-title">ข้อตกลงการใช้งาน</h2></div><button type="button" aria-label="ปิดข้อตกลง" onClick={() => setTermsOpen(false)}><X size={18} /></button></div><div className="terms-popover-body"><p>การใช้งาน BetPay มีวัตถุประสงค์เพื่อข้อมูลข่าวสารและบทวิเคราะห์ฟุตบอลเท่านั้น ผลลัพธ์ไม่ใช่การรับประกันการเดิมพันหรือผลกำไร</p><p>ผู้ใช้ต้องรับผิดชอบข้อมูลบัญชีของตนเอง และยอมรับการจัดเก็บข้อมูลที่จำเป็นต่อการให้บริการตามนโยบายความเป็นส่วนตัว</p><p>ห้ามใช้ระบบในทางที่ผิด ห้ามพยายามเข้าถึงข้อมูลของผู้อื่น และต้องปฏิบัติตามกฎหมายที่เกี่ยวข้อง</p></div><button type="button" className="auth-submit" onClick={() => { setTermsAccepted(true); setTermsOpen(false); }}>อ่านแล้ว ยอมรับเงื่อนไข</button></aside></div>}</main>;
}
