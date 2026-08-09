import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import HomePage from "./page";

test("shows today's football tips heading in Thai", () => {
  render(<HomePage />);
  expect(screen.getByRole("heading", { name: "ทีเด็ดฟุตบอลวันนี้" })).toBeVisible();
});
