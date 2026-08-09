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
};

export function normalizeSiteSettings(value: Partial<SiteSettings> | null | undefined): SiteSettings {
  return { ...defaultSiteSettings, ...Object.fromEntries(Object.entries(value ?? {}).filter(([, item]) => typeof item === "string")) } as SiteSettings;
}
