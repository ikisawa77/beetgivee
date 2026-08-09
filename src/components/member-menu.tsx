"use client";

import { Bell, CalendarDays, Compass, CreditCard, FileText, HelpCircle, LogOut, Menu, Search, ShieldCheck, UserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type MemberIdentity = { displayName: string; email: string; role: "ADMIN" | "MEMBER"; tier?: "MEMBER" | "SILVER" | "GOLD"; avatarUrl?: string };

export function MemberMenu({ member }: { member: MemberIdentity }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const initial = member.displayName.trim().charAt(0).toUpperCase() || "M";
  const tier = member.role === "ADMIN" ? "ผู้ดูแลระบบ" : member.tier === "GOLD" ? "สมาชิก Gold" : member.tier === "SILVER" ? "สมาชิก Silver" : "Member";
  const medal = member.role === "ADMIN" || member.tier === "GOLD" ? "GOLD" : member.tier === "SILVER" ? "SILVER" : "MEMBER";

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) { if (!menuRef.current?.contains(event.target as Node)) setOpen(false); }
    function closeOnEscape(event: KeyboardEvent) { if (event.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => { document.removeEventListener("mousedown", closeOnOutsideClick); document.removeEventListener("keydown", closeOnEscape); };
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.assign("/");
  }

  return <div className="member-menu" ref={menuRef}><button type="button" className="member-trigger" aria-label={`เมนูสมาชิกของ ${member.displayName}`} aria-expanded={open} onClick={() => setOpen((value) => !value)}><span className={`member-avatar medal-${medal.toLowerCase()}`}>{member.avatarUrl ? <img src={member.avatarUrl} alt="" /> : initial}</span><span className="member-trigger-copy"><strong>{member.displayName}</strong><small>{tier}</small></span><Menu size={18} aria-hidden="true" /></button>{open && <div className="member-popover" role="menu"><div className="member-summary"><span className={`member-avatar large medal-${medal.toLowerCase()}`}>{member.avatarUrl ? <img src={member.avatarUrl} alt="" /> : initial}</span><div><strong>{member.displayName}</strong><span>{member.email}</span><em className={`member-medal medal-text-${medal.toLowerCase()}`}>MEDAL {medal}</em></div></div><div className="member-tier"><ShieldCheck size={16} />{tier}</div><div className="member-menu-links"><Link href="/profile" role="menuitem" onClick={() => setOpen(false)}><UserRound size={17} />โปรไฟล์ของฉัน</Link><Link href="/plans" role="menuitem" onClick={() => setOpen(false)}><CreditCard size={17} />แพ็กเกจสมาชิก</Link><Link href="/results" role="menuitem" onClick={() => setOpen(false)}><FileText size={17} />สรุปผลการแข่งขัน</Link>{(member.role === "ADMIN" || member.tier === "GOLD") && <Link href="/forum" role="menuitem" onClick={() => setOpen(false)}><Compass size={17} />เว็บบอร์ด</Link>}{member.role === "ADMIN" && <Link href="/admin/settings" role="menuitem" onClick={() => setOpen(false)}><UserRound size={17} />ตั้งค่าเว็บไซต์</Link>}</div><div className="member-explore"><div className="member-explore-title"><Compass size={15} />พื้นที่สมาชิก</div><Link href="/chat" role="menuitem" onClick={() => setOpen(false)}><Bell size={16} /><span><strong>ช่อง Chat</strong><small>{member.role === "ADMIN" || member.tier === "GOLD" || member.tier === "SILVER" ? "เปิดใช้งานได้" : "อัปเกรดเป็น Silver"}</small></span></Link><Link href="/alerts" role="menuitem" onClick={() => setOpen(false)}><Search size={16} /><span><strong>แจ้งเตือนทีเด็ด</strong><small>{member.role === "ADMIN" || member.tier === "GOLD" ? "เปิดใช้งานได้" : "อัปเกรดเป็น Gold"}</small></span></Link><Link href="/profile" role="menuitem" onClick={() => setOpen(false)}><HelpCircle size={16} /><span><strong>แก้ไขโปรไฟล์</strong><small>ชื่อเล่น รูป Avatar และรหัสผ่าน</small></span></Link></div><button type="button" className="member-logout" role="menuitem" onClick={logout}><LogOut size={17} />ออกจากระบบ</button></div>}</div>;
}
