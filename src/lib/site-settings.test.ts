import assert from "node:assert/strict";
import test from "node:test";
import { defaultSiteSettings, normalizeSiteSettings } from "./site-settings.ts";

test("normalizes partial site settings over the Thai defaults", () => {
  assert.deepEqual(normalizeSiteSettings({ siteName: "บอลวันนี้", footerText: "ติดต่อเรา" }), {
    ...defaultSiteSettings,
    siteName: "บอลวันนี้",
    footerText: "ติดต่อเรา",
  });
});
