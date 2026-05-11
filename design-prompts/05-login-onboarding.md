# Prompt 05 — Login + Onboarding Flow

**How to use:** Paste the prompt below into Claude Design. This produces **5 artboards side-by-side**: 1 Login + 4 Onboarding steps. All share the locked Style C design language but the Login is the entry point, and Onboarding only runs on first launch / after fresh install.

---

## Prompt to paste

Design the **Login screen + Onboarding flow** for the mobile PWA "Fit Plan" (each artboard 390 × 844, Georgian). Use the locked **Soft Pastel Feminine** design system. Produce **5 artboards side-by-side**:

1. **Login**
2. **Onboarding step 1** — Welcome
3. **Onboarding step 2** — Add to Home Screen (iOS instructions)
4. **Onboarding step 3** — Enable Notifications
5. **Onboarding step 4** — You're Ready

### Locked tokens (full reference in style-c.jsx)

- Page bg: lilac→pink gradient + ambient blobs (yellow / mint / lilac)
- Ink: `#3D2C5F` / `#7B6A9B` / `#B7AAD0`
- Brand: lilac `#C9A8E8`, pink `#FF9EC5`, mint `#7DDFA8`, yellow `#FFD66B`
- Brand button gradient: `135deg, #C9A8E8 → #FF9EC5`
- Type: DM Sans + Noto Sans Georgian — Display 30, H1 22, H2 16, Body 14, Caption 11.5
- Radii: sm 12, md 20, lg 28, pill 999
- Shadow md formula: `0 4px 16px rgba(255,158,197,0.18), 0 1px 4px rgba(201,168,232,0.12)`
- **No bottom navigation** on any of these screens — they are pre-auth / first-run

---

## Artboard 1 — Login

Single-user app, but proper email + password auth. Layout is calm and centered, generous breathing room, no clutter.

#### Top zone (54px safe area, then content)

- Centered floating logo emblem (140×140, brand gradient `135deg, #C9A8E8 → #FF9EC5`, radius 36, shadow-lg)
- Inside the emblem: large sparkle "✨" (size 60, white)
- Below the emblem (centered):
  - H1 24/800 "Fit Plan"
  - Caption 12/600 `#7B6A9B` — "შენი 4-კვირიანი მოგზაურობა"

#### Form card

Wide rounded-28 card, white surface, shadow-md, padding 26×24, mx 18px:

H2 "გამარჯობა! 👋" inline at top.
Caption below: "შედი შენი მონაცემებით"

Spacing 20px, then **input fields stacked**:

**Email field**
- Floating label "ელ.ფოსტა"
- Input: full-width, height 52, radius 16, bg `#F4ECFA`, no border by default, focused state has 2px lilac border + glow
- Sample value visible: "mei@fitplan.ge"
- Left padding for an inline ✉️ emoji on the far left (size 18, opacity 0.5)

**Password field** (below, 14px gap)
- Floating label "პაროლი"
- Same input style
- Sample dotted value: "••••••••"
- Inline 🔒 emoji left + eye-toggle icon right (`#7B6A9B`)

**Remember me row** (12px below password):
- Inline horizontal row
- Left: custom checkbox 22×22 with rounded corners (radius 8), **checked by default** — fill `135deg, #FFD66B → #FF9EC5`, white check ✓ inside
- Right of checkbox: "დამიმახსოვრე ერთი წელი" 12.5/600 ink
- Tiny caption below the row: "🍪 უსაფრთხო session cookie" `#7B6A9B` 10.5/500

**Login CTA** (below, 20px gap)
- Full-width pill button (height 56, radius 999)
- Brand gradient + shadow-lg + white 15/800
- Text: "შესვლა →"
- Sparkle particles tiny on the right of the text (✨)

**Forgot password**
- Centered below CTA, 14px gap
- Text-only button: "პაროლი დაგავიწყდა?" 12.5/600 lilac

#### Bottom note

Far bottom of the screen (above safe-area):
- Small caption centered: "პირველად აქ ხარ? დაუკავშირდი ადმინს" 11/500 `#B7AAD0`

#### Decorative blobs

- Yellow blob top-right (slightly behind emblem)
- Pink blob bottom-left (behind footer note)

---

## Artboard 2 — Onboarding Step 1 — Welcome

Vertical centered hero layout. Big illustration, big emotion.

#### Top zone (status bar safe area)

Progress dots row at top center — 4 dots, 10×10 each, 8px gap:
- Dot 1: **active** — yellow→pink gradient fill, 14×6 (extended pill style)
- Dot 2-4: muted `#E8DFF7`, regular circles

#### Hero zone (center, ~50% of screen)

- Big floating circular shape 220×220 with `linear-gradient(135deg, #FFD66B 0%, #FF9EC5 100%)`, radius 999, soft pink shadow
- Inside the circle: floating emoji cluster — "💪 ✨ 🌸" arranged organically
- Below the hero circle (28px gap):
  - Display "კეთილი იყოს მობრძანება" 28/800 ink, centered, line-height 1.2
  - Caption "შენი პერსონალური 4-კვირიანი გეგმა" 14/600 `#7B6A9B`, centered

#### Bottom zone — CTA

Full-width gradient button "გავაგრძელოთ →" with sparkle suffix. 
Below it: text-only "გამოტოვება" 12/600 `#B7AAD0`, centered.

Decorative blobs: yellow upper-left, mint lower-right.

---

## Artboard 3 — Onboarding Step 2 — Add to Home Screen (iOS)

This is the **critical iOS instructional screen** — without Add-to-Home-Screen, push notifications don't work.

#### Top — progress dots

Dot 2 active.

#### Title block (top of content)

- Caption above: "📱 iPhone-ისთვის" 11/700 uppercase `#7B4FA8`
- H1 24/800 "დაამატე ეკრანზე"
- Caption "შეტყობინებების მისაღებად აპი უნდა იყოს მთავარ ეკრანზე"

#### Visual demonstration zone

A stylised mini-phone illustration (sketch-style, light pastel lines) showing:
- A small Safari address bar at the top
- A highlighted **share icon** in the bottom toolbar (or top right) — pulsing yellow glow around it
- An arrow pointing to "🔼 Share"

Below the phone illustration — **numbered step cards** (3 stacked rows, 10px gap):

**Step 1** — white card, shadow-sm, radius 20, padding 14×16:
- Left: circle 32×32 with gradient `135deg, #FFD66B → #FF9EC5`, white "1" inside
- Middle: "დააჭირე 🔼 Share ღილაკს" 13/700 ink

**Step 2** — same pattern:
- Circle "2"
- "აირჩიე ➕ Add to Home Screen"

**Step 3**:
- Circle "3"
- "დააჭირე 'Add' ზედა მარჯვენა კუთხეში"

#### CTA section

Below the steps:
- Primary button: "გავიგე ✓" — brand gradient, white, shadow-lg
- Secondary text-button below: "მე უკვე დავამატე" 12/600 lilac

Decorative blobs: yellow top-right, pink mid-left.

---

## Artboard 4 — Onboarding Step 3 — Enable Notifications

#### Top — progress dots

Dot 3 active.

#### Hero zone

- Floating bell icon container 180×180, lilac→pink gradient bg, radius 999
- Inside: big white 🔔 emoji or stylized bell SVG (size 80), with 3 little orbiting sparkles around it

#### Content

- H1 "შეგახსენო კვება და ვარჯიში?" 22/800 centered
- Caption "5 კვება + ვარჯიში — ყოველდღე სწორ დროზე" 14/500 `#7B6A9B`

#### Reminder times preview

Pill chips horizontal row (wraps to 2 rows), centered, 6px gap:
- "🍳 10:00"
- "🫐 12:30"
- "🍗 15:00"
- "🥜 17:30"
- "💪 18:30"
- "🥗 20:00"

Each chip: semi-white bg, ink color, 11/600, radius 999, padding 5×11.

Below: small caption "შეგიძლია მოგვიანებით პროფილში გამორთო" 11/500 `#7B6A9B`.

#### CTA section

- Primary button: "🔔 ჩართე შეტყობინებები" brand gradient
- Secondary: "ახლა არა" 12/600 `#B7AAD0` text-only

Decorative blobs: mint upper-left, yellow lower-right.

---

## Artboard 5 — Onboarding Step 4 — You're Ready

The celebratory final screen.

#### Top — progress dots

All 4 dots filled (gradient yellow→pink).

#### Hero zone

- Big celebration emoji floating: "🎉" (size 100) centered
- Around it 6-8 tiny stars (`✨ ✦ ✧`) scattered organically, each in mint/yellow/pink (confetti vibe)
- Behind everything — large soft circle bg, mint`#E7F8EE` (creates spotlight feeling)

#### Content

- Display "მზად ხარ! ✨" 30/800 centered
- Caption "შენი 4-კვირიანი მოგზაურობა იწყება დღეს" 14/500 `#7B6A9B`

#### Stats preview card

Small rounded-20 card, white, shadow-md, padding 16×18, centered, mx 18px:
- 3 columns:
  - "4" + "კვირა"
  - "5" + "კვება/დღე"
  - "5" + "ვარჯიში/კვ"
- Numbers H2 18/800, captions 10/600 soft ink

#### CTA

Full-width pill button "მოგზაურობა იწყება ✨" brand gradient, shadow-lg, font 15/800.

Below: tiny "შენ შეგიძლია 💪" 11/500 `#7B6A9B` centered.

Decorative blobs: yellow upper-right, pink lower-left, mint middle (subtle).

---

### Layout & spacing (all artboards)

- Status-bar safe area: 54px top
- Bottom safe area: 40px (no nav on these screens)
- Horizontal padding: 22px
- Form card on Login: mx 18px (slightly inset from page edges)
- All buttons: height 56px, radius 999, font 15/800

### Output

5 artboards side-by-side in one Claude Design canvas, labeled "Login", "Welcome", "iOS Add-to-Home", "Notifications", "Ready". Real Georgian text. Visual rhythm should feel like a delightful flow — each artboard nudges the user emotionally toward enabling notifications + getting started.
