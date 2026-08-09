import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { createFileLogger } from "./logger.ts";

test("writes structured events and redacts secrets", async () => {
  const directory = await mkdtemp(join(tmpdir(), "betpay-log-"));
  const logger = createFileLogger(directory);
  await logger.info("payment.verified", { userId: "u1", password: "hidden", amount: 499 });
  const file = join(directory, `${new Date().toISOString().slice(0, 10)}.jsonl`);
  const event = JSON.parse(await readFile(file, "utf8"));
  assert.equal(event.event, "payment.verified");
  assert.equal(event.meta.password, "[REDACTED]");
  assert.equal(event.meta.amount, 499);
});
