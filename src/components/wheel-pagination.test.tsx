import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { WheelPagination } from "./wheel-pagination";

test("changes page from the wheel control", () => {
  const onChange = vi.fn();
  render(<WheelPagination totalPages={3} activePage={0} onChange={onChange} ariaLabel="เลือกโฆษณา" />);
  fireEvent.wheel(screen.getByRole("group", { name: "เลือกโฆษณา" }), { deltaY: 10 });
  expect(onChange).toHaveBeenCalledWith(1);
});
