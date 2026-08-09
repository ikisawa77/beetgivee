"use client";

import { Check, Cookie, Settings2, X } from "lucide-react";
import { useEffect, useState } from "react";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(true);

  useEffect(() => {
    setVisible(document.cookie.includes("betpay_cookie_consent") === false);
  }, []);

  function saveConsent(value: "all" | "essential") {
    document.cookie = `betpay_cookie_consent=${value}; path=/; max-age=${60 * 60 * 24 * 180}; SameSite=Lax`;
    setVisible(false);
  }

  if (!visible) return null;
  return <div className="cookie-consent" role="dialog" aria-label="การตั้งค่าคุกกี้"><div className="cookie-consent-icon"><Cookie size={19} /></div><div className="cookie-consent-copy"><strong>เราใช้คุกกี้เพื่อให้ BetPay ทำงานได้ดีขึ้น</strong><p>คุกกี้จำเป็นช่วยให้ระบบทำงาน ส่วนคุกกี้วิเคราะห์ช่วยให้เราปรับปรุงประสบการณ์การใช้งาน</p><button type="button" className="cookie-policy" onClick={() => setSettingsOpen((open) => !open)}><Settings2 size={14} />ตั้งค่าคุกกี้</button></div><div className="cookie-consent-actions"><button type="button" className="cookie-essential" onClick={() => saveConsent("essential")}>เฉพาะที่จำเป็น</button><button type="button" className="cookie-accept" onClick={() => saveConsent("all")}><Check size={15} />ยอมรับทั้งหมด</button><button type="button" className="cookie-close" aria-label="ปิดการแจ้งเตือนคุกกี้" onClick={() => saveConsent("essential")}><X size={17} /></button></div>{settingsOpen && <div className="cookie-settings"><div><strong>คุกกี้ที่จำเป็น</strong><span>เปิดตลอดเพื่อความปลอดภัยและการเข้าสู่ระบบ</span></div><label><input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} />คุกกี้วิเคราะห์การใช้งาน</label><button type="button" className="cookie-save-settings" onClick={() => saveConsent(analytics ? "all" : "essential")}>บันทึกการตั้งค่า</button></div>}</div>;
}
