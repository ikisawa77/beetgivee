"use client";

import { useEffect, useState } from "react";
import { defaultSiteSettings } from "../lib/site-settings";

export function LoaderProgressiveBar() {
  const [visible, setVisible] = useState(true);
  const [duration, setDuration] = useState(defaultSiteSettings.loaderDuration);
  const [enabled, setEnabled] = useState(defaultSiteSettings.loaderEnabled);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/settings").then((response) => response.ok ? response.json() : null).then((settings) => {
      if (cancelled || !settings) return;
      setDuration(settings.loaderDuration ?? defaultSiteSettings.loaderDuration);
      setEnabled(settings.loaderEnabled ?? defaultSiteSettings.loaderEnabled);
    }).catch(() => undefined);
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!enabled) { setVisible(false); return; }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setVisible(false); return; }
    const timer = window.setTimeout(() => setVisible(false), duration);
    return () => window.clearTimeout(timer);
  }, [duration, enabled]);

  if (!visible) return null;
  return <div className="site-loader" role="status" aria-label="กำลังโหลดเว็บไซต์"><div className="loader-radar" aria-hidden="true"><span className="loader-ring ring-one" /><span className="loader-ring ring-two" /><span className="loader-ring ring-three" /><span className="loader-sweep" /><span className="loader-dot dot-one" /><span className="loader-dot dot-two" /></div><div className="loader-copy"><strong>BetPay</strong><span>กำลังเตรียมข้อมูลฟุตบอล</span></div><div className="loader-progress"><span style={{ animationDuration: `${duration}ms` }} /></div></div>;
}
