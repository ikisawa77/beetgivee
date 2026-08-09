import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";
import { LoaderProgressiveBar } from "../components/loader-progressive-bar";

const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-prompt",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BetPay | ทีเด็ดฟุตบอลวันนี้",
  description: "ฟุตบอลทีเด็ดคัดโดยทีมงานและ AI พร้อมสรุปผลรายวัน",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body className={prompt.variable}><LoaderProgressiveBar />{children}</body>
    </html>
  );
}
