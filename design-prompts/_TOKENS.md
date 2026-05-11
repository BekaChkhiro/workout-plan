# Locked Design Tokens — Style C: Soft Pastel Feminine

Locked: 2026-05-11. All subsequent screen prompts inherit these tokens.

## Identity

- **App name:** Fit Plan
- **User name in samples:** მეი
- **Vibe:** Soft Pastel Feminine — encouraging, gentle, motivating
- **Mood references:** Flo + Headspace + Duolingo

## Colors

```
/* Backgrounds */
--bg-lilac:    #F4E5FA   /* page background top */
--bg-pink:     #FCE4EC   /* page background bottom — use as lilac→pink gradient */
--surface:     #FFFFFF   /* cards */
--surface-2:   #F4ECFA   /* muted card / track */

/* Ink */
--ink:         #3D2C5F   /* primary text — deep purple */
--ink-soft:    #7B6A9B   /* secondary text */
--ink-mute:    #B7AAD0   /* tertiary / disabled */

/* Brand */
--lilac:       #C9A8E8   /* primary brand */
--pink:        #FF9EC5   /* secondary brand */
--mint:        #7DDFA8   /* success / completed */
--yellow:      #FFD66B   /* attention / "now" / warm accent */

/* Semantic */
--water-blue:  #7CC7FF   /* water tracker */
--track-mint:  #E7F8EE   /* macro P bar bg */
--track-yel:   #FFF5DA   /* macro N bar bg */
--track-pink:  #FFE6F0   /* macro F bar bg */
```

## Gradients

- **Brand button:** `linear-gradient(135deg, #C9A8E8 0%, #FF9EC5 100%)`
- **Active meal card:** `linear-gradient(120deg, #FFF5DA 0%, #FFE6F0 100%)` + 2px solid #FFD66B border
- **Workout card:** `linear-gradient(135deg, #E8DFF7 0%, #FFE6F0 100%)`
- **Calorie ring stroke:** `linearGradient #FF9EC5 → #C9A8E8`
- **Water glass:** `linear-gradient(180deg, #BCE3FF 0%, #7CC7FF 100%)`
- **Active tab pill:** `linear-gradient(135deg, #FFD66B 0%, #FF9EC5 100%)`

## Decorative blobs (Today screen background)

- Top-right: `radial-gradient(circle, rgba(255,214,107,0.35) 0%, transparent 65%)`, 220×220, position top:0 right:-60
- Mid-left:  `radial-gradient(circle, rgba(125,223,168,0.32) 0%, transparent 65%)`, 240×240, position top:380 left:-80

## Typography

- **Font family:** DM Sans (Latin) + Noto Sans Georgian (ka). Both via `next/font`.
- **Display** — 30 / 700 / -0.01em — for greeting
- **H1** — 22 / 800 — for screen titles, big numerics
- **H2** — 16 / 700 — section labels with emoji prefix
- **Body** — 14 / 500
- **Caption** — 11.5 / 600 — meta, times, helper text

## Radii

- `sm`: 12px (small chips)
- `md`: 20px (meal/list cards)
- `lg`: 28px (large cards, workout card, nav bar)
- `xl`: 999px (pills, buttons, badges)

## Shadows

- `none`: none
- `sm`:  `0 2px 8px rgba(201,168,232,0.12)` — list items
- `md`:  `0 4px 16px rgba(255,158,197,0.18), 0 1px 4px rgba(201,168,232,0.12)` — cards
- `lg`:  `0 12px 32px rgba(255,158,197,0.28), 0 4px 12px rgba(201,168,232,0.18)` — elevated CTAs, modals

## Motion

- **Easing:** spring stiffness 260, damping 18 (bouncy entries)
- **Fade:** 220ms ease-out
- **Tap feedback:** scale 0.97 on press, springs back
- **Special moments:** confetti burst on meal completion, mint check stamp on workout done

## Iconography

- **Tab bar icons:** stroke-based line SVG (1.7 strokeWidth), color shifts based on active state. Active tab gets gradient pill background, icon turns white.
- **Meal categories:** emoji-led (🍳 🫐 🍗 🥜 🥗)
- **Section headers:** emoji prefix (🍽 💪 💧 ⚖️ 📊 ✨)
- **Status badges:** mint check (✓) for done, yellow ⏰ "ახლა" for active

## Layout fundamentals

- **Viewport:** 390 × 844 (iPhone), mobile-only, locked max-width
- **Page padding:** 22px horizontal on text, 18px on cards (cards bleed wider)
- **Status-bar safe area:** 54px top
- **Bottom nav safe area:** 110px reserved at scroll bottom
- **Card spacing:** 10–18px between cards in a stack

## Bottom navigation pattern

- Floating pill: `position: absolute, bottom 28px, mx 12px`
- Background: `rgba(255,255,255,0.85)` + `backdrop-filter: blur(20px)`
- 28px radius, 5 tabs equal-width
- Active: gradient pill behind icon (36×28, 14px radius), white icon, dark label "700"
- Inactive: transparent bg, muted icon (`#B7AAD0`), "600" label

## Component patterns to reuse

- **Pill chip:** `padding 5px 11px`, `radius 999`, `font 11.5/600`, optional emoji prefix, semi-transparent white bg
- **Brand CTA:** full-width 99px-radius button, lilac→pink gradient, white text 14.5/700, shadow-lg, "✨" suffix
- **Section header:** emoji + Georgian title, H2 weight, right-side counter ("3 / 5")
- **Card:** white surface, 20–28px radius, shadow-md, 22px horizontal padding

## Reference file

Full implementation: `/Users/beqolozi/Desktop/workout-plan/week-plan/screens/style-c.jsx`
