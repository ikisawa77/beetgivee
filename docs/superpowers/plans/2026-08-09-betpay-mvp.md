# BetPay MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a Thai Prompt-based football-tips platform with administrator-controlled AI drafts, monthly member access, TMWEasy slip verification, and daily settlement.

**Architecture:** Use a Next.js App Router monolith with TypeScript route handlers for authenticated operations and Prisma/PostgreSQL for transactional data. Uploaded images are stored behind a file abstraction; Hermes and TMWEasy are isolated server-side providers with auditable job and payment records. The public site reads published sheets only, while entitlement checks are performed in every member or admin query.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Prompt via `next/font/google`, Prisma, PostgreSQL, Auth.js credentials authentication, Zod, Vitest, Playwright, QR image decoder, and Lucide icons.

---

## File Structure

- `package.json`: scripts and dependencies.
- `prisma/schema.prisma`: relational domain schema and enums.
- `src/lib/entitlements.ts`: subscription access and duration calculations.
- `src/lib/payments/tmweasy.ts`: typed TMWEasy verification client.
- `src/lib/ai/hermes.ts`: typed AI client and schema validation.
- `src/lib/settlement.ts`: result and return calculations.
- `src/app/(public)/*`: public tips, results, auth, plans, and account routes.
- `src/app/admin/*`: protected admin console.
- `src/app/api/*`: authenticated upload, payment, AI, publishing, and settlement routes.
- `src/components/*`: reusable tables, paywall, forms, and admin controls.
- `src/test/*`, `tests/e2e/*`: unit/integration and browser coverage.

### Task 1: Establish the application and repository

**Files:** Create `.gitignore`, `.env.example`, `package.json`, `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`, `README.md`.

- [ ] **Step 1: Initialize the local repository and attach the supplied remote**

Run:
```powershell
git init -b main
git remote add origin https://github.com/ikisawa77/beetgivee.git
```
Expected: `git remote -v` points to the supplied repository.

- [ ] **Step 2: Write the failing render test**

Create `src/app/page.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import HomePage from "./page";

test("shows today's football tips heading in Thai", () => {
  render(<HomePage />);
  expect(screen.getByRole("heading", { name: "ทีเด็ดฟุตบอลวันนี้" })).toBeVisible();
});
```

- [ ] **Step 3: Verify RED**

Run `npm test -- src/app/page.test.tsx`. Expected: FAIL because the app and page do not exist.

- [ ] **Step 4: Implement the minimal app shell**

Create `.env.example` with `DATABASE_URL`, `AUTH_SECRET`, `HERMES_API_BASE_URL`, `HERMES_API_KEY`, `TMW_EASY_USERNAME`, `TMW_EASY_PASSWORD`, `TMW_EASY_RECEIVER_ACCOUNT`, and `TMW_EASY_RECEIVER_BANK_CODE`. Create a page with `<h1>ทีเด็ดฟุตบอลวันนี้</h1>`; configure Prompt in `layout.tsx`; define green, gold, ink, surface, success, and loss CSS tokens.

- [ ] **Step 5: Verify GREEN**

Run `npm test -- src/app/page.test.tsx`. Expected: PASS.

- [ ] **Step 6: Commit**

```powershell
git add .
git commit -m "chore: initialize BetPay application"
git push -u origin main
```

### Task 2: Model the data and access rules

**Files:** Create `prisma/schema.prisma`, `src/lib/entitlements.ts`, `src/lib/entitlements.test.ts`.

- [ ] **Step 1: Write the failing test**
```ts
import { addSubscriptionMonths, canViewFullTips } from "./entitlements";

test("extends an active Silver subscription", () => {
  const now = new Date("2026-08-09T00:00:00.000Z");
  const expiry = new Date("2026-09-01T00:00:00.000Z");
  expect(addSubscriptionMonths(expiry, 3, now)).toEqual(new Date("2026-12-01T00:00:00.000Z"));
  expect(canViewFullTips({ tier: "SILVER", expiresAt: expiry }, now)).toBe(true);
});
```

- [ ] **Step 2: Verify RED**

Run `npm test -- src/lib/entitlements.test.ts`. Expected: FAIL because the helper is absent.

- [ ] **Step 3: Implement schema and helpers**

Define enums `Role` (`ADMIN`, `MEMBER`), `MembershipTier` (`SILVER`, `GOLD`), `PaymentStatus`, `AiJobStatus`, `TipStatus`, and `PickOutcome`. Model `User`, `SubscriptionPlan`, `Subscription`, `PaymentAttempt`, `Upload`, `AiAnalysisJob`, `TipSheet`, `League`, `Match`, `Pick`, `DailySummary`, and `AuditLog`.

Implement:
```ts
export function addSubscriptionMonths(currentExpiry: Date | null, months: number, now: Date) {
  const base = currentExpiry && currentExpiry > now ? currentExpiry : now;
  return new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth() + months, base.getUTCDate()));
}
export function canViewFullTips(subscription: { tier: "SILVER" | "GOLD"; expiresAt: Date } | null, now: Date) {
  return Boolean(subscription && subscription.expiresAt > now);
}
```

- [ ] **Step 4: Verify and migrate**

Run `npm test -- src/lib/entitlements.test.ts`; then `npx prisma migrate dev --name initial_domain`. Expected: PASS and a migration is created.

- [ ] **Step 5: Commit**

```powershell
git add prisma src/lib
git commit -m "feat: add membership and tips domain model"
```

### Task 3: Authenticate and enforce roles

**Files:** Create `src/auth.ts`, `src/lib/authorization.ts`, `src/lib/authorization.test.ts`, `src/app/login/page.tsx`, `src/app/signup/page.tsx`, `src/middleware.ts`.

- [ ] **Step 1: Write the failing test**
```ts
import { requireAdmin } from "./authorization";
test("rejects a member from an admin operation", () => {
  expect(() => requireAdmin({ role: "MEMBER" })).toThrow("ADMIN_REQUIRED");
});
```

- [ ] **Step 2: Verify RED**

Run `npm test -- src/lib/authorization.test.ts`. Expected: FAIL because the guard is absent.

- [ ] **Step 3: Implement Auth.js credentials and guards**

Use server-only password hashing, session user id/role, rate-limited login/signup actions, and middleware redirects from `/admin/*`. Implement `requireAdmin(sessionUser)` to throw `new Error("ADMIN_REQUIRED")` unless role is `ADMIN`.

- [ ] **Step 4: Verify GREEN**

Run `npm test -- src/lib/authorization.test.ts`. Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/auth.ts src/lib/authorization.ts src/app/login src/app/signup src/middleware.ts
git commit -m "feat: add authentication and role guards"
```

### Task 4: Implement paid plans and TMWEasy verification

**Files:** Create `src/lib/payments/tmweasy.ts`, `src/lib/payments/tmweasy.test.ts`, `src/app/api/payments/verify/route.ts`, `src/components/payment-slip-form.tsx`, `src/app/plans/page.tsx`, `src/app/account/page.tsx`.

- [ ] **Step 1: Write the failing provider test**
```ts
import { isAcceptedTmweasyVerification } from "./tmweasy";
test("accepts only a first successful slip verification", () => {
  expect(isAcceptedTmweasyVerification({ status: 1, request_one: 1 })).toBe(true);
  expect(isAcceptedTmweasyVerification({ status: 1, request_one: 0 })).toBe(false);
});
```

- [ ] **Step 2: Verify RED**

Run `npm test -- src/lib/payments/tmweasy.test.ts`. Expected: FAIL because the provider is absent.

- [ ] **Step 3: Implement QR extraction and idempotent activation**

Decode the uploaded slip image to a QR payload, then call `https://www.tmweasy.com/api_verify_slip.php` from the server with `username`, `password`, `qrcode`, `focus_no`, `focus_bankcode`, request IP, and user id as `ref1`. Accept only `status === 1 && request_one === 1`; require the verified amount to meet the selected plan price; use `ref_txid` as a unique key; create an audit record; and extend the subscription in one Prisma transaction. Return `PENDING_REVIEW` for unreadable QR, upstream failure, or amount mismatch.

- [ ] **Step 4: Verify GREEN**

Run `npm test -- src/lib/payments/tmweasy.test.ts`. Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/lib/payments src/app/api/payments src/components/payment-slip-form.tsx src/app/plans src/app/account
git commit -m "feat: verify payment slips and activate plans"
```

### Task 5: Create AI drafts and the admin approval gate

**Files:** Create `src/lib/ai/hermes.ts`, `src/lib/ai/hermes.test.ts`, `src/app/api/admin/uploads/route.ts`, `src/app/api/admin/ai-jobs/[id]/route.ts`, `src/app/admin/tips/new/page.tsx`, `src/components/admin/ai-review-table.tsx`.

- [ ] **Step 1: Write the failing publish-gate test**
```ts
import { toPublishableDraft } from "./hermes";
test("does not mark an AI-generated tip as published", () => {
  const draft = toPublishableDraft({ homeTeam: "A", awayTeam: "B", confidence: 82 });
  expect(draft.status).toBe("DRAFT");
});
```

- [ ] **Step 2: Verify RED**

Run `npm test -- src/lib/ai/hermes.test.ts`. Expected: FAIL because the adapter is absent.

- [ ] **Step 3: Implement the Hermes client and review UI**

Send the image and a strict Thai JSON-schema request to the configured Hermes-compatible endpoint. Validate league, kickoff, teams, odds, recommended side, confidence 0-100, and analysis with Zod. Persist raw response and normalized drafts. The review page supports editing, deleting, ordering, and explicit selection; there is no direct AI-to-public transition.

- [ ] **Step 4: Verify GREEN**

Run `npm test -- src/lib/ai/hermes.test.ts`. Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/lib/ai src/app/api/admin src/app/admin/tips/new src/components/admin
git commit -m "feat: add AI tip drafting and editorial review"
```

### Task 6: Publish responsive football tables with visitor locking

**Files:** Create `src/lib/tips.ts`, `src/lib/tips.test.ts`, `src/components/tips/fixture-table.tsx`, `src/components/tips/locked-picks.tsx`, `src/app/(public)/page.tsx`, `src/app/(public)/results/[date]/page.tsx`.

- [ ] **Step 1: Write the failing visibility test**
```ts
import { visiblePicks } from "./tips";
test("shows only two published picks to a visitor", () => {
  const picks = [{ id: "1" }, { id: "2" }, { id: "3" }];
  expect(visiblePicks(picks, false)).toEqual([{ id: "1" }, { id: "2" }]);
});
```

- [ ] **Step 2: Verify RED**

Run `npm test -- src/lib/tips.test.ts`. Expected: FAIL because the helper is absent.

- [ ] **Step 3: Implement queries and the table**

Implement `visiblePicks(picks, hasEntitlement)` using `picks.slice(0, 2)` for visitors and every published pick for active tiers. Render league group headers, time, home team, chosen side/status, away team, and odds. Keep locked entries visible enough to communicate value but omit picks, odds, and analysis. Use Prompt, compact black headers, forest-green identity accents, gold for Gold status, and accessible settlement states.

- [ ] **Step 4: Verify GREEN**

Run `npm test -- src/lib/tips.test.ts`. Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/lib/tips.ts src/lib/tips.test.ts src/components/tips "src/app/(public)"
git commit -m "feat: publish football tips with visitor lock"
```

### Task 7: Settle results and calculate daily summaries

**Files:** Create `src/lib/settlement.ts`, `src/lib/settlement.test.ts`, `src/app/api/admin/tips/[sheetId]/settle/route.ts`, `src/app/admin/tips/[sheetId]/settle/page.tsx`, `src/components/daily-summary.tsx`.

- [ ] **Step 1: Write the failing return test**
```ts
import { calculateDailySummary } from "./settlement";
test("calculates win count and one-unit return", () => {
  const result = calculateDailySummary([
    { outcome: "WON", odds: 1.8 }, { outcome: "LOST", odds: 1.9 }, { outcome: "VOID", odds: 2.0 },
  ]);
  expect(result).toMatchObject({ settled: 2, won: 1, lost: 1, void: 1, returnUnits: -0.2 });
});
```

- [ ] **Step 2: Verify RED**

Run `npm test -- src/lib/settlement.test.ts`. Expected: FAIL because the module is absent.

- [ ] **Step 3: Implement transitions and aggregates**

Allow only admins to set `PENDING`, `WON`, `LOST`, or `VOID`. Compute return as `odds - 1` for won, `-1` for lost, and `0` for void, then upsert a date-specific `DailySummary`. Display settled count, wins, losses, voids, win rate, and unit return.

- [ ] **Step 4: Verify GREEN**

Run `npm test -- src/lib/settlement.test.ts`. Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/lib/settlement.ts src/lib/settlement.test.ts src/app/api/admin/tips src/app/admin/tips src/components/daily-summary.tsx
git commit -m "feat: settle tips and calculate daily results"
```

### Task 8: Complete the admin console and end-to-end verification

**Files:** Create `src/app/admin/page.tsx`, `src/app/admin/members/page.tsx`, `src/app/admin/plans/page.tsx`, `src/app/admin/payments/page.tsx`, `tests/e2e/visitor-lock.spec.ts`, `tests/e2e/admin-publish.spec.ts`, `tests/e2e/payment-status.spec.ts`.

- [ ] **Step 1: Write the failing visitor-lock browser test**
```ts
import { test, expect } from "@playwright/test";
test("visitor sees two picks and an unlock action", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("published-pick")).toHaveCount(2);
  await expect(page.getByRole("link", { name: "สมัครสมาชิกเพื่อดูทีเด็ดทั้งหมด" })).toBeVisible();
});
```

- [ ] **Step 2: Verify RED**

Run `npx playwright test tests/e2e/visitor-lock.spec.ts`. Expected: FAIL until seeded published data and the lock are available.

- [ ] **Step 3: Build operational pages and seed data**

Create dashboard counters for pending payment reviews, active members, AI jobs, and sheet status. Add member, plan, and payment lists with filters and audit detail links. Seed an admin, an active Silver member, four published picks, and one completed summary. All admin routes call `requireAdmin` server-side; controls have keyboard focus states and announced form errors.

- [ ] **Step 4: Add remaining browser tests**

Create `admin-publish.spec.ts` for upload-draft-review-publish and `payment-status.spec.ts` for unreadable-slip pending-review UI. Mock only external Hermes/TMWEasy HTTP boundaries.

- [ ] **Step 5: Verify all checks**

Run:
```powershell
npm run lint
npm test
npx prisma validate
npx playwright test
npm run build
```
Expected: all commands exit 0.

- [ ] **Step 6: Commit and push**

```powershell
git add .
git commit -m "feat: complete BetPay MVP workflows"
git push
```

## Plan Self-Review

- Spec coverage: Tasks 2-3 cover roles/access; Task 4 covers configurable paid memberships and TMWEasy duplicate prevention; Task 5 covers private AI analysis plus admin control; Task 6 covers Thai tables and the two-pick visitor rule; Task 7 covers daily outcomes; Task 8 covers operational administration and verification.
- Placeholder scan: no `TBD`, `TODO`, or unspecified implementation hand-offs are present. Deployment secrets are configuration values because they are user-owned credentials.
- Type consistency: `MembershipTier`, `PickOutcome`, `addSubscriptionMonths`, `canViewFullTips`, `isAcceptedTmweasyVerification`, `visiblePicks`, and `calculateDailySummary` are consistently named before dependent tasks.
