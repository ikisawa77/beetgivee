export type SiteSettings = {
  siteName: string;
  tagline: string;
  description: string;
  logoUrl: string;
  phone: string;
  lineId: string;
  facebookUrl: string;
  email: string;
  footerText: string;
  loaderEnabled: boolean;
  loaderDuration: number;
};

export const defaultSiteSettings: SiteSettings = {
  siteName: "BetPay",
  tagline: "ทีเด็ดฟุตบอล คัดสรรด้วยข้อมูล",
  description: "ฟุตบอลทีเด็ดคัดโดยทีมงานและ AI พร้อมสรุปผลรายวัน เพื่อใช้ประกอบการตัดสินใจ",
  logoUrl: "",
  phone: "",
  lineId: "",
  facebookUrl: "",
  email: "",
  footerText: "ข้อมูลเพื่อประกอบการตัดสินใจเท่านั้น โปรดใช้วิจารณญาณในการรับชม",
  loaderEnabled: true,
  loaderDuration: 1400,
};

export function normalizeSiteSettings(value: Partial<SiteSettings> | null | undefined): SiteSettings {
  const strings = Object.fromEntries(Object.entries(value ?? {}).filter(([, item]) => typeof item === "string"));
  const loaderEnabled = typeof value?.loaderEnabled === "boolean" ? value.loaderEnabled : defaultSiteSettings.loaderEnabled;
  const candidateDuration = typeof value?.loaderDuration === "number" && Number.isFinite(value.loaderDuration) ? value.loaderDuration : defaultSiteSettings.loaderDuration;
  return { ...defaultSiteSettings, ...strings, loaderEnabled, loaderDuration: Math.round(Math.min(6000, Math.max(400, candidateDuration))) };
}
