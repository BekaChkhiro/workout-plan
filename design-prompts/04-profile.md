# Prompt 04 — Profile / Settings Screen

**How to use:** Paste the prompt below into Claude Design. The Profile screen consolidates account, daily targets, goal, plan timing, notifications, and danger-zone actions (reset plan, sign out). This is a long, scrollable form-style screen.

---

## Prompt to paste

Design the **Profile / Settings screen** (`პროფილი`) for the mobile PWA "Fit Plan" (390 × 844, Georgian). This is the **fifth screen** of the project. Use the locked **Soft Pastel Feminine** design system.

### Locked tokens (full reference in style-c.jsx)

- **Bg:** lilac→pink page gradient + ambient blobs
- **Ink:** primary `#3D2C5F`, soft `#7B6A9B`, mute `#B7AAD0`
- **Brand:** lilac `#C9A8E8`, pink `#FF9EC5`
- **Accents:** mint `#7DDFA8`, yellow `#FFD66B`
- **Surfaces:** white `#FFFFFF`, muted `#F4ECFA`
- **Gradients:** brand button `135deg, #C9A8E8 → #FF9EC5`; toggle active `135deg, #FFD66B → #FF9EC5`
- **Type:** DM Sans + Noto Sans Georgian — Display 30, H1 22, H2 16, Body 14, Caption 11.5
- **Radii:** sm 12, md 20, lg 28, pill 999
- **Bottom nav:** floating frosted pill, active here = **პროფილი**

---

### Profile screen content (390 × 844)

Long scrollable list of grouped settings cards. **Each settings card is a single white surface with internal sections separated by thin dividers `#F4ECFA`.** The screen ends with a "danger zone" section in muted tone.

#### Top header

Title row:
- Left: H1 "პროფილი ⚙️"
- Right: small icon-button — info icon "ⓘ" in lilac outline pill (32×32, frosted bg)

#### Identity card (top, distinctive)

Big rounded-28 card with **lilac→pink gradient background** `135deg, #E8DFF7 → #FFE6F0`. Padding 22×20. Layout:

Top row:
- Left: circular avatar 72×72 — gradient bg `135deg, #FFD66B → #FF9EC5`, white "მ" initial inside, font 32/800
- Right of avatar (vertical stack):
  - H1 "მეი" 22/800
  - Caption "mei@fitplan.ge" `#7B6A9B`
  - Small pill below the email: "✨ კვირა 2 / 4" — semi-white bg, 10.5/700, padding 3×9

Decorative ✨ floating top-right corner (opacity 0.4, size 30).

Bottom row inside the card (separated by `#F4ECFA` divider, 14px padding):
- 3 stat columns equally spaced:
  - "57 → 54.3" + caption "კგ"
  - "12" + caption "დღე"
  - "82%" + caption "adherence"
- Numbers H2 16/800, captions 10/600 soft ink

#### Section header pattern (reuse throughout)

Each section header below has the same structure:
- Margin top 24px, horizontal 22px
- Format: emoji + caption uppercase `#7B4FA8` letter-spacing 0.08em, font 10.5/700

---

#### Section 1 — დღიური სამიზნე (Daily targets)

Section header: "🎯 დღიური სამიზნე"

Settings card (white, radius 20, shadow-md, padding 0 — rows handle their own padding). 5 rows, each separated by `#F4ECFA` thin dividers:

**Row 1 — Calories**
- Label: "კალორია"
- Right control: number field "1250 კკალ" with a small lilac edit pencil icon

**Row 2 — Protein**
- Label: "ცილა"
- Right: "100 გ" + mint dot

**Row 3 — Carbs**
- Label: "ნახშირწყლები"
- Right: "120 გ" + yellow dot

**Row 4 — Fat**
- Label: "ცხიმი"
- Right: "40 გ" + pink dot

**Row 5 — Water**
- Label: "წყალი"
- Right: "2 ლ" + water-blue dot
- Below the row (full-width, 8px padding): a small caption "1 ჭიქა = 250 მლ" `#7B6A9B`

Each row: padding 16×18, 14/600 label, right control aligned. Tappable feel.

#### Section 2 — მიზანი (Goal)

Section header: "✨ მიზანი"

Settings card with 3 rows:

**Row 1 — Target weight**
- Label: "სამიზნე წონა"
- Right: "52 კგ"

**Row 2 — Timeline**
- Label: "ვადა"
- Right: "4 კვირაში"

**Row 3 — Progress**
- Label: "მიღწეული"
- Right: mint pill "✨ 54% (-2.7 კგ)" — `#E7F8EE` bg, `#2E8B57` text, 11/700, padding 4×10

#### Section 3 — გეგმის თარიღი (Plan timing)

Section header: "📅 გეგმის თარიღი"

Settings card with 2 rows:

**Row 1 — Start date**
- Label: "დაწყების თარიღი"
- Right: "29 აპრ. 2026"

**Row 2 — Current week**
- Label: "მიმდინარე კვირა"
- Right: 4-segment pill (mini week picker) — "1 · 2 · 3 · 4" with **Week 2 active** (gradient pill yellow→pink, white). Inactive segments are muted ink, transparent.
- Below the row: caption (12/600) — "ავტომატური — შეგიძლია ხელით შეცვალო" + tiny toggle on the right (frosted pill bg, "ავტო" label, mint dot showing on)

#### Section 4 — შეტყობინებები (Notifications)

Section header: "🔔 შეტყობინებები"

Settings card with 4 toggle rows. Each row has a label on the left and an iOS-style switch on the right. Active switches use `linear-gradient(135deg, #FFD66B 0%, #FF9EC5 100%)` — same as the active tab. Inactive switches use `#E8DFF7`.

- **Row 1** — "🍽 კვების შეხსენებები" — switch ON
- **Row 2** — "💪 ვარჯიშის შეხსენებები" — switch ON
- **Row 3** — "💧 წყლის შეხსენებები" — switch OFF
- **Row 4** — "⚖️ წონის შეხსენება" — switch ON, with a small caption below it: "ყოველდღე 8:00-ზე" `#7B6A9B`

Below the card, a small info banner:
- Pill banner, mint-tint bg `#E7F8EE`, padding 14×16, radius 20, border `1px solid rgba(125,223,168,0.35)`
- "💡 iOS-ზე — დაამატე ეკრანზე ხატულა, რომ შეტყობინებები მუშაობდეს" 11.5/500, `#2E6B47`

#### Section 5 — გარეგნობა (Appearance)

Section header: "🎨 გარეგნობა"

Settings card with 1 row:
- Label: "თემა"
- Right: 3-button segmented control — "☀️ ღია · 🌙 მუქი · ⚙️ ავტო" with **ღია active** (gradient yellow→pink pill)

#### Section 6 — სახიფათო ზონა (Danger zone)

Section header: "⚠️ მართვა" (in muted text, no purple tint)

Settings card, but with **muted tone**: bg `#FFFFFF` with very faint pink-tint shadow. 3 row buttons (each row is tappable, no toggles, ink color shifts based on action severity):

**Row 1** — neutral
- Left: 🔄 + "გეგმის ნაგულისხმევზე დაბრუნება" 13/600 ink
- Right: chevron-right `#B7AAD0`

**Row 2** — neutral
- Left: 📤 + "მონაცემების ექსპორტი (CSV)" 13/600 ink
- Right: chevron

**Row 3** — destructive
- Left: 🚪 + "გასვლა" 13/700 in pink `#C04A7E`
- Right: chevron pink

#### Footer

Small caption row, centered, before bottom nav padding:
- "Fit Plan · v0.1.0" 10.5/600 `#B7AAD0`
- Below: "❤️ Made for მეი" 10/500 `#B7AAD0`

#### Bottom navigation

**Active tab: "პროფილი"** — yellow→pink gradient behind icon.

---

### Layout & spacing

- Page bg: lilac→pink + 3 ambient blobs (different positions)
- Identity card has the most prominent shadow (shadow-md), settings cards have shadow-sm
- 12px gap between section header and its card
- 20px gap between sections
- 110px bottom safe area

### Output

Single 390 × 844 artboard, but the content is taller than the viewport — show it as a "tall artboard" if Claude Design supports it (e.g., 390 × 1700) so all sections are visible at once. Real Georgian text throughout. Each toggle, segmented control, and dropdown chevron must feel tactile.
