import assert from "node:assert/strict";
import test from "node:test";
import { toPublishableDraft } from "./hermes.ts";

test("does not mark an AI-generated tip as published", () => {
  const draft = toPublishableDraft({ homeTeam: "A", awayTeam: "B", confidence: 82 });
  assert.equal(draft.status, "DRAFT");
});
