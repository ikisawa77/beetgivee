import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken } from "../../lib/auth";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = verifySessionToken(cookies().get("betpay_session")?.value);
  if (!session || session.role !== "ADMIN") redirect("/login");
  return children;
}
