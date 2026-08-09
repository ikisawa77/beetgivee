import assert from "node:assert/strict";
import test from "node:test";
import { visibleAds } from "./ads.ts";

test("returns only active ads for the requested placement", () => {
  const ads = [
    { id: "1", placement: "HOME_SLIDER", active: true },
    { id: "2", placement: "HOME_SLIDER", active: false },
    { id: "3", placement: "HOME_MID", active: true },
  ];
  assert.deepEqual(visibleAds(ads, "HOME_SLIDER"), [{ id: "1", placement: "HOME_SLIDER", active: true }]);
});
