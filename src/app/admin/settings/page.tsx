"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { Save, Settings2 } from "lucide-react";
import { defaultSiteSettings, type SiteSettings } from "../../../lib/site-settings";

const fields: Array<{ key: keyof SiteSettings; label: string; placeholder?: string; long?: boolean }> = [
  { key: "siteName", label: "ชื่อเว็บไซต์", placeholder: "BetPay" },
  { key: "tagline", label: "ข้อความสั้นใต้ชื่อเว็บ", placeholder: "ทีเด็ดฟุตบอล คัดสรรด้วยข้อมูล" },
  { key: "logoUrl", label: "ลิงก์รูปโลโก้", placeholder: "https://... หรือ /uploads/..." },
  { key: "description", label: "ข้อมูลเว็บไซต์", long: true },
  { key: "phone", label: "เบอร์โทรศัพท์", placeholder: "02-xxx-xxxx" },
  { key: "lineId", label: "Line ID", placeholder: "@betpay" },
  { key: "facebookUrl", label: "ลิงก์ Facebook", placeholder: "https://facebook.com/..." },
  { key: "email", label: "อีเมลติดต่อ", placeholder: "support@example.com" },
  { key: "footerText", label: "ข้อความท้ายเว็บไซต์", long: true },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [message, setMessage] = useState("");

  useEffect(() => { fetch("/api/admin/settings").then((response) => response.ok ? response.json() : null).then((data) => { if (data) setSettings({ ...defaultSiteSettings, ...data }); }).catch(() => setMessage("ไม่สามารถโหลดข้อมูลเว็บไซต์ได้")); }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
    const result = await response.json();
    if (!response.ok) { setMessage(result.error ?? "ไม่สามารถบันทึกข้อมูลได้"); return; }
    setSettings({ ...defaultSiteSettings, ...result });
    setMessage("บันทึกแล้ว หน้าเว็บไซต์จะใช้ข้อมูลชุดนี้ทันที");
  }
  return <main className="admin-ads admin-settings"><header className="admin-header"><div><div className="simple-kicker">ADMIN CONSOLE</div><h1>ตั้งค่าเว็บไซต์</h1></div><div className="admin-links"><Link href="/admin/ads" className="back-link">จัดการโฆษณา</Link><Link href="/" className="back-link">ดูหน้าเว็บไซต์</Link></div></header><form onSubmit={submit} className="settings-form"><section className="admin-form-panel"><div className="panel-head"><strong>Header และข้อมูลเว็บไซต์</strong><small>แสดงผลในหน้าแรก</small></div><div className="admin-form settings-fields">{fields.slice(0, 4).map((field) => <label key={field.key}>{field.label}{field.long ? <textarea value={settings[field.key]} onChange={(event) => setSettings({ ...settings, [field.key]: event.target.value })} rows={4} /> : <input value={settings[field.key]} onChange={(event) => setSettings({ ...settings, [field.key]: event.target.value })} placeholder={field.placeholder} />}</label>)}</div></section><section className="admin-form-panel"><div className="panel-head"><strong>Footer และช่องทางติดต่อ</strong><small>แก้ไขได้ทุกเมื่อ</small></div><div className="admin-form settings-fields">{fields.slice(4).map((field) => <label key={field.key}>{field.label}{field.long ? <textarea value={settings[field.key]} onChange={(event) => setSettings({ ...settings, [field.key]: event.target.value })} rows={4} /> : <input value={settings[field.key]} onChange={(event) => setSettings({ ...settings, [field.key]: event.target.value })} placeholder={field.placeholder} />}</label>)}<button className="payment-submit"><Save size={17} />บันทึกการตั้งค่า</button>{message && <p className="success-note"><Settings2 size={15} />{message}</p>}</div></section></form></main>;
}
