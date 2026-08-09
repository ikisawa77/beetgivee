import assert from "node:assert/strict";
import test from "node:test";
import { visiblePicks } from "./tips.ts";

test("shows only two published picks to a visitor", () => {
  const picks = [{ id: "1" }, { id: "2" }, { id: "3" }];
  assert.deepEqual(visiblePicks(picks, false), [{ id: "1" }, { id: "2" }]);
});
