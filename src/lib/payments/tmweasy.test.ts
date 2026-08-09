import assert from "node:assert/strict";
import test from "node:test";
import { isAcceptedTmweasyVerification } from "./tmweasy.ts";

test("accepts only a first successful slip verification", () => {
  assert.equal(isAcceptedTmweasyVerification({ status: 1, request_one: 1 }), true);
  assert.equal(isAcceptedTmweasyVerification({ status: 1, request_one: 0 }), false);
});
