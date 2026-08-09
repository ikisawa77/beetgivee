"use client";

import { Bell, CalendarDays, Compass, CreditCard, FileText, HelpCircle, LogOut, Menu, Search, ShieldCheck, UserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type MemberIdentity = { displayName: string; email: string; role: "ADMIN" | "MEMBER" };

export function MemberMenu({ member }: { member: MemberIdentity }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const initial = member.displayName.trim().charAt(0).toUpperCase() || "M";
  const tier = member.role === "ADMIN" ? "ผู้ดูแลระบบ" : "สมาชิก Silver";

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

  return <div className="member-menu" ref={menuRef}><button type="button" className="member-trigger" aria-label={`เมนูสมาชิกของ ${member.displayName}`} aria-expanded={open} onClick={() => setOpen((value) => !value)}><span className="member-avatar">{initial}</span><span className="member-trigger-copy"><strong>{member.displayName}</strong><small>{tier}</small></span><Menu size={18} aria-hidden="true" /></button>{open && <div className="member-popover" role="menu"><div className="member-summary"><span className="member-avatar large">{initial}</span><div><strong>{member.displayName}</strong><span>{member.email}</span></div></div><div className="member-tier"><ShieldCheck size={16} />{tier}</div><div className="member-menu-links"><Link href="/plans" role="menuitem" onClick={() => setOpen(false)}><CreditCard size={17} />แพ็กเกจสมาชิก</Link><Link href="/results" role="menuitem" onClick={() => setOpen(false)}><FileText size={17} />สรุปผลการแข่งขัน</Link>{member.role === "ADMIN" && <Link href="/admin/settings" role="menuitem" onClick={() => setOpen(false)}><UserRound size={17} />ตั้งค่าเว็บไซต์</Link>}</div><div className="member-explore"><div className="member-explore-title"><Compass size={15} />สำรวจเพิ่มเติม</div><Link href="/results" role="menuitem" onClick={() => setOpen(false)}><CalendarDays size={16} /><span><strong>สรุปผลรายวัน</strong><small>ดูสถิติทีมต่อและผลงานย้อนหลัง</small></span></Link><a href="#tips" role="menuitem" onClick={() => setOpen(false)}><Search size={16} /><span><strong>ค้นหาคู่บอล</strong><small>เลือกดูโปรแกรมตามลีกและเวลา</small></span></a><Link href="/plans" role="menuitem" onClick={() => setOpen(false)}><Bell size={16} /><span><strong>แจ้งเตือนทีเด็ด</strong><small>เปิดสิทธิ์แจ้งเตือนสำหรับสมาชิก</small></span></Link><a href="#footer" role="menuitem" onClick={() => setOpen(false)}><HelpCircle size={16} /><span><strong>ช่วยเหลือและติดต่อเรา</strong><small>ข้อมูลเว็บไซต์และช่องทางติดต่อ</small></span></a></div><button type="button" className="member-logout" role="menuitem" onClick={logout}><LogOut size={17} />ออกจากระบบ</button></div>}</div>;
}
