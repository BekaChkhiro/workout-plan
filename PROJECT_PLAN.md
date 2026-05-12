# Fit Plan — Project Plan (v0.1, personal-use)

> Mobile-only PWA for a 4-week Georgian nutrition + workout program. Built for **personal daily-driver use** — single user (the owner), no public release, no signup flow, no support burden.

---

## 0. What this product is — and is not

### Is

- A **mobile-only PWA** for tracking 5 daily meals, weekly workouts, water, weight, and body measurements over a 4-week cycle.
- **Single-user** — one account, the owner. Email + password login with 1-year "remember me" session.
- **Fully editable plan** — every meal, workout, target value, and progression can be edited via in-app editors.
- **Push-notification-driven** — meal and workout reminders fired by Vercel Cron, delivered via Web Push (VAPID).
- **Bilingual-ready, Georgian-first** — all UI copy in `ka`, fonts loaded for both Latin (DM Sans) and Georgian (Noto Sans Georgian).
- Visual identity: **Soft Pastel Feminine** (Style C), locked in week-plan/screens/.

### Is not (v0.1)

- **Not a desktop or tablet app.** Viewport is locked to mobile width (390–430px); larger screens see a "use on phone" placeholder.
- **Not multi-user.** No signup form, no organisation/team model. The single account is seeded once via CLI script. Adding more users is deferred.
- **Not a fitness-as-a-service platform.** No public marketplace of plans, no community, no trainer/client roles.
- **Not a calorie database.** Meals are pre-defined with edit affordance; there's no food search, barcode scan, or nutrition API integration.
- **Not an exercise video library.** Workout descriptions are text + optional YouTube URL; no embedded player in v0.1.
- **Not a wearables hub.** No HealthKit, no Google Fit, no heart-rate ingestion.

### Why build this

The owner has a real 4-week nutrition + workout plan from a source document (`Downloads/კვების_ვარჯიშის გეგმა.docx`) and currently tracks adherence by memory. A PWA installed on her phone gives her a single tap into "what should I eat / do next, and have I done it?" — with reminders so she doesn't forget. Audience: **one person — the owner**. Best motivator: dogfood from day 1.

---

## 1. Stack (locked decisions)

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next.js 15 (App Router) | RSC + server actions; first-class Vercel deploy; mobile-first works fine |
| Language | TypeScript (strict) | Type-safety across server actions + Drizzle + client forms |
| Styling | Tailwind CSS v4 + CSS custom properties | Style C tokens encode cleanly as Tailwind theme; CSS vars used at runtime for gradients |
| Components | shadcn/ui (mobile-curated subset) | Pre-built accessible primitives; we override styles to match Style C |
| State (client) | TanStack Query + Zustand | Query for server cache; Zustand for ephemeral UI state (modals, toggles) |
| Forms | react-hook-form + zod | Strict validation in Meal/Workout editors and Settings |
| DB | Neon Postgres (serverless) | Free tier covers our usage; native to Vercel; instant branching |
| ORM | Drizzle + drizzle-kit | Type-safe queries + migrations; lightweight; matches Next.js philosophy |
| Auth | Lucia v3 + Argon2 password hashing | Lightweight, no external SaaS; 1-year session cookie via DB-stored sessions |
| Image hosting | Vercel Blob | Native to Vercel; pay-per-GB, low for one user |
| Charts | Recharts | Weight + measurement charts; tree-shakes well |
| Animations | Framer Motion (`motion` package) | Style C requires bouncy springs + confetti |
| PWA | Custom service worker + `next-pwa` plugin OR Serwist | Final pick during T6.3 (Serwist preferred — actively maintained) |
| Push notifications | `web-push` + VAPID + Vercel Cron | Free tier sufficient; works on iOS 16.4+ installed PWAs and Android Chrome |
| Hosting | Vercel Hobby tier | $0 for personal use; serverless functions handle cron + push |
| Fonts | `next/font` — DM Sans (Latin) + Noto Sans Georgian | Both self-hosted, optimised, no CDN dependency at runtime |

---

## 1.5. Design reference (canonical)

The full visual + interaction design for v0.1 lives in `week-plan/` as a React reference implementation. **This is the canonical visual ground truth.** When the implementation in Next.js could go either way, match the prototype. When this plan's text disagrees with the prototype on UX detail, **the prototype wins** — update the plan via PR.

| File | Contents |
|---|---|
| `week-plan/index.html` | Entry — loads React UMD + Babel standalone + scripts |
| `week-plan/app.jsx` | Root state, gallery wiring across screens |
| `week-plan/design-canvas.jsx` | Multi-artboard layout for cross-screen comparison |
| `week-plan/ios-frame.jsx` | Reusable iPhone chrome wrapping each screen |
| `week-plan/screens/shared.jsx` | `TODAY` sample data, `CalRing` SVG helper, `TabIcon` library, `TokenSheet` |
| `week-plan/screens/style-c.jsx` | **Today** screen — greeting, calorie ring, water, 5 meal cards, workout card |
| `week-plan/screens/plan-c.jsx` | **Plan** screen — week tabs 1-4, intensity progression, 7-day list |
| `week-plan/screens/meals-c.jsx` | **Meals** screen — day-type toggle, daily summary, 5 meal cards (collapsed + expanded) |
| `week-plan/screens/progress-c.jsx` | **Progress** screen — weight chart, recent entries, achievement banner |
| `week-plan/screens/profile-c.jsx` | **Profile** screen — identity card + 6 settings sections + danger zone |
| `week-plan/screens/auth-c.jsx` | **Login** + 4 **Onboarding** steps (welcome / iOS A2HS / notifications / ready) |
| `week-plan/screens/editors-c.jsx` | **Meal Editor** + **Workout Editor** bottom-sheet modals |
| `week-plan/screens/rules-c.jsx` | **Rules** reference — 8 thematic sections + hero intro + closing card |

Design prompts that produced the prototype live in `design-prompts/`. `_TOKENS.md` is the locked token table — copy directly into `tailwind.config.ts` and CSS custom properties during T1.4.

### Task → screen reference mapping

Use this when implementing — grep your task ID, open the listed file, copy the JSX patterns into Next.js components.

| Task | Screen / component(s) | Source file |
|---|---|---|
| T1.4 Design system + tokens | All colors, gradients, type scale, radii, shadows, motion | `design-prompts/_TOKENS.md` + `week-plan/screens/style-c.jsx` (`STYLE_C_TOKENS` const) |
| T1.7 Georgian + Latin font loading | Sample DM Sans + Noto Sans Georgian in every screen | `week-plan/screens/*-c.jsx` (font-family declarations) |
| T1.9 Mobile container layout | iPhone-frame chrome (390×844), safe-area handling | `week-plan/ios-frame.jsx` |
| T2.1 Schema design | Sample data shape for meals, workouts, water, weight | `week-plan/screens/shared.jsx` (`TODAY` const) |
| T4.1 Bottom navigation | Floating frosted-glass pill, 5 tabs, active state | `week-plan/screens/style-c.jsx` (bottom nav block) |
| T4.2 Today screen | Greeting, calorie ring, water, meal list, workout card | `week-plan/screens/style-c.jsx` |
| T4.3 Meal completion interaction | Active card + done card visual states | `week-plan/screens/style-c.jsx` (meal map) |
| T4.4 Today's workout card | Lilac→pink gradient card, intensity chips, CTA | `week-plan/screens/style-c.jsx` (workout block) |
| T4.5 Water tracker | 8-glass row with gradient fill | `week-plan/screens/style-c.jsx` (water block) |
| T4.6 Calorie ring | SVG gradient stroke ring, P/N/F mini-bars | `week-plan/screens/shared.jsx` (`CalRing`) + `style-c.jsx` |
| T4.7 Plan screen | Week tabs + intensity bars + 7-day list | `week-plan/screens/plan-c.jsx` |
| T4.8 Manual week-jump | 4-segment Week 1-4 picker | `week-plan/screens/plan-c.jsx` (week tabs block) + `profile-c.jsx` |
| T4.9 Meals screen | Day-type toggle, day summary, 5-card list with expansion | `week-plan/screens/meals-c.jsx` |
| T4.11 Meal Editor sheet | Bottom-sheet modal with ingredients, macros, swaps | `week-plan/screens/editors-c.jsx` (artboard 1) |
| T4.12 Workout Editor sheet | Bottom-sheet modal with type, intensity, weekday picker | `week-plan/screens/editors-c.jsx` (artboard 2) |
| T5.1 Progress screen layout | 4-tab segmented control + content area | `week-plan/screens/progress-c.jsx` |
| T5.3 Weight chart | Bezier line with gradient stroke + area fill + tooltip | `week-plan/screens/progress-c.jsx` (chart block) |
| T5.7 Adherence stats | Mint pill, achievement banner pattern | `week-plan/screens/progress-c.jsx` (achievement block) |
| T5.8 Rules screen | Hero intro + 8 thematic sections + closing card | `week-plan/screens/rules-c.jsx` |
| T5.9 Profile screen | Identity card + 6 settings sections + danger zone | `week-plan/screens/profile-c.jsx` |
| T6.9 iOS Add-to-Home onboarding | Step 2 of onboarding flow | `week-plan/screens/auth-c.jsx` (artboard 3) |
| T6.10 Notification settings | Profile Section 4 (4 toggle rows) | `week-plan/screens/profile-c.jsx` |
| T7.1 Auth + login screen | Logo emblem, form, "remember me", forgot password | `week-plan/screens/auth-c.jsx` (artboard 1) |
| T7.2 Onboarding flow | 4-step welcome → A2HS → notifications → ready | `week-plan/screens/auth-c.jsx` (artboards 2-5) |

**Known prototype scope gaps** (implement using prototype's existing patterns as reference):

| Task | Gap | Suggested approach |
|---|---|---|
| T5.6 Progress photos grid | Not yet in `progress-c.jsx` (Weight tab only) | Build as 4th tab "📸 ფოტო"; 3-column square grid with rounded-md tiles, FAB to add photo, tap to view full-screen; reuse the tab segmented control |
| T5.4-T5.5 Measurement form + history | Not yet in `progress-c.jsx` | Build as 2nd tab "📏 ზომები"; form mirrors Profile settings card pattern (waist / arm / thigh number inputs); history below is a list of rows like the weight "ბოლო ჩანაწერები" |
| T4.13 Reorder meals | Meals screen shows static order; no drag handle | Add drag handle dots (⋮⋮) at left of each meal card in edit mode; reuse `dnd-kit` pattern; visual identical to ingredient drag handles in `editors-c.jsx` |
| T7.3 Lighthouse PWA pass | Not a visual gap — config + perf work | No prototype mapping needed |

These four gaps are small. Extend the prototype during the relevant task work and update §1.5 mapping, OR implement directly against the suggested approach.

---

## 2. Targets (audited — honest numbers)

| Metric | v0.1 baseline | v0.1 stretch | Notes |
|---|---|---|---|
| Lighthouse PWA score | ≥ 90 | 100 | Mobile audit, Vercel production URL |
| Lighthouse Performance | ≥ 85 | ≥ 95 | LCP < 2.5s on Slow 4G |
| Initial JS bundle (gzipped) | < 200 KB | < 150 KB | Lazy-load non-critical screens (Rules, Editors) |
| Time-to-Interactive (Slow 4G) | < 4s | < 3s | Vercel Edge cache + RSC streaming |
| Daily active reminders | 6 (5 meals + 1 workout) | + 1 water + 1 weight | Configurable per category in Profile |
| Push delivery latency (Vercel Cron → device) | < 90s | < 30s | iOS APNS routing is the variable |
| DB queries per Today-screen load | ≤ 4 | ≤ 2 | Aggregate via one RSC fetch |
| Offline support | Cached shell + last 24h data | Full week-ahead cache | Stale-while-revalidate via service worker |
| Accessibility (axe-core) | 0 critical issues | 0 issues at all levels | Manual screen-reader smoke too |

### Platform support (v0.1)

- **Mobile Safari (iOS 16.4+)** — primary target, required for push
- **Mobile Chrome (Android 10+)** — secondary
- **Desktop browsers** — display "use on phone" message; no functional support
- **Tablets** — same mobile layout (no special tablet UI), works but not optimised

---

## 3. Auth & session model — explicit decision

This was a critical ambiguity in v0 of the plan. **v0.1 adopts the "long-lived DB session with rolling refresh" model.**

| Model | Survives | Pros | Cons | v0.1? |
|---|---|---|---|---|
| **Lucia DB sessions with 1-year cookie, refreshed on use** (chosen) | Year-long without re-login; survives device restart; revocable server-side | Short of "infinite", as close to "never log me out" as it gets; easy to revoke | DB hit per request (mitigated by edge cache) | ✅ |
| JWT in localStorage with 1-year exp | Year-long; pure client | Can't revoke; XSS-leaky | Insecure for our use | ❌ |
| Magic-link email per login | Sessions are short | No password to manage | Defeats "remember me forever"; reliance on email | ❌ |
| OAuth (Google / Apple) | Per provider | No password; familiar | Overkill for single-user app | ❌ |

**Marketing copy must say:** "Stay signed in for a year." Anything stronger (no expiration) is false — Lucia sessions need a documented max age and can be invalidated.

---

## 4. Differentiation — irrelevant for personal use

Skipped. This is a single-user app; there are no competitors to position against. The "wedge" is internal: replacing the source `.docx` document with an interactive PWA that fires reminders.

---

## 5. Budget — time and money

### Time (solo developer)

| Scenario | Calendar weeks | Working hours |
|---|---|---|
| Optimistic (full-time, no blockers) | 3 | ~120h |
| **Realistic (full-time, normal blockers)** | **4–5** | **~160–200h** |
| Pessimistic (full-time, hard problems) | 7 | ~280h |
| Part-time, 10h/week | 10–14 | ~100–140h |

Add **15% buffer** for unknown unknowns. Phase 3 (design) is already complete, knocking ~30h off the realistic baseline.

### Money (ongoing per year)

| Item | Cost |
|---|---|
| Vercel Hobby | **$0** |
| Neon Free tier | **$0** (0.5GB storage, 191.9 compute-hours/month — plenty for one user) |
| Vercel Blob | **~$0.20/month** (one user, ~50 photos × 200KB = 10MB; well under free tier) |
| Custom domain (optional) | $12/yr (only if branded URL desired; otherwise `.vercel.app` is free) |
| Push notification infra | **$0** (Web Push API native; VAPID keys self-managed) |
| **Total ongoing** | **$0–12/yr** |

### One-time / hardware

None. All dev on existing Mac + iPhone.

---

## 6. Out of scope for v0.1 (explicit, not "we'll see")

- **Multi-user / signup flow.** Single seeded account only.
- **Public registration / password reset email.** Owner-only access; password reset is a manual `npm run reset-password` script.
- **Multiple plan templates / "start over with new plan".** Plan structure is fixed at 4 weeks; user edits existing rows.
- **Food database, barcode scan, nutrition lookup.** Meals are user-defined.
- **Wearables / health-app integration.** No HealthKit, no Google Fit.
- **Embedded workout videos.** YouTube URL field exists in Workout Editor (T4.12) but doesn't embed — opens in external app.
- **Social features.** No sharing, no community, no leaderboards.
- **Apple Watch / wearable companion app.** Notifications only.
- **Native iOS / Android app.** PWA only.
- **Offline writes.** Reads cached; writes require connection.
- **Multi-language UI.** Georgian only; i18n folder structure is prepared but only `ka.json` is filled.
- **A/B testing or analytics SDK.** Vercel Analytics is sufficient if needed.
- **Recurring weekly summary email.** Push notifications only.

---

## 7. Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| iOS PWA push doesn't fire reliably (APNS routing) | Medium | High | Test on physical iPhone early (T6.11); fall back to local in-app reminders if APNS lag is unacceptable |
| User forgets to "Add to Home Screen" — push silently fails | High | Medium | Onboarding step 2 is dedicated to this; show a "notifications won't work" banner if `display-mode != standalone` |
| Neon free tier compute hours exhausted (very heavy use) | Low | Low | One user can't exceed free tier; if needed, upgrade is $19/mo |
| Service worker caches stale plan after edits | Medium | Medium | Cache-busting via Drizzle row `updated_at`; revalidate on visibility change |
| Vercel Cron fires while user is on a flight (UTC offset mismatch) | Medium | Low | Store user timezone in `user_settings`; compute send-times in their TZ |
| User edits plan into an inconsistent state (e.g., 0 meals, 0 calories) | Low | Low | Zod validators in editors; "reset to defaults" action |
| Lucia session table grows unbounded | Low | Low | Garbage-collect expired sessions in Vercel Cron weekly job |
| Browser autofills wrong password and locks user out | Low | Medium | "Forgot password" is currently a manual CLI step — document it |

---

## 8. Decisions (locked for personal use)

- **D1** — Single user. No signup flow. Seed via CLI.
- **D2** — Plan is fully editable. User owns their own copy of meals/workouts (seeded from defaults at signup; reset-to-default action available).
- **D3** — Visual identity: **Style C — Soft Pastel Feminine**. Locked tokens in `design-prompts/_TOKENS.md`.
- **D4** — Auth: Lucia + Argon2 + 1-year DB session cookie, refreshed on use.
- **D5** — Image hosting: Vercel Blob.
- **D6** — Week tracking: dual-mode. Default auto from `plan_start_date`; user can override via Profile.
- **D7** — Georgian-only UI in v0.1. i18n structure prepared.
- **D8** — Mobile-only. Desktop and tablet not optimised; show "use on phone" prompt below 768px → above, OR just lock max-width and let it scale up. (Final pick during T1.3.)
- **D9** — Push notifications via VAPID + Vercel Cron + `web-push`. No third-party push service (OneSignal, Firebase) — overkill for one user.
- **D10** — No co-author line in git commits (carries over from owner's preference).

---

## 9. Phases & tasks

Each task: status, complexity (S/M/L/XL — work hours roughly 2/6/16/32+), dependencies, description, acceptance criteria.

**Phase 3 is DONE** — design pack delivered as `week-plan/screens/*-c.jsx`. Tasks listed below for reference only and pre-marked complete.

---

### Phase 1 — Foundation & Setup

**Goal:** Empty Next.js app boots locally and on Vercel, design tokens live, mobile container chrome works, Neon DB reachable.
**Estimate:** 1 week (~30h).

#### T1.1: Initialize repository

- [x] **Status**: DONE
- **Complexity**: S
- **Dependencies**: None
- **Description**:
  - `pnpm create next-app@latest` with TypeScript, Tailwind, App Router, src dir, import alias `@/*`.
  - `.gitignore`: Node + Next + macOS + `.env*.local` + `.vercel/`.
  - Initial commit with conventional-commits style.
- **Acceptance**: `pnpm dev` boots empty Next.js page on `localhost:3000`.

#### T1.2: Tooling — TypeScript strict, ESLint, Prettier, Husky

- [x] **Status**: DONE
- **Complexity**: S
- **Dependencies**: T1.1
- **Description**:
  - TS `strict: true`, `noImplicitAny`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`.
  - ESLint + Prettier + `eslint-plugin-tailwindcss` for class ordering.
  - Husky pre-commit: `lint-staged` runs prettier + eslint on staged files.
- **Acceptance**: `pnpm lint` green; `pnpm typecheck` green.

#### T1.3: Mobile-only viewport + safe-area handling

- [x] **Status**: DONE
- **Complexity**: S
- **Dependencies**: T1.1
- **Description**:
  - `viewport` meta locked to `width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover`.
  - Root `<body>` constrained to `max-w-[480px] mx-auto`.
  - CSS `env(safe-area-inset-top/bottom/left/right)` applied to layout chrome.
  - At `min-width: 768px`, render a centered "📱 ეს აპი მხოლოდ მობილურისთვისაა" placeholder.
- **Acceptance**: Layout fills phone viewport edge-to-edge; desktop browser shows placeholder.

#### T1.4: Design system — tokens, Tailwind config, CSS variables

- [x] **Status**: DONE
- **Complexity**: M
- **Dependencies**: T1.2
- **Description**:
  - Port all tokens from `design-prompts/_TOKENS.md` and `week-plan/screens/style-c.jsx` `STYLE_C_TOKENS`:
    - Tailwind theme: `colors.ink.*`, `colors.brand.*`, `colors.surface.*`, `borderRadius.{sm,md,lg,pill}`, `boxShadow.{sm,md,lg}`.
    - CSS custom properties (`:root`): the gradient definitions (brand button, active highlight, workout card, etc.) since Tailwind handles single values better than multi-stop gradients.
  - `prefers-reduced-motion` overrides for Framer Motion transitions.
- **Acceptance**: `/dev/tokens` page renders the full palette, type scale, radii samples, shadow samples — all matching `style-c.jsx` visually.

#### T1.5: Neon Postgres setup + Drizzle config

- [x] **Status**: DONE
- **Complexity**: S
- **Dependencies**: T1.1
- **Description**:
  - Create Neon project, copy `DATABASE_URL` (pooled) and `DATABASE_URL_UNPOOLED` (direct) to `.env.local`.
  - Install `drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`, `postgres` (for direct connection in scripts).
  - `drizzle.config.ts`: `schema: './src/db/schema/*'`, dialect `postgresql`, `out: './drizzle'`.
  - Add scripts: `db:generate`, `db:migrate`, `db:studio`, `db:seed`.
- **Acceptance**: `pnpm db:studio` opens Drizzle Studio against empty Neon DB.

#### T1.6: TanStack Query + Zustand + Framer Motion providers

- [x] **Status**: DONE
- **Complexity**: S
- **Dependencies**: T1.4
- **Description**:
  - Install: `@tanstack/react-query`, `@tanstack/react-query-devtools`, `zustand`, `motion` (Framer Motion v11+).
  - Root `Providers` component wraps `QueryClientProvider` + a `MotionConfig` with reduced-motion respect.
  - Zustand store skeleton with `useUIStore` for ephemeral state.
- **Acceptance**: `/dev/providers` page shows a Query devtools panel toggle + a Framer Motion spring animation.

#### T1.7: Fonts — DM Sans + Noto Sans Georgian via next/font

- [x] **Status**: DONE
- **Complexity**: S
- **Dependencies**: T1.4
- **Description**:
  - `next/font/google` for DM Sans (weights 400/500/600/700/800) and Noto Sans Georgian (weights 400/500/600/700/800).
  - Combined CSS variable `--font-sans` with Noto Sans Georgian as the first family (so Georgian characters get correct shape), DM Sans as fallback for Latin.
  - Apply at body level via Tailwind theme `fontFamily.sans`.
- **Acceptance**: Sample page renders "გამარჯობა Hello მეი" with correct font for each script.

#### T1.8: Vercel project + env wiring

- [ ] **Status**: IN_PROGRESS
- **Complexity**: S
- **Dependencies**: T1.5
- **Description**:
  - Create Vercel project linked to git repo.
  - Add env vars in Vercel dashboard: `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `AUTH_SECRET` (placeholder), `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `BLOB_READ_WRITE_TOKEN` (placeholder).
  - Configure preview + production environments.
- **Acceptance**: First `git push` triggers a Vercel preview deployment that boots successfully.

#### T1.9: Root layout + mobile container chrome

- [x] **Status**: DONE
- **Complexity**: M
- **Dependencies**: T1.3, T1.4, T1.7
- **Description**:
  - `app/layout.tsx`: `<html lang="ka">`, fonts via `--font-sans`, body with `min-h-screen` lilac→pink gradient bg.
  - Reusable `<MobileShell>` component with safe-area-inset padding + max-width clamp.
  - Decorative ambient blobs (yellow / mint / lilac) as a `<BgBlobs>` component, positionable per screen.
- **Acceptance**: Default route renders empty mobile shell with gradient bg + 3 blobs — matches `style-c.jsx` background visually.

#### T1.10: /dev gallery routes (development-only)

- [x] **Status**: DONE
- **Complexity**: S
- **Dependencies**: T1.4, T1.6
- **Description**:
  - `app/dev/page.tsx` lists subroutes: `/dev/tokens`, `/dev/providers`, `/dev/components` — gated by `NODE_ENV !== 'production'`.
  - Each subroute showcases relevant pieces for visual verification.
- **Acceptance**: `/dev` routes available in dev, return 404 in production builds.

---

#### T1.11: Test infrastructure — Vitest + RTL + Playwright

- [x] **Status**: DONE
- **Complexity**: M
- **Dependencies**: T1.2
- **Description**:
  - Install `vitest`, `@vitejs/plugin-react`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`.
  - `vitest.config.ts` with `jsdom` env, path alias `@/*`, setup file (`tests/setup.ts`) registering `@testing-library/jest-dom`.
  - Install `@playwright/test`; `playwright.config.ts` targeting mobile viewport (Pixel 5 / iPhone 13) with `webServer` running `pnpm dev`.
  - Scripts: `pnpm test` (vitest run), `pnpm test:watch`, `pnpm test:e2e` (playwright).
  - Folder layout: `tests/unit/`, `tests/integration/`, `tests/e2e/`.
  - One sanity test per runner so the setup is verified.
- **Acceptance**: `pnpm test` and `pnpm test:e2e` both run and pass with their sample tests; `tsc --noEmit` stays green.

---

#### T1.12: GitHub Actions CI pipeline

- [ ] **Status**: TODO
- **Complexity**: M
- **Dependencies**: T1.11
- **Description**:
  - `.github/workflows/ci.yml` triggered on `push` to `main` + `pull_request`.
  - Jobs: `typecheck` (`pnpm tsc --noEmit`), `lint` (`pnpm lint`), `unit` (`pnpm test`), `e2e` (`pnpm exec playwright install --with-deps chromium && pnpm test:e2e`).
  - Node 22.x, pnpm via `pnpm/action-setup`, dependency cache.
  - E2E job sets `DATABASE_URL` to a Neon branch (via repo secret) or uses a dedicated test branch; skip if secret missing.
  - Status check required on PRs to `main` via branch protection (manual config note).
- **Acceptance**: CI runs green on a sample PR; all four jobs report status; failures block merge.

---

### Phase 2 — Database Schema & Seed Data

**Goal:** User-owned editable plan. Each user has personal copies of meals/workouts seeded from defaults at signup.
**Estimate:** 4 days (~20h).

#### T2.1: Schema design — entity sketch

- [x] **Status**: DONE
- **Complexity**: M
- **Dependencies**: T1.5
- **Description**:
  - Draft entity-relationship diagram covering:
    - `users` (id, email, password_hash, name, timezone, created_at)
    - `sessions` (Lucia: id, user_id, expires_at)
    - `user_settings` (user_id PK, calorie_target, p_target, n_target, f_target, water_target_l, target_weight_kg, plan_start_date, current_week_override, notif_meals, notif_workouts, notif_water, notif_weight, theme)
    - `meals` (id, user_id, day_type ENUM workout|rest, time, name, summary, calories, p_g, n_g, f_g, sort_order)
    - `meal_ingredients` (id, meal_id, name, amount, sort_order)
    - `meal_swaps` (id, meal_id, name, sort_order)
    - `workouts` (id, user_id, week INT 1-4, weekday INT 0-6, type ENUM pilates|cardio|combo|rest, title, focus, duration_min, intensity ENUM light|medium|strong|heavy, time_start, time_end, video_url, description)
    - `meal_logs` (id, user_id, meal_id, date, completed_at)
    - `workout_logs` (id, user_id, workout_id, date, completed_at)
    - `water_logs` (id, user_id, date PK, glasses_count)
    - `weight_logs` (id, user_id, date PK, kg)
    - `measurement_logs` (id, user_id, date, waist_cm, arm_cm, thigh_cm)
    - `progress_photos` (id, user_id, week, taken_at, blob_url)
    - `push_subscriptions` (id, user_id, endpoint, p256dh, auth, created_at)
  - Document in `src/db/SCHEMA.md`.
- **Acceptance**: ER diagram (text or Mermaid) reviewed; matches sample data in `week-plan/screens/shared.jsx`.

#### T2.2: Drizzle schema files

- [ ] **Status**: TODO
- **Complexity**: M
- **Dependencies**: T2.1
- **Description**:
  - Split schema into files under `src/db/schema/`: `users.ts`, `settings.ts`, `meals.ts`, `workouts.ts`, `logs.ts`, `progress.ts`, `push.ts`, `sessions.ts`.
  - Each table exports its Drizzle schema + zod-derived insert/select types via `drizzle-zod`.
  - Define relations explicitly via `relations(...)`.
- **Acceptance**: `pnpm db:generate` produces migration SQL with no errors.

#### T2.3: Initial migration to Neon

- [x] **Status**: DONE
- **Complexity**: S
- **Dependencies**: T2.2
- **Description**:
  - Run `pnpm db:migrate` against Neon.
  - Verify in Drizzle Studio: all tables present, all FKs correctly link.
- **Acceptance**: `pnpm db:studio` shows the full schema.

#### T2.4: Default meals seed

- [x] **Status**: DONE
- **Complexity**: M
- **Dependencies**: T2.3
- **Description**:
  - `src/db/seed/default-meals.ts` — array of meals from the source document (`Downloads/კვების_ვარჯიშის გეგმა.docx`).
  - 5 meals × 2 day-types (workout / rest) = 10 meal templates.
  - Each meal includes ingredients, calories, macros, and 2-4 swap suggestions.
  - **Default meals are stored in a separate `default_meals` set of tables** (NOT in `meals`), so that seeding a new user clones into their owned `meals` rows.
- **Acceptance**: `default_meals` populated; querying returns 10 meals with all ingredients + swaps.

#### T2.5: Default workouts seed

- [ ] **Status**: TODO
- **Complexity**: M
- **Dependencies**: T2.3
- **Description**:
  - `src/db/seed/default-workouts.ts` — 4 weeks × 7 days = 28 workout templates.
  - Progression matches the source document (Week 1 light → Week 4 heavy; Mon/Wed Pilates, Tue/Sat Cardio, Fri Combo, Thu/Sun Rest).
  - Stored in `default_workouts`.
- **Acceptance**: 28 default workouts seeded; sample query confirms Week 2 Wednesday → Pilates 45min medium.

#### T2.6: seedUserPlan() helper

- [x] **Status**: DONE
- **Complexity**: M
- **Dependencies**: T2.4, T2.5
- **Description**:
  - `src/db/helpers/seedUserPlan.ts` — given a `userId`, copies default meals + workouts into the user's owned rows (with their `user_id` set).
  - Also creates default `user_settings` row with the document's target values.
  - Wraps in a transaction.
- **Acceptance**: Unit test: call with fresh user → user has 10 meals, 28 workouts, 1 settings row, matching defaults.

#### T2.7: resetUserPlan() helper

- [x] **Status**: DONE
- **Complexity**: S
- **Dependencies**: T2.6
- **Description**:
  - `src/db/helpers/resetUserPlan.ts` — restores user's meal/workout templates (and their ingredients/swaps) to the current defaults.
  - Updates meals in place (matched on `dayType + sortOrder`) and workouts via `INSERT … ON CONFLICT (user_id, week, weekday) DO UPDATE`, so existing IDs are preserved — `meal_logs`, `workout_logs`, `water_logs`, `weight_logs`, `measurement_logs`, and `user_settings` are all retained.
  - meal_ingredients / meal_swaps (no logs reference them) are wiped and re-inserted from defaults.
- **Acceptance**: User edits a meal, runs reset, meal returns to default.

#### T2.8: Typed query helpers

- [ ] **Status**: TODO
- **Complexity**: M
- **Dependencies**: T2.2
- **Description**:
  - `src/db/queries.ts` exports:
    - `getTodayPlan(userId, date)` → meals + workout for that date + day type
    - `getWeekProgression(userId, week)` → 7 workouts ordered Mon-Sun
    - `logMealComplete(userId, mealId, date)` / `unlogMealComplete(...)`
    - `logWorkoutComplete(userId, workoutId, date)`
    - `logWater(userId, date, glasses)`
    - `logWeight(userId, date, kg)`
    - `getWeightHistory(userId, range)` → ordered weight points
    - `getAdherenceStats(userId, fromDate, toDate)` → % meals + % workouts completed
- **Acceptance**: Unit tests on each helper hit Neon and return shaped data.

#### T2.9: Seed CLI script for owner account

- [x] **Status**: DONE
- **Complexity**: S
- **Dependencies**: T2.6
- **Description**:
  - `scripts/seed-owner.ts` — interactive prompt (or env-based: `OWNER_EMAIL`, `OWNER_PASSWORD`) to create the single user, hash password with Argon2, run `seedUserPlan`.
  - Idempotent: refuses to run if a user already exists, unless `--force`.
- **Acceptance**: `pnpm seed:owner` creates `mei@fitplan.ge` with hashed password + full plan.

---

#### T2.10: Query helper integration tests

- [ ] **Status**: TODO
- **Complexity**: M
- **Dependencies**: T2.8, T1.11
- **Description**:
  - Integration tests for typed query helpers from T2.8 against a real Neon test branch (`DATABASE_URL_TEST`).
  - Test lifecycle: `beforeAll` runs migrations on a fresh schema, `beforeEach` truncates user-scoped tables, `afterAll` tears down.
  - Cover the critical helpers: `getTodayMeals`, `markMealComplete`, `logWater`, `logWeight`, `getPlanForWeek`, `getAdherenceStats`.
  - Assert ownership scoping — every helper must filter by `user_id`; cross-user reads/writes must reject.
  - Run as `pnpm test:db` (vitest project, separate from unit) so unit run stays fast and DB-less.
- **Acceptance**: All helpers covered; cross-user leak test fails when scoping is removed (regression guard verified).

---

#### T2.11: Seed/reset helper tests

- [ ] **Status**: TODO
- **Complexity**: S
- **Dependencies**: T2.6, T2.7, T2.10
- **Description**:
  - Integration tests for `seedUserPlan()` and `resetUserPlan()` against the test DB.
  - Cases: fresh seed inserts the expected count of meals/workouts/targets; idempotency (second call doesn't duplicate); reset wipes user-owned rows but leaves the user row and re-seeds defaults; user-scoped — seeding user A does not touch user B's data.
- **Acceptance**: All four cases pass; row counts match the default sets from T2.4 + T2.5.

---

### Phase 3 — UI Design in Claude Design (Prompts Pack)

**Status:** ✅ **DONE.** Design pack delivered on 2026-05-12.

**Deliverables (all in repo):**
- `design-prompts/00-design-system.md` through `07-rules.md` — 8 design prompts
- `design-prompts/_TOKENS.md` — locked token table
- `week-plan/screens/*-c.jsx` — 8 reference screens (Today, Plan, Meals, Progress, Profile, Auth, Editors, Rules)

No further work in this phase. Phase 4 implements directly against these files.

---

### Phase 4 — Core Screens Implementation

**Goal:** Today, Plan, Meals, and the editors are usable on a real iPhone — fetch from Neon, mutate via server actions, mark items complete.
**Estimate:** 2 weeks (~70h).

#### T4.1: Bottom navigation shell

- [ ] **Status**: TODO
- **Complexity**: M
- **Dependencies**: T1.9
- **Description**:
  - Persistent bottom nav as a Next.js layout (route group `(app)/layout.tsx`).
  - 5 tabs: Today, Plan, Meals, Progress, Profile.
  - Floating frosted-glass pill style from `week-plan/screens/style-c.jsx`.
  - Active tab: yellow→pink gradient pill behind icon + 700-weight label.
  - SVG icons ported from `shared.jsx` `TabIcon`.
- **Acceptance**: Navigation between all 5 tabs works; active state matches design pixel-for-pixel.

#### T4.2: Today screen — server data fetch + render

- [ ] **Status**: TODO
- **Complexity**: L
- **Dependencies**: T2.8, T4.1
- **Description**:
  - `app/(app)/page.tsx` is a RSC that calls `getTodayPlan(userId, today)`.
  - Renders the JSX from `week-plan/screens/style-c.jsx` translated into Next.js components.
  - Greeting reads user's name + current week from `user_settings`.
  - "ვარჯიშის დღე / დასვენების დღე" auto-determined from today's workout type.
- **Acceptance**: Live data flows; visual diff vs prototype ≤ 2 minor pixel differences.

#### T4.3: Meal completion interaction

- [ ] **Status**: TODO
- **Complexity**: M
- **Dependencies**: T4.2
- **Description**:
  - Tap on a meal card → optimistic update via TanStack Query mutation → server action calls `logMealComplete`.
  - Visual state shifts: emoji card adds mint check overlay, name strike-through, opacity 0.7.
  - Tap again to un-complete.
  - Confetti animation on first completion of the day (Framer Motion).
- **Acceptance**: Tap → row immediately updates; refresh keeps state; un-tap reverts cleanly.

#### T4.4: Today's workout card

- [ ] **Status**: TODO
- **Complexity**: M
- **Dependencies**: T4.2
- **Description**:
  - Reads today's workout (or rest-day card if rest).
  - Lilac→pink gradient card from prototype.
  - "დასრულდა" CTA → `logWorkoutComplete`; flips to mint check + "შესრულდა ✓" pill state.
- **Acceptance**: Workout card renders for both workout and rest days; completion persists.

#### T4.5: Water tracker

- [ ] **Status**: TODO
- **Complexity**: M
- **Dependencies**: T4.2
- **Description**:
  - 8-glass row component.
  - Tap a glass → set water log to that glass count (NOT increment; allows decreasing by tapping a filled glass earlier in the row).
  - Persists via `logWater`; optimistic update.
  - Glass fill uses gradient `linear-gradient(180deg, #BCE3FF → #7CC7FF)`.
- **Acceptance**: Tapping glass 5 sets count to 5; tapping glass 3 lowers to 3; persists.

#### T4.6: Daily calorie ring

- [ ] **Status**: TODO
- **Complexity**: M
- **Dependencies**: T4.2
- **Description**:
  - Port `CalRing` SVG from `shared.jsx`.
  - Calculates eaten kcal as sum of `meal_logs` where date = today.
  - Animates from 0 to current pct on mount via Framer Motion `motion.circle`.
  - P/N/F mini-bars below ring with completed values vs target.
- **Acceptance**: Ring fills correctly; macros sum from completed meals only.

#### T4.7: Plan screen

- [ ] **Status**: TODO
- **Complexity**: L
- **Dependencies**: T2.8, T4.1
- **Description**:
  - `app/(app)/plan/page.tsx` RSC fetches all 4 weeks × 7 days of workouts.
  - Week tabs (1-4) — active state derived from `current_week_override ?? autoWeekFromStart`.
  - Switching tabs is client-side instant (no refetch — data already in RSC).
  - 7-day list with all 5 visual states (done, active, rest, peak, pending) from `plan-c.jsx`.
- **Acceptance**: Switching weeks updates the list instantly; states render correctly per day.

#### T4.8: Manual week-jump control

- [ ] **Status**: TODO
- **Complexity**: S
- **Dependencies**: T4.7
- **Description**:
  - Tapping week tab WHEN auto-mode is enabled prompts: "გადახვიდე ხელით რეჟიმზე?"
  - On confirm, sets `current_week_override`.
  - Profile screen has the canonical control + "ავტო ↔ ხელით" toggle.
- **Acceptance**: Override persists across sessions; toggling back to auto clears the override.

#### T4.9: Meals screen — day-type toggle + 5 cards

- [ ] **Status**: TODO
- **Complexity**: L
- **Dependencies**: T2.8, T4.1
- **Description**:
  - `app/(app)/meals/page.tsx` RSC fetches all meals for selected day type.
  - Day-type segmented control (workout / rest) — toggled via URL query `?day=workout|rest`.
  - 5 meal cards in collapsed state; tap → expand inline (Framer Motion `LayoutGroup` for shared layout animation).
  - Expanded card matches Card 3 pattern from `meals-c.jsx`.
- **Acceptance**: Expanding a card animates smoothly; only one card expands at a time.

#### T4.10: Workout-day-vs-rest-day auto-detection logic

- [ ] **Status**: TODO
- **Complexity**: S
- **Dependencies**: T2.8
- **Description**:
  - Pure function `getDayTypeForUser(userId, date)`: returns `'workout' | 'rest'` based on the user's actual `workouts` table assignments for that weekday.
  - Used by Today, Plan, and notification scheduling.
- **Acceptance**: If user moves the Friday combo workout to Saturday, the day-type swaps accordingly.

#### T4.11: Meal Editor bottom sheet

- [ ] **Status**: TODO
- **Complexity**: XL
- **Dependencies**: T4.9
- **Description**:
  - Modal/sheet from `editors-c.jsx` artboard 1.
  - Uses Vaul library for bottom-sheet UX (better than custom on iOS Safari).
  - Form fields: time, name, day type, ingredients (drag-reorder via `dnd-kit`, add/remove rows), calories, macros, swaps, notes.
  - react-hook-form + zod validation.
  - Server action `updateMeal` persists changes.
  - Sticky footer with "გაუქმება / შენახვა ✓".
- **Acceptance**: Editing a meal field saves; reordering ingredients persists; closing without saving discards.

#### T4.12: Workout Editor bottom sheet

- [ ] **Status**: TODO
- **Complexity**: L
- **Dependencies**: T4.7
- **Description**:
  - Modal/sheet from `editors-c.jsx` artboard 2.
  - Fields: type, focus, weekday picker (7 squares), duration stepper, time window, intensity 4-segment picker, description, YouTube URL, reminder toggle.
  - Server action `updateWorkout`.
- **Acceptance**: Editing workout intensity from `medium` to `heavy` updates the Plan screen pill instantly.

#### T4.13: Reorder meals (edit mode)

- [ ] **Status**: TODO
- **Complexity**: M
- **Dependencies**: T4.9, T4.11
- **Description**:
  - Meals screen has an "edit mode" toggle (top right pencil pill).
  - In edit mode, each meal row shows a drag handle (⋮⋮) at left; drag updates `sort_order`.
  - Uses `dnd-kit/sortable`.
- **Acceptance**: Reordered meals persist + Today screen reflects new order.

---

#### T4.14: Editor form validation tests

- [ ] **Status**: TODO
- **Complexity**: M
- **Dependencies**: T4.11, T4.12, T1.11
- **Description**:
  - Unit tests for the zod schemas that back Meal Editor and Workout Editor forms.
  - Cases: required fields, macro number bounds (kcal/protein/carbs/fat ≥ 0), ingredient list non-empty, workout intensity enum, weekday picker enum, YouTube URL shape.
  - RTL component test for each editor: open sheet → submit empty → expect error messages; fill valid → submit → expect `onSubmit` called with parsed payload.
- **Acceptance**: All invalid combinations reject with the exact Georgian error copy; valid forms produce the typed payload.

---

#### T4.15: Critical UI unit tests

- [ ] **Status**: TODO
- **Complexity**: M
- **Dependencies**: T4.3, T4.5, T4.6, T1.11
- **Description**:
  - RTL tests for the load-bearing presentational components:
    - `CalRing` — given P/N/F + goal props, asserts the ring stroke-dasharray and the three mini-bars render with the expected percentages.
    - Water tracker — 8 glass row, tapping a glass increments + dispatches mutation; tapping a filled glass decrements; aria-label reflects current count.
    - Meal card — active vs. done visual states based on `completed` prop; tap on active card triggers completion handler (T4.3).
  - Stub TanStack Query mutations with a typed mock client.
- **Acceptance**: Component states and interactions covered; tests don't depend on Tailwind class names beyond what the user observes (role/text/aria).

---

### Phase 5 — Tracking & Progress

**Goal:** Progress dashboard with weight, measurements, photos, stats; Rules and Profile screens; Settings editing.
**Estimate:** 1.5 weeks (~45h).

#### T5.1: Progress screen — tab shell

- [ ] **Status**: TODO
- **Complexity**: M
- **Dependencies**: T4.1
- **Description**:
  - `app/(app)/progress/page.tsx` with 4 tabs: Weight, Measurements, Photos, Stats.
  - Segmented control matches `progress-c.jsx` styling.
  - Tab routing via `?tab=weight|measurements|photos|stats`.
- **Acceptance**: All 4 tabs render placeholder content with correct active state.

#### T5.2: Weight logging modal

- [ ] **Status**: TODO
- **Complexity**: M
- **Dependencies**: T2.8
- **Description**:
  - Floating "+ წონის ჩაწერა" button at bottom of Weight tab.
  - Tap → bottom sheet with date picker (default today) + kg number input + "შენახვა".
  - Server action `logWeight` (upsert by date).
- **Acceptance**: Logging today's weight updates Recent Entries instantly.

#### T5.3: Weight chart (Recharts)

- [ ] **Status**: TODO
- **Complexity**: L
- **Dependencies**: T5.2
- **Description**:
  - Recharts `LineChart` with custom gradient stroke + area fill matching `progress-c.jsx` chart.
  - X-axis: weekday labels for week view; date labels for month/all.
  - Y-axis: implicit, dashed guide lines.
  - Tooltip on last point shows "X.X კგ · დღე" floating card.
  - Range toggle (კვირა / თვე / ყველა) — top-right pill.
- **Acceptance**: Adding new weight logs visibly extends the line; trend direction (mint for down) reads correctly.

#### T5.4: Measurement logging form

- [ ] **Status**: TODO
- **Complexity**: M
- **Dependencies**: T5.1
- **Description**:
  - Measurements tab has a "+ გაზომვა" button.
  - Form: waist (cm), arm (cm), thigh (cm), date picker.
  - Visual mirrors Profile settings card pattern.
  - Server action `logMeasurement`.
- **Acceptance**: New measurements saved; list refreshes.

#### T5.5: Measurement history view

- [ ] **Status**: TODO
- **Complexity**: M
- **Dependencies**: T5.4
- **Description**:
  - Rows like Weight's "ბოლო ჩანაწერები" — date block left, values middle, delta pill right.
  - Delta calculated against the previous entry.
- **Acceptance**: Adding a measurement shows row with correct delta.

#### T5.6: Progress photos — upload + grid

- [ ] **Status**: TODO
- **Complexity**: L
- **Dependencies**: T5.1
- **Description**:
  - Photos tab — 3-column square grid (CSS grid).
  - FAB "+ ფოტო" opens iOS-native file picker (camera or library).
  - Upload to Vercel Blob via server action; insert row in `progress_photos`.
  - Tap photo → full-screen viewer with week + date overlay.
- **Acceptance**: Photo uploads complete; grid updates; full-screen view works.

#### T5.7: Adherence stats — Stats tab

- [ ] **Status**: TODO
- **Complexity**: M
- **Dependencies**: T2.8
- **Description**:
  - Stats tab content: 4 big stat cards (meals %, workouts %, water consistency %, current streak).
  - Achievement banner from `progress-c.jsx` ("შენ ხარ ცეცხლი! −X კგ მიღწეული").
  - Uses `getAdherenceStats` over last 30 days.
- **Acceptance**: Stats match what daily logs report; achievement copy adapts to weight delta.

#### T5.8: Rules screen

- [ ] **Status**: TODO
- **Complexity**: M
- **Dependencies**: T1.9
- **Description**:
  - Standalone route `app/(app)/rules/page.tsx` (linked from Profile).
  - Static content matching `rules-c.jsx` — 8 thematic sections.
  - Content lives in `src/content/rules.ts` so it's easy to edit.
- **Acceptance**: All 24 rules render; sections styled per prototype.

#### T5.9: Profile screen + settings editors

- [ ] **Status**: TODO
- **Complexity**: XL
- **Dependencies**: T2.8, T4.1
- **Description**:
  - `app/(app)/profile/page.tsx` — identity card + 6 settings sections per `profile-c.jsx`.
  - Each section's edit interactions:
    - Daily targets → tap row → bottom sheet with number input
    - Goal → tap → bottom sheet (target weight + timeline picker)
    - Plan timing → date picker + week-override segmented control + auto-toggle
    - Notifications → 4 switches with optimistic updates
    - Appearance → 3-button theme picker (ღია / მუქი / ავტო)
    - Danger zone → 3 row actions: reset plan (confirm modal), export CSV (download), logout
  - All persist to `user_settings`.
- **Acceptance**: Every setting saves and reloads correctly; logout clears session.

---

#### T5.10: Progress logic tests

- [ ] **Status**: TODO
- **Complexity**: M
- **Dependencies**: T5.3, T5.7, T1.11
- **Description**:
  - Pure-function unit tests for progress data shaping:
    - Weight chart data builder — sparse log entries → continuous date series, gap-filling rule (latest-known carry-forward vs. null), tooltip label formatter (Georgian dates).
    - Adherence stats from T5.7 — given meal_logs + water_logs + workout_logs over a window, computes meal adherence %, water target hit count, workout completion %.
  - Edge cases: empty history, single entry, log spanning week boundaries, future-dated entries ignored.
- **Acceptance**: All calculator functions covered with fixtures; output matches hand-computed expected values.

---

### Phase 6 — PWA & Push Notifications

**Goal:** Installable PWA, push subscription flow, scheduled meal/workout reminders via Vercel Cron.
**Estimate:** 1 week (~30h).

#### T6.1: PWA assets (icons + splash)

- [ ] **Status**: TODO
- **Complexity**: M
- **Dependencies**: T1.4
- **Description**:
  - App icon: 1024×1024 master, generate `pwa-icon-{192,256,384,512}.png` + `apple-touch-icon-{120,152,167,180}.png`.
  - Maskable icon variant (with safe-zone padding).
  - iOS splash screens for common device sizes (`apple-touch-startup-image`).
  - Use a tool like `pwa-asset-generator` to bulk-generate from a master SVG.
- **Acceptance**: Icons visible in iOS A2HS preview; splash shows on cold launch.

#### T6.2: manifest.json

- [ ] **Status**: TODO
- **Complexity**: S
- **Dependencies**: T6.1
- **Description**:
  - `public/manifest.json` with name "Fit Plan", short_name "Fit Plan", theme color `#FF9EC5`, background color `#F4E5FA`, `display: standalone`, `orientation: portrait`, full icon list.
  - Linked from `app/layout.tsx` head.
- **Acceptance**: Chrome DevTools → Application → Manifest shows no errors.

#### T6.3: Service worker (Serwist)

- [ ] **Status**: TODO
- **Complexity**: L
- **Dependencies**: T6.2
- **Description**:
  - Install Serwist (`@serwist/next`).
  - Cache strategy: static assets (precache), images (CacheFirst), navigation requests (NetworkFirst with offline fallback).
  - Offline fallback page: `/offline` shows last-known Today data + "ხელახლა ცდა" button.
  - Service worker registration in `app/layout.tsx`.
- **Acceptance**: Airplane mode on installed PWA still loads cached Today screen.

#### T6.4: VAPID keys

- [ ] **Status**: TODO
- **Complexity**: S
- **Dependencies**: T1.8
- **Description**:
  - Generate keypair with `npx web-push generate-vapid-keys`.
  - Store private in Vercel env, public in `NEXT_PUBLIC_VAPID_PUBLIC_KEY`.
- **Acceptance**: Both env vars accessible in their respective contexts.

#### T6.5: Push subscription flow

- [ ] **Status**: TODO
- **Complexity**: L
- **Dependencies**: T6.4, T6.3
- **Description**:
  - Client: `subscribeToPush()` requests `Notification.permission`, calls `registration.pushManager.subscribe({ applicationServerKey })`, sends subscription to `POST /api/push/subscribe`.
  - Server: stores `{ endpoint, p256dh, auth }` in `push_subscriptions` for current user.
  - "Notifications enabled" toast confirmation.
- **Acceptance**: After accepting permission, a `push_subscriptions` row exists; test push delivers a notification.

#### T6.6: Server-side push sender utility

- [ ] **Status**: TODO
- **Complexity**: M
- **Dependencies**: T6.4
- **Description**:
  - `src/lib/push.ts` exports `sendPushToUser(userId, payload)`.
  - Uses `web-push` library with VAPID auth.
  - Handles 410 Gone → delete subscription.
  - Payload shape: `{ title, body, icon, badge, url, tag }`.
- **Acceptance**: Calling `sendPushToUser(ownerId, ...)` delivers a notification within 30s.

#### T6.7: Vercel Cron — scheduled reminders

- [ ] **Status**: TODO
- **Complexity**: L
- **Dependencies**: T6.6, T2.8
- **Description**:
  - `app/api/cron/reminders/route.ts` — fires every 5 min.
  - Reads all users' upcoming meals + workouts in next 5 min window (timezone-aware).
  - Sends push for each due item.
  - `vercel.json` with cron schedule `*/5 * * * *`.
  - Idempotent: tracks last-sent in `notification_log` (small table) to prevent duplicate firings.
- **Acceptance**: A meal at 10:00 fires a notification at ~10:00 ± 5 min.

#### T6.8: Localised notification content

- [ ] **Status**: TODO
- **Complexity**: M
- **Dependencies**: T6.7
- **Description**:
  - Notification copy in Georgian, contextual to meal/workout:
    - Meal: "🍳 საუზმის დროა — კვერცხის ომლეტი + ბოსტნეული (280 კკალ)"
    - Workout: "💪 18:30-ზე — პილატესი 45 წთ"
    - Water (if enabled): "💧 წყლის დროა! 5/8 ჭიქა."
    - Weight (if enabled, 8:00): "⚖️ დილის წონის ჩაწერა"
  - Tapping notification deep-links to relevant screen (`?tab=` for Progress, `/` for meal).
- **Acceptance**: Tapping a meal notification opens Today screen with that meal in focus.

#### T6.9: Onboarding — iOS Add-to-Home + permission

- [ ] **Status**: TODO
- **Complexity**: L
- **Dependencies**: T6.5
- **Description**:
  - 4-step onboarding from `auth-c.jsx` artboards 2-5.
  - Step 2: shown only if `display-mode !== 'standalone'` AND user agent is iOS.
  - Step 3: requests notification permission; on grant, calls T6.5 subscribe.
  - Step 4: confetti + "მზად ხარ ✨".
  - Skippable; can re-run from Profile.
- **Acceptance**: First-time iPhone user sees A2HS instructions; Android sees them too but generic (browser handles install prompt).

#### T6.10: Notification settings (Profile section)

- [ ] **Status**: TODO
- **Complexity**: M
- **Dependencies**: T6.7, T5.9
- **Description**:
  - 4 toggles in Profile → Section 4: meals, workouts, water, weight.
  - Each updates `user_settings.notif_*`.
  - Cron job checks these flags before sending.
- **Acceptance**: Toggling water OFF stops water push notifications.

#### T6.11: Physical device push test

- [ ] **Status**: TODO
- **Complexity**: M
- **Dependencies**: T6.9
- **Description**:
  - Install PWA on owner's iPhone, complete onboarding, set up reminders.
  - Verify: notifications deliver on schedule, tapping deep-links correctly, app opens in standalone mode.
  - Repeat on an Android device (Chrome) if available.
- **Acceptance**: Both meal and workout reminders arrive on physical iPhone within target latency.

---

#### T6.12: Push + cron logic tests

- [ ] **Status**: TODO
- **Complexity**: M
- **Dependencies**: T6.6, T6.7, T6.8, T1.11
- **Description**:
  - Unit tests for the server-side push sender (T6.6): builds the correct VAPID payload, respects `ttl`, handles 410 Gone (drops dead subscription), retries 5xx with backoff.
  - Tests for the Vercel Cron handler (T6.7): given a fixed `now` + a user's settings, returns the exact list of subscriptions due in the current 5-min window; respects per-meal toggles; skips muted users.
  - Tests for localised content (T6.8): the title/body builder returns the expected `ka` strings for each notification kind (meal, workout, water).
  - Mock `web-push` library at the module boundary; do not actually network.
- **Acceptance**: All three layers covered; mocked web-push receives the expected payloads byte-for-byte.

---

### Phase 7 — Auth, Polish & Deploy

**Goal:** Real auth, accessibility pass, perf budget, production deploy on Vercel.
**Estimate:** 1 week (~30h).

#### T7.1: Lucia auth setup

- [ ] **Status**: TODO
- **Complexity**: L
- **Dependencies**: T2.3
- **Description**:
  - Install `lucia`, `@lucia-auth/adapter-drizzle`, `@node-rs/argon2`.
  - Configure adapter pointing at `users` + `sessions` tables.
  - Session cookie: `expires: 365 days`, `httpOnly`, `secure`, `sameSite: lax`.
  - "Refresh on use": every authenticated request extends expiry to now + 365 days if older than 30 days.
- **Acceptance**: Logged-in cookie persists across browser restart.

#### T7.2: Login page + middleware

- [ ] **Status**: TODO
- **Complexity**: M
- **Dependencies**: T7.1
- **Description**:
  - `app/login/page.tsx` matches `auth-c.jsx` artboard 1.
  - Server action: validate credentials with Argon2, create session, set cookie.
  - "დამიმახსოვრე" checkbox: if unchecked, session cookie is 7 days only (session-cookie-like).
  - Middleware on `(app)/*` routes: if no valid session → redirect `/login`.
- **Acceptance**: Wrong password shows error; correct password lands on Today.

#### T7.3: Logout

- [ ] **Status**: TODO
- **Complexity**: S
- **Dependencies**: T7.1
- **Description**:
  - Profile → Danger zone → "გასვლა" → server action invalidates session + clears cookie + redirects to `/login`.
- **Acceptance**: Clicking logout immediately requires re-login.

#### T7.4: Lighthouse PWA audit

- [ ] **Status**: TODO
- **Complexity**: M
- **Dependencies**: T6.3
- **Description**:
  - Run Lighthouse mobile audit on Vercel preview URL.
  - Aim for ≥90 across Performance, Accessibility, Best Practices, SEO, PWA.
  - Address findings: image sizing, color contrast, font-display strategy, etc.
- **Acceptance**: Lighthouse JSON in PR shows all categories ≥ 90.

#### T7.5: Accessibility pass

- [ ] **Status**: TODO
- **Complexity**: M
- **Dependencies**: T7.4
- **Description**:
  - Run `axe-core` against each route.
  - Manual VoiceOver pass on iOS.
  - Fix: missing ARIA labels on icon buttons, focus order in bottom sheets, contrast ratios on muted text.
- **Acceptance**: 0 critical axe issues; VoiceOver reads each screen meaningfully.

#### T7.6: Loading states + skeleton screens

- [ ] **Status**: TODO
- **Complexity**: M
- **Dependencies**: T4.2, T5.1
- **Description**:
  - Skeleton components for: Today (meal cards), Plan (7-day list), Meals (5 cards), Progress (chart placeholder).
  - Use `<Suspense fallback={<Skeleton />}>` for RSC streaming.
- **Acceptance**: Slow 3G simulation shows skeletons, not empty white space.

#### T7.7: Empty states

- [ ] **Status**: TODO
- **Complexity**: S
- **Dependencies**: T5.3
- **Description**:
  - "No weight logs yet" empty state on Progress > Weight.
  - "No photos yet — დაამატე ✨" on Photos tab.
  - "Plan not started — დააწექი დაწყებას" on Today if `plan_start_date` is null.
- **Acceptance**: Each empty state shows friendly Georgian copy + a CTA.

#### T7.8: Error boundaries + toasts

- [ ] **Status**: TODO
- **Complexity**: M
- **Dependencies**: T1.4
- **Description**:
  - Root `error.tsx` + per-route `error.tsx` files with retry CTA.
  - Toast component (Sonner) for transient failures: "კავშირი ვერ მოხერხდა — სცადე ისევ".
- **Acceptance**: Throwing an error in a server action shows the toast, not a blank screen.

#### T7.9: Bundle size audit

- [ ] **Status**: TODO
- **Complexity**: M
- **Dependencies**: T7.4
- **Description**:
  - `@next/bundle-analyzer` to inspect chunks.
  - Lazy-load Editors, Rules, Onboarding via `dynamic(() => import(...), { ssr: false })`.
  - Tree-shake Recharts (import specific components, not the index).
- **Acceptance**: Initial route bundle (gzipped) < 200 KB.

#### T7.10: Production deploy

- [ ] **Status**: TODO
- **Complexity**: M
- **Dependencies**: T7.4, T7.9
- **Description**:
  - Promote latest preview to production via `vercel --prod`.
  - Configure custom domain if owner wants one (optional).
  - Verify cron jobs run on prod schedule.
- **Acceptance**: Owner can install PWA from production URL and complete an onboarding cycle.

#### T7.11: Manual end-to-end smoke test on physical iPhone

- [ ] **Status**: TODO
- **Complexity**: M
- **Dependencies**: T7.10
- **Description**:
  - Walk through: install → login → onboarding → enable notifications → log a meal → log water → log weight → switch weeks → edit a meal → reset to default.
  - Verify push delivery for the next due meal.
  - Document any blocker as a P0 follow-up.
- **Acceptance**: All steps pass without crashes; notifications work.

---

#### T7.12: Auth tests — login, session, logout

- [ ] **Status**: TODO
- **Complexity**: M
- **Dependencies**: T7.1, T7.2, T7.3, T2.10
- **Description**:
  - Integration tests against the test DB covering the Lucia flow:
    - Password verify — correct password issues a session cookie; wrong password returns generic error (no enumeration).
    - Session lookup — valid cookie resolves to the user; expired cookie returns null.
    - Session refresh-on-use — older-than-30-days cookie extends expiry to now + 365 days; freshly issued cookie does not touch the DB.
    - Logout — invalidates the session row + clears the cookie; subsequent requests with the old cookie return null.
  - Argon2 verify is real (not mocked) to catch hashing config regressions.
- **Acceptance**: All four behaviours covered; cookie + DB row state matches expectations after each path.

---

#### T7.13: E2E golden paths (Playwright)

- [ ] **Status**: TODO
- **Complexity**: L
- **Dependencies**: T7.10, T1.11, T7.12
- **Description**:
  - Three Playwright specs on mobile viewport against the deployed preview (or local `pnpm build && pnpm start`):
    1. **Login → Today → meal complete** — login form submits, redirect to Today, tap a meal card, see "done" visual, reload, state persists.
    2. **Weight log** — Progress → Weight tab → open modal → enter value → submit → see new entry in list + chart updates.
    3. **Plan week jump** — Plan screen → tap Week 3 → list reflects week-3 workouts; refresh keeps selection if persisted.
  - Each spec seeds via a test-only API route (or `seed:owner` invoked from `globalSetup`) so the DB is in a known state.
  - Trace + screenshot on failure; artifacts uploaded by the CI E2E job (T1.12).
- **Acceptance**: All three specs green on CI against the preview deployment; failures produce a trace viewable locally.

---

## 10. Stretch / Phase 8 — Post-v0.1.0

- Meal templates marketplace (browse + apply other plans)
- Apple HealthKit / Google Fit integration
- Embedded YouTube workouts player
- Recurring weekly summary push notification ("ამ კვირაში 4 ვარჯიში, -1.2კგ — ვაშა!")
- Multi-user support + signup
- Recipe instructions per ingredient
- Macro auto-rebalancing if user changes calorie target
- CSV import/export of all logs
- Web-based admin panel for plan-template editing
- Tablet-optimised layout
- English UI

---

## 11. Definition of Done — v0.1 (personal-use)

- ✅ Owner can install the PWA from production Vercel URL on her iPhone.
- ✅ Login with email + password keeps her signed in for at least a year.
- ✅ Today screen renders current day's meals + workout + water + calorie ring from live Neon data.
- ✅ Plan screen shows all 4 weeks; she can override the current week from Profile.
- ✅ Meals screen lets her view and edit any meal (ingredients, calories, swaps).
- ✅ Workout Editor lets her change type, intensity, duration, weekday assignment.
- ✅ Progress screen tracks weight (with chart), measurements, photos, and adherence stats.
- ✅ Profile screen exposes all targets, goal, plan timing, notification toggles, theme, and danger-zone actions.
- ✅ Reset-to-defaults rebuilds the plan from the source document seed.
- ✅ Push notifications for each meal and workout fire on schedule (verified on physical iPhone).
- ✅ All UI is in Georgian, fonts render correctly.
- ✅ Lighthouse mobile audit: PWA ≥ 90, Performance ≥ 85, Accessibility ≥ 90.
- ✅ Service worker provides offline access to the last-known Today data.
- ✅ Drizzle migrations are clean; `pnpm seed:owner` recreates the full plan from a fresh DB.
