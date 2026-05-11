# Prompt 06 — Meal Editor + Workout Editor (Modal Sheets)

**How to use:** Paste the prompt below into Claude Design. Produces **2 artboards side-by-side**: one for the Meal Editor sheet, one for the Workout Editor sheet. Both are bottom-sheet-style modals that slide up over the parent screen (Meals or Plan), with the parent visible behind a frosted overlay.

---

## Prompt to paste

Design **two modal editor sheets** for the mobile PWA "Fit Plan" (each artboard 390 × 844, Georgian). Use the locked **Soft Pastel Feminine** design system. Both sheets are bottom-anchored modals — the top ~15% of the parent screen is visible behind a frosted dim overlay; the sheet itself starts ~110px from the top, has a top-rounded shape (28 radius top corners only), and contains its own scrollable form.

### Locked tokens (full reference in style-c.jsx)

- Ink: `#3D2C5F` / `#7B6A9B` / `#B7AAD0`
- Brand: lilac `#C9A8E8`, pink `#FF9EC5`, mint `#7DDFA8`, yellow `#FFD66B`
- Surfaces: white `#FFFFFF`, muted `#F4ECFA`
- Brand gradient: `135deg, #C9A8E8 → #FF9EC5`
- Type: DM Sans + Noto Sans Georgian
- Radii: sm 12, md 20, lg 28, pill 999
- Input field bg: `#F4ECFA`, focused 2px lilac border + soft glow

---

## Artboard 1 — Meal Editor sheet

Context: parent is Meals screen; user tapped "რედაქტირება" on Card 3 (სადილი).

#### Backdrop

- Top 110px shows a glimpse of the Meals screen blurred with `rgba(60,30,90,0.35)` overlay
- Faint visible: tab bar + day-summary card edge

#### Sheet container

- Position: starts at y=110, bottom-aligned
- Bg: white
- Radius: 28 on top corners only, 0 on bottom
- Shadow: `0 -8px 32px rgba(60,30,90,0.18)`
- Top edge: small horizontal **grab handle** (40×4 pill, `#E8DFF7`), centered, 8px from top

#### Sheet header (sticky inside sheet)

20px top padding after grab handle:
- Left: H1 "სადილის რედაქტირება" 19/800
- Right: "✕" close icon (32×32 frosted-pill, lilac ink)
- Below: caption "შენი ცვლილებები ავტომატურად შენახდება" 11.5/500 `#7B6A9B`

#### Form content (scrollable)

##### Section: ძირითადი

Sub-label "🍽 ძირითადი" (uppercase 10.5/700 `#7B4FA8`, letter-spacing 0.08em)

Settings card, white-on-white container with internal padding 0, internal dividers `#F4ECFA`:

**Row — Time**
- Left label "დრო" 13/600
- Right control: time picker pill "15:00" + small chevron — bg `#F4ECFA`, ink color, 12/700

**Row — Meal name**
- Full-width input below the label "კვების სახელი"
- Pre-filled value: "სადილი — ქათამი + ბრინჯი"
- Input style: bg `#F4ECFA`, height 48, radius 14, padding 14×16

**Row — Day type**
- Label "დღის ტიპი"
- Segmented control: "💪 ვარჯიშის · 😴 დასვენების · ორივე" — **"ორივე" active** with yellow→pink gradient

##### Section: ინგრედიენტები

Sub-label "🧾 ინგრედიენტები" + small "+ დამატება" link on the right (lilac, 11.5/700)

3 ingredient rows (each row is a tappable card):
- Row card: white surface, radius 14, shadow-sm, padding 12×14
- Left: drag-handle icon ⋮⋮ (`#B7AAD0`)
- Middle: ingredient name input (transparent bg, no border, 13/600 ink) — pre-filled with sample names
- Right: amount input (60px wide, `#F4ECFA` bg, radius 10, font 11.5/600 centered)
- Far right: ✕ remove icon (`#B7AAD0`, 14×14)

Pre-fills:
1. "გამომცხვარი ქათმის მკერდი" — "150 გრ"
2. "ბოსტნეული (ბროკოლი, კაბახი)" — "200 გრ"
3. "ყავისფერი ბრინჯი" — "3 ს.კ."

##### Section: კალორია და მაკრო

Sub-label "📊 კალორია და მაკრო"

Card with 4 number-field rows, internal dividers:
- "კალორია" — pre-filled "330 კკალ"
- "ცილა" — "38 გ" + mint dot
- "ნახშირწყლები" — "32 გ" + yellow dot
- "ცხიმი" — "9 გ" + pink dot

Below the card — small caption "ჯამი ნაგულისხმევია — შენ შეგიძლია ხელით შეცვალო" `#7B6A9B` 11/500

##### Section: შემცვლელები

Sub-label "🔄 შემცვლელები"

Chip-cloud: 4 existing chips with ✕ remove inline, + one "+ ახალი" outlined add chip:
- "🐟 თევზი (150გ) ✕"
- "🦃 ინდაური (150გ) ✕"
- "🍠 ბატატი (100გ) ✕"
- "🥬 მეტი სალათი ✕"
- "+ ახალი" — dashed lilac outline pill

##### Section: შენიშვნა

Sub-label "📝 შენიშვნა"

Text-area input — 3-line min, bg `#F4ECFA`, radius 14, padding 14, font 12/500
- Placeholder: "მაგ. ვარჯიშამდე 3 სთ-ით ადრე..."
- Pre-filled empty (placeholder visible)

#### Sticky footer (bottom of sheet)

Floats above content with subtle top divider `#F4ECFA`. Padding 16×22.
- Left: text-button "გაუქმება" 13/700 `#7B6A9B`
- Right: primary CTA pill "შენახვა ✓" — brand gradient, white 14/800, padding 12×24, shadow-md

---

## Artboard 2 — Workout Editor sheet

Context: parent is Plan screen; user tapped "✨ რედაქტირება" on Wednesday's workout.

#### Backdrop

- Same overlay/blur pattern as Meal Editor

#### Sheet header

- H1 "ვარჯიშის რედაქტირება" + "✕"
- Caption "ოთხშაბათი · კვირა 2"

#### Form content

##### Section: ძირითადი

Sub-label "💪 ძირითადი"

Settings card with 3 rows:

**Row — Type**
- Label "ტიპი"
- Right: dropdown chip showing current value "🧘 პილატესი" + chevron — bg `#F4ECFA`
- Below the row (when "expanded preview" visible): 4 option chips
  - "🧘 პილატესი" (**selected** — gradient bg yellow→pink, white text)
  - "🏃 კარდიო"
  - "🔥 კომბო"
  - "😴 დასვენება"

**Row — Title (sub-focus)**
- Full-width input "ფოკუსი" — pre-filled "მკლავები + გვერდები"

**Row — Weekday**
- Label "დღე"
- Right: 7-day mini picker (compact, 7 squares 26×26 each, 4px gap)
- Squares show: ო · სა · **ოთხ** · ხუ · პა · შა · კვ
- **ოთხ active** — gradient pill yellow→pink, white text
- Inactive: muted ink, transparent

##### Section: დრო და ინტენსიობა

Sub-label "⏱ დრო და ინტენსიობა"

Card with 3 rows:

**Row — Duration**
- Label "ხანგრძლივობა"
- Right: number-with-stepper "45 წთ" (with - and + lilac circles on the sides, ink number centered)

**Row — Window**
- Label "დროის ფანჯარა"
- Right: two time-pickers connected by an arrow "18:30 → 19:30"

**Row — Intensity**
- Label "ინტენსიობა"
- Right: 4-segment picker pills:
  - "🌿 მსუბუქი" (mint bg)
  - "⚡ საშუალო" (**selected** — yellow→pink gradient, white text)
  - "🔥 ძლიერი"
  - "💥 მძიმე"

##### Section: აღწერა

Sub-label "📝 აღწერა"

Text-area — pre-filled with 2 lines:
- "YouTube პილატესი — სხვა ვიდეო"
- "ფოკუსი: მკლავები + გვერდები"

##### Section: ვიდეო ბმული (optional)

Sub-label "🎥 ვიდეო ბმული — სურვილისამებრ"

Input field with 🔗 prefix icon — placeholder "youtube.com/...", empty

##### Section: შეხსენება

Sub-label "🔔 შეხსენება"

Toggle row card:
- Label "შემახსენე 30 წთ-ით ადრე"
- Right: iOS-style switch, **ON** (yellow→pink gradient)

#### Sticky footer

- Left: text-button "გაუქმება"
- Center: secondary text-button "ნაგულისხმევზე დაბრუნება" 12/700 lilac
- Right: primary CTA "შენახვა ✓" brand gradient

---

### Layout & spacing (both sheets)

- Sheet starts at y=110 (visible parent peek above)
- Top corner radius: 28 (top only)
- Internal horizontal padding: 22
- Internal vertical padding: 20 between sections
- Form cards: radius 20, shadow-sm
- Sticky footer height ~80px, has a thin top divider
- Backdrop overlay: `rgba(60,30,90,0.35)` + 8px blur

### Output

2 artboards side-by-side. Real Georgian text. Each editor must feel like a focused single-purpose tool — busy fields exist but visual rhythm (cards, dividers, generous spacing) keeps it calm. Show realistic pre-filled values throughout so the editing intent is obvious.
