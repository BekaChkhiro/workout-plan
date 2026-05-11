# Prompt 02 — Meals Screen (Full Daily Nutrition Plan)

**How to use:** Paste the prompt below into Claude Design. The Meals screen is a **viewer/browser of the full plan** — distinct from the Today screen (which shows progress). Here the user reviews ingredients, calories, macros, and swap options across all 5 meals. Tap a card to expand. Edit pencil takes them to the Meal Editor (next prompt).

---

## Prompt to paste

Design the **Meals screen** (`კვება`) for the mobile PWA "Fit Plan" (390 × 844, Georgian language). This is the **third screen in our project** — after Today (`style-c.jsx`) and Plan (`plan-c.jsx`). Match the **Soft Pastel Feminine** design system already in place.

### Locked design tokens (Style C — already used in style-c.jsx and plan-c.jsx)

Inherit ALL tokens from those files. Quick reference:

- **Bg:** lilac→pink page gradient + ambient decorative blobs (yellow + mint + lilac, varied positions)
- **Colors:** ink `#3D2C5F` / soft `#7B6A9B` / mute `#B7AAD0`; lilac `#C9A8E8`, pink `#FF9EC5`, mint `#7DDFA8`, yellow `#FFD66B`
- **Surfaces:** white `#FFFFFF`, muted `#F4ECFA`
- **Gradients:** brand button `135deg, #C9A8E8 → #FF9EC5`; active highlight `120deg, #FFF5DA → #FFE6F0` + 2px `#FFD66B`; workout card `135deg, #E8DFF7 → #FFE6F0`
- **Type:** DM Sans + Noto Sans Georgian — Display 30/700, H1 22/800, H2 16/700, Body 14/500, Caption 11.5/600
- **Radii:** sm 12, md 20, lg 28, pill 999
- **Shadow md:** `0 4px 16px rgba(255,158,197,0.18), 0 1px 4px rgba(201,168,232,0.12)`
- **Bottom nav:** frosted-glass floating pill, active here = **კვება**

---

### Meals screen content (390 × 844)

The screen is a **reference browser** for the full daily nutrition plan. The user toggles between **ვარჯიშის დღე** and **დასვენების დღე** to compare. Each meal card shows time, name, hero image-style emoji, calories, and a 1-line summary. Tap any card to expand it inline (no modal) — expanded state reveals ingredients, macros breakdown, swap options, and an edit affordance.

The current view is **ვარჯიშის დღე** with **meal #3 (სადილი) expanded**.

---

#### Top header

Title row:
- Left: H1 "კვება 🍽" (heading + emoji)
- Right: small pill "✨ რედაქტირება" — same style as Plan screen (lilac outline, frosted bg)

Below title — **day-type segmented toggle**:
- Full-width segmented control in a frosted-glass pill container (same construction as the Week tabs on Plan, but 2 segments instead of 4)
- Left segment **active**: "💪 ვარჯიშის დღე" — gradient pill `135deg, #FFD66B → #FF9EC5`, white text 13/800
- Right segment inactive: "😴 დასვენების დღე" — muted ink `#7B6A9B`, transparent bg, 13/600
- Tiny ✨ next to the active label
- Small caption below the toggle, centered: "5 კვება · საათობრივად"

#### Day summary card

Big rounded-28 card right below the toggle, white surface, shadow-md. Lays out the daily macro/calorie targets visually.

Top row:
- Left side (60% width): big circular **calorie target ring** — 1250 კკალ total target, ring fully drawn with the brand pink→lilac gradient stroke (style matches the Today screen ring). Center text: H1 "1250" + caption "კკალ სამიზნე"
- Right side (40% width): vertical stack of 3 macro lines, same look as Today screen macros — but here they show **target values** not current. Order: ცილა (P) 100გ · ნახშირწყლები (ნ) 120გ · ცხიმი (ც) 40გ. Use the existing track colors (mint, yellow, pink) with bars at 100% width since these are targets.

Bottom row inside the card (separated by thin divider `#F4ECFA`):
- 3 stat pills horizontally, semi-transparent white bg, all caption-sized:
  - "💧 2 ლ წყალი"
  - "🍽 5 კვება"
  - "🕗 20:00-მდე"

#### Section divider

Caption row (22px horiz, 24px top padding):
- Left: H2 "🍽 დღის რაციონი"
- Right: small underlined-style text-button "ყველას რედაქტირება" (12/700, lilac ink, no border) — leads to bulk edit mode

#### 5 meal cards (vertical stack, 12px gap)

Each meal card has TWO states: **collapsed** (compact horizontal row) and **expanded** (full detail panel). Card 3 is expanded in this view; all others are collapsed.

**Collapsed card pattern:**
```
[time-block 56×56] [meal-name + summary] [right: kcal + chevron-down]
```

The time-block on the left is a special design element: a soft-pastel rounded square (radius 16, 56×56) with the time in two lines — number on top large, "saatI" caption below. Color rotates per meal based on time-of-day.

**Expanded card pattern:**
```
[time-block + meal-name in header row]
[ingredients list with bullets]
[macros mini-bars]
[swap chips row]
[footer: edit / mark-as-favorite actions]
```

##### Card 1 — collapsed
- Time block: 10:00 / დილა — bg `#FFF5DA` (yellow tint), time `#A47000`
- Avatar emoji 🍳 inline next to meal name
- Name: "საუზმე"
- Summary: "კვერცხის ომლეტი + ბოსტნეული"
- Right: bold "280" + caption "კკალ" + chevron-down icon
- Surface: white, shadow-md, radius 20

##### Card 2 — collapsed
- Time block: 12:30 / შუაქვე — bg `#FFE6F0` (pink tint), time `#C04A7E`
- Avatar emoji: 🫐
- Name: "შუაქვე"
- Summary: "კოტეჯი + კენკრა"
- Right: "170 · კკალ" + chevron-down

##### Card 3 — **EXPANDED** (the showcase state)

Hero header row (inside expanded card):
- Time block: 15:00 / სადილი — bg `#E8DFF7` (lilac tint), time `#5A3A8B`
- Big avatar emoji 🍗 (size 30, no bg)
- Right side: pink-text caption "ყველაზე დიდი კვება" + bold "330 კკალ"

Title row (full-width below header):
- H1 "სადილი — ქათამი + ბრინჯი" 18/800
- Caption: "მთავარი დღის კვება, ვარჯიშამდე 3 სთ-ით ადრე"

**Ingredients** section (with mini divider above):
- Sub-label caption "🧾 ინგრედიენტები" (uppercase letter-spacing 0.08em)
- Vertical list of 3 rows, each with:
  - Left: small bullet circle (5×5, lilac)
  - Middle: ingredient name 13/600
  - Right: amount caption `#7B6A9B`
- The 3 ingredients:
  - "გამომცხვარი ქათმის მკერდი" · "150 გრ"
  - "ბოსტნეული (ბროკოლი, კაბახი, წიწაკა)" · "200 გრ"
  - "ყავისფერი ბრინჯი / გრეჩკა" · "3 ს.კ."

**Macros for this meal** (mini bars row, below ingredients):
- 3 inline mini-bars, equal-width, height 6, radius 99
- Labels above each bar (caption 10/700): ცილა / ნახშირწყლები / ცხიმი
- Numbers below each bar (caption 10/600): "38 გ" / "32 გ" / "9 გ"
- Bar fills: mint, yellow, pink (matching the global macro colors)

**Swap suggestions** chips row:
- Sub-label caption "🔄 შემცვლელები"
- Horizontal scrollable chip row (pill-shaped, semi-white):
  - "🐟 თევზი (150გ)"
  - "🦃 ინდაური (150გ)"
  - "🍠 ბატატი (100გ)"
  - "🥬 მეტი სალათი"
- Each chip: padding 6×12, radius 999, shadow-sm

**Footer actions** (full-width row inside expanded card):
- Left: text-button with pencil icon + "რედაქტირება" (lilac ink, 12/700)
- Right: heart icon (outlined) + "შენახვა საყვარელში"
- Above the footer, thin divider `#F4ECFA`

The whole expanded card has:
- Background: white surface
- Border: 2px solid `#C9A8E8` (lilac — to flag it's currently focused)
- Shadow: `0 12px 32px rgba(255,158,197,0.28), 0 4px 12px rgba(201,168,232,0.18)` (shadow-lg)
- Padding: 20×22
- Radius: 28
- A faint **chevron-up icon** in the top-right corner

##### Card 4 — collapsed
- Time block: 17:30 / ვარჯიშამდე — bg `#FFE6F0` (pink tint), time `#C04A7E`
- BUT include a small "⚡ ვარჯიშამდე" mini-pill on top of the time block, yellow bg `#FFD66B`, font 8.5/800, position absolute top-right
- Avatar emoji: 🥜
- Name: "ვარჯიშამდე"
- Summary: "იოგურტი + კაკალი"
- Right: "175 კკალ"

##### Card 5 — collapsed
- Time block: 20:00 / ვახშამი — bg `#F4ECFA` (lilac muted), time `#5A4275`
- Avatar emoji: 🥗
- Name: "ვახშამი"
- Summary: "კვერცხი + სალათი"
- Right: "240 კკალ"

#### Bottom helper card

Small rounded-20 card with mint-tint bg `#E7F8EE`, padding 14×16, margin 18px:
- 💡 caption: "ბოლო კვება 20:00-მდე. ძილამდე 2.5-3 საათი მინიმუმ."
- Same style as the Plan screen helper card

#### Bottom navigation

Same floating frosted-glass pill. **Active tab: "კვება"** — yellow→pink gradient pill behind icon.

---

### Layout & spacing notes

- Page bg: same lilac→pink gradient + 3 ambient blobs (positioned to feel different from Today and Plan — e.g., yellow blob slightly lower, mint blob to the right this time, lilac one near the bottom)
- 22px horizontal padding for text rows, 18px for cards
- Day-type toggle and day-summary card sit close together visually (small gap, ~12px) to read as a unit
- Between the day-summary card and the section divider — generous 24px breathing room
- Card gap: 12px between meal cards (slightly more than Plan's 10px because content density is higher)
- 110px bottom safe area for nav

### Output requirements

Single phone-frame artboard (390 × 844). Use real Georgian text — no Latin placeholders. The expanded card (#3) must look unmistakably distinct from the 4 collapsed ones — it's the visual centerpiece of the screen. Make the inline expansion feel intentional, like a panel sliding open rather than a popover.

Below the canvas, briefly note any token deviations or improvisations so I can verify alignment.
