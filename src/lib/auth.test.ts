import assert from "node:assert/strict";
import test from "node:test";
import { createSessionToken, verifySessionToken } from "./auth.ts";

test("creates and verifies a signed admin session", () => {
  const token = createSessionToken({ userId: "admin-1", role: "ADMIN" }, "test-secret");
  assert.deepEqual(verifySessionToken(token, "test-secret"), { userId: "admin-1", role: "ADMIN" });
});
