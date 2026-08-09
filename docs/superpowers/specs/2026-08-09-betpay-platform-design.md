# BetPay Platform Design

## Purpose

Build a Thai-language football tips platform where an administrator uploads odds or fixture images, uses AI to draft structured match analysis, and publishes only administrator-approved tips. The public experience uses the Prompt typeface and a modern football editorial style inspired by dense fixture tables, without copying another site.

## Scope: First Release

### Roles

| Role | Access |
| --- | --- |
| Visitor | View normal site content and exactly two example picks on each published tip sheet. Prompted to join to unlock the rest. |
| Silver member | View all published picks, confidence ranking, odds, analysis, and historical results while the subscription is active. |
| Gold member | Reserved entitlement tier. Its premium benefits and forum are not delivered in the first release, but roles and subscription records support upgrading to it. |
| Admin | Full management of site content, members, plans, uploaded images, AI drafts, published picks, payment verification, and daily results. |

### Subscription and Payments

Admins configure monthly plans for 1, 3, 6, and 12 months, including their price, tier, and active/inactive state. A member chooses a plan and uploads a payment slip. The server submits the relevant slip data to TMWEasyAPI, records the response, rejects duplicate or invalid slips, and activates or extends the subscription only after a successful verification.

The TMWEasyAPI secret and Hermes AI key are server-only environment variables. Neither is sent to a browser, logged in full, or stored in source control.

### AI-assisted Editorial Workflow

1. An admin uploads a fixture or odds image.
2. The server creates a processing record and submits the image to Hermes AI.
3. The AI response is converted into a draft containing league, kickoff, teams, handicap/odds, suggested side, confidence, and Thai analysis.
4. The admin reviews, corrects, removes, reorders, and explicitly marks the tips to publish.
5. The published sheet is shown on the public site. Visitors receive only its first two published entries; active members receive every entry.

AI is advisory. It never publishes or activates a payment by itself.

### Daily Result Summary

After fixtures settle, an admin records each result or uses an uploaded result image to create a reviewable draft. The admin confirms a tip as won, lost, void, or pending. The system calculates daily and period summaries: tips settled, wins, losses, voids, win rate, and return based on the entered odds/stake convention. The admin can present a clear daily performance recap on the public site.

## Experience

### Public Site

The home screen centers on today's published football table. Each league is grouped in a compact, scannable section with match time, home team, pick/status, away team, and handicap/odds. A ranked tips panel makes the confidence order unmistakable. Completed-day pages show results and the calculated record.

The surface is mobile-first, Thai, and uses Prompt. The design uses white/near-white reading surfaces, deep green football accents, restrained gold for Gold status, black table headers, and high-contrast win/loss indicators. It avoids a marketing landing-page detour: the fixtures and tips are the first screen.

### Membership

Visitors can register, choose a plan, see payment instructions, upload a slip, and view a clear verification state. An account page shows tier, remaining access date, subscription history, payment receipts, and upgrade paths. Locked entries remain visible enough to communicate value but do not disclose their picks, odds, or analysis.

### Admin Console

The console has focused operational areas:

- Dashboard: current subscribers, pending payment reviews, AI processing queue, and today's publishing state.
- Tip sheets: create daily sheet, upload image, review AI-extracted matches, edit data, rank, publish, and settle results.
- Members and plans: manage users, Silver/Gold tier, plan prices, durations, and subscription status.
- Payments: inspect slip image, verification response, duplicate detection result, and activation audit trail.
- Site content: manage notices, editorial copy, and day-level summary display.

## Architecture

The application is a full-stack web app with a responsive Thai frontend, an authenticated server API, relational persistence, and a private file store for uploaded images.

Key domain entities:

- User, Role, SubscriptionPlan, Subscription
- PaymentAttempt, PaymentVerification
- Upload, AiAnalysisJob
- TipSheet, League, Match, Pick
- MatchResult, DailySummary
- AuditLog

The permission layer is enforced on the server. UI locking is only a convenience; API responses exclude unpublished, locked, and admin-only data for unauthorized users.

## Reliability and Security

- Validate image type/size and store uploads outside public executable paths.
- Authenticate every payment callback or verification response and make payment activation idempotent.
- Use an idempotency key/fingerprint for a payment slip to prevent duplicate crediting.
- Record AI input/output, editor changes, publication, settlement, and subscription changes in audit logs.
- Rate-limit authentication, upload, payment, and AI operations.
- Present a manual review state when either upstream service is unavailable or returns an ambiguous response.

## Testing and Acceptance

Automated tests cover role-based tip visibility, plan duration/extension calculations, duplicate-slip prevention, payment state transitions, AI draft-to-publish approval gating, and daily result/return calculations. End-to-end tests cover visitor lock behavior, member purchase verification state, admin tip publishing, and daily settlement.

The visual check covers desktop and mobile fixture tables, locked-tip state, member account, payment upload, and the admin review flow. The first viewport shows the real football tips product rather than a promotional page.

## Deliberate Deferrals

- Gold-exclusive benefits beyond tier and upgrade support.
- Member web forum.
- Automated external fixture/result feed.
- Native mobile application.
- Multi-language content.

## Assumptions

- The administrator supplies or verifies the fixture/odds information through images in the first release.
- Payment credentials, destination account details, Hermes model identifier, and plan prices will be configured during deployment.
- Admin-entered result statuses are the source of truth when no external result feed exists.
