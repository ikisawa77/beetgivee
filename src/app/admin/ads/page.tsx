"use client";

import Link from "next/link";
import { ImagePlus, Link2, MonitorUp, ToggleLeft } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";

type ManagedAd = { id: number; title: string; placement: string; link: string; image: string; active: boolean };

const placementNames: Record<string, string> = { HOME_SLIDER: "สไลด์หน้าแรก", HOME_MID: "กรอบกลางหน้าแรก", HOME_SIDEBAR: "กรอบด้านข้าง", HOME_BOTTOM: "กรอบท้ายหน้าแรก" };

export default function AdminAdsPage() {
  const [image, setImage] = useState("");
  const [ads, setAds] = useState<ManagedAd[]>([]);
  const [message, setMessage] = useState("");
  function chooseImage(event: ChangeEvent<HTMLInputElement>) { const file = event.target.files?.[0]; if (file) setImage(URL.createObjectURL(file)); }
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const data = new FormData(event.currentTarget); const title = String(data.get("title") ?? ""); const link = String(data.get("link") ?? ""); const placement = String(data.get("placement") ?? "HOME_SLIDER"); if (!image || !title || !link) { setMessage("กรุณาเลือกรูปภาพ และกรอกชื่อกับลิงก์ให้ครบ"); return; } setAds((items) => [{ id: Date.now(), title, link, placement, image, active: true }, ...items]); setMessage("เพิ่มโฆษณาในรายการแล้ว กดบันทึกเพื่อเผยแพร่เมื่อเชื่อมต่อฐานข้อมูล"); event.currentTarget.reset(); setImage(""); }
  return <main className="admin-ads"><header className="admin-header"><div><div className="simple-kicker">ADMIN CONSOLE</div><h1>จัดการโฆษณา</h1></div><Link href="/" className="back-link">ดูหน้าเว็บไซต์</Link></header><div className="admin-grid"><section className="admin-form-panel"><div className="panel-head"><strong>เพิ่มโฆษณาใหม่</strong><small>รูปภาพ + ลิงก์ปลายทาง</small></div><form onSubmit={submit} className="admin-form"><label>ชื่อโฆษณา<input name="title" placeholder="เช่น โปรสมาชิก Silver" /></label><label>ตำแหน่งแสดงผล<select name="placement">{Object.entries(placementNames).map(([value, name]) => <option key={value} value={value}>{name}</option>)}</select></label><label>ลิงก์เมื่อคลิก<input name="link" type="url" placeholder="https://... หรือ /plans" /></label><label>รูปภาพโฆษณา<input type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseImage} /><span className="upload-hint"><ImagePlus size={18} />รองรับ JPG, PNG, WEBP</span></label>{image && <img className="admin-preview" src={image} alt="ตัวอย่างโฆษณา" />}<button className="payment-submit"><MonitorUp size={17} />เพิ่มเข้ารายการโฆษณา</button>{message && <p className="success-note">{message}</p>}</form></section><section className="admin-list-panel"><div className="panel-head"><strong>รายการโฆษณา</strong><small>{ads.length} รายการในรอบนี้</small></div>{ads.length === 0 ? <div className="admin-empty"><ImagePlus size={26} /><p>ยังไม่มีโฆษณาที่เพิ่มในรอบนี้</p></div> : <div className="admin-ad-list">{ads.map((ad) => <article className="admin-ad-row" key={ad.id}><img src={ad.image} alt="" /><div><b>{ad.title}</b><span>{placementNames[ad.placement]}</span><small><Link2 size={11} />{ad.link}</small></div><button className={ad.active ? "ad-active" : "ad-inactive"} onClick={() => setAds((items) => items.map((item) => item.id === ad.id ? { ...item, active: !item.active } : item))}><ToggleLeft size={15} />{ad.active ? "เปิด" : "ปิด"}</button></article>)}</div>}</section></div></main>;
}
