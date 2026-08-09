import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { MemberMenu } from "./member-menu";

test("shows the member name and Thai account actions", () => {
  render(<MemberMenu member={{ displayName: "สมชาย", email: "member@betpay.local", role: "MEMBER" }} />);
  expect(screen.getByRole("button", { name: /เมนูสมาชิกของ สมชาย/ })).toBeVisible();
  expect(screen.getByRole("link", { name: "แพ็กเกจสมาชิก" })).toBeVisible();
  expect(screen.getByRole("button", { name: "ออกจากระบบ" })).toBeVisible();
});
