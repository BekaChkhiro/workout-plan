# Prompt 03 — Progress Screen (Weight, Measurements, Photos, Stats)

**How to use:** Paste the prompt below into Claude Design. The Progress screen has **4 tabs** — Weight / Measurements / Photos / Stats. In this prompt we render the **Weight tab active** (the most important one), with the other 3 tabs visible in the tab bar. If you want a separate canvas for Measurements / Photos / Stats later, ask me and I'll write extension prompts.

---

## Prompt to paste

Design the **Progress screen** (`პროგრესი`) for the mobile PWA "Fit Plan" (390 × 844, Georgian). This is the **fourth screen** of our project after Today (`style-c.jsx`), Plan (`plan-c.jsx`), and Meals. Use the locked **Soft Pastel Feminine** design system.

### Locked tokens (full reference in style-c.jsx)

- **Bg:** lilac→pink page gradient + ambient blobs (yellow / mint / lilac), positions varied per screen
- **Ink:** primary `#3D2C5F`, soft `#7B6A9B`, mute `#B7AAD0`
- **Brand:** lilac `#C9A8E8`, pink `#FF9EC5`
- **Accents:** mint `#7DDFA8` (success / down trend = good), yellow `#FFD66B` (active / now)
- **Surfaces:** white `#FFFFFF`, muted `#F4ECFA`
- **Gradients:** brand button `135deg, #C9A8E8 → #FF9EC5`; active highlight `120deg, #FFF5DA → #FFE6F0` + 2px yellow
- **Type:** DM Sans + Noto Sans Georgian — Display 30/700, H1 22/800, H2 16/700, Body 14/500, Caption 11.5/600
- **Radii:** sm 12, md 20, lg 28, pill 999
- **Bottom nav:** floating frosted pill, active here = **პროგრესი**

---

### Progress screen content (390 × 844) — Weight tab active

The user wants to celebrate progress, not feel judged. Visualisations are clean, encouraging, slightly playful. **Down-trend = mint (good news)**, not red.

#### Top header

Title row:
- Left: H1 "პროგრესი 📊"
- Right: small icon-button — calendar icon in lilac outline pill, 32×32, leads to date filter (decorative only in this design)

Below — **4 tab segmented control** (frosted-glass pill, like Plan's week tabs):
- Tab 1 **active**: "⚖️ წონა" — gradient pill `135deg, #FFD66B → #FF9EC5`, white 12.5/800
- Tab 2 inactive: "📏 ზომები" — muted ink, transparent bg, 12.5/600
- Tab 3 inactive: "📸 ფოტო"
- Tab 4 inactive: "✨ სტატ."
- Small ✨ on the active tab

#### Hero stats card

Big rounded-28 card right below tabs. **Two halves split by a thin vertical divider `#F4ECFA`.**

Left half (60%):
- Caption "მიმდინარე წონა" (uppercase letter-spacing 0.08em, color `#7B4FA8`)
- Big number: H1 SIZE 36, 800 weight — "54.3" with subtle " კგ" caption next to it (`#7B6A9B`)
- Caption below: green/mint trend pill — "✨ −2.7 კგ 12 დღეში" — `#E7F8EE` bg, `#2E8B57` text, 11/700, radius 999, padding 4×10

Right half (40%):
- Caption "სამიზნე" (uppercase)
- Stat: H2 "52 კგ" (lighter, soft ink)
- Below: tiny gradient progress bar — current 54.3 vs start 57 vs goal 52 → use 3-stop visualisation:
  - Bar height 6, radius 99, bg `#F4ECFA`
  - Mint→yellow gradient fill at 54% (representing progress: (57-54.3)/(57-52) = 54%)
  - Tiny dot marker at "now" position (yellow `#FFD66B`, 8×8 circle, white border)
- Caption under bar: "კიდევ 2.3 კგ" (`#7B6A9B`, 11/600)

#### Weight chart card

Big rounded-28 card, white surface, padding 22×20, shadow-md. Contains the **weight line chart**.

Top of card (above the chart):
- Left: H2 "📈 დინამიკა"
- Right: small pill toggle: "კვირა" / "თვე" / "ყველა" — active = "კვირა" (`#F4ECFA` bg, ink color, 10.5/700, padding 4×9 each)

Chart area (height 180):
- X-axis: 7 day labels at the bottom — "ორშ · სამშ · ოთხ · ხუთ · პარ · შაბ · კვი" (10/600, `#B7AAD0`)
- Y-axis: implicit (no gridlines), with 3 subtle horizontal guide lines (dashed `#F4ECFA`)
- The line itself:
  - Smooth curve (bezier), 2.5px stroke width
  - Gradient stroke: `linearGradient #FF9EC5 → #C9A8E8` (left to right)
  - Area below the line filled with a fade `linear-gradient(180deg, rgba(255,158,197,0.18) 0%, rgba(201,168,232,0) 100%)`
- Data points: 7 dots, 5px radius, white fill + 2px pink stroke
- **Last point highlighted**: 8px radius, lilac fill with white inner dot (showing "today")
- Floating tooltip above the last point: small white card with shadow-sm, content "54.3 კგ · ოთხშ", with downward-pointing tail
- Sample data progression (downward trend): 57.0 → 56.4 → 56.1 → 55.8 → 55.2 → 54.7 → 54.3

#### Quick-log floating action button

Embedded under the chart card, full-width:
- Pill button, gradient `135deg, #C9A8E8 → #FF9EC5`, white 14.5/800
- Text: "+ წონის ჩაწერა"
- Shadow-lg (pink-tinted)
- Optional small scale icon `⚖️` to the left of text

#### Recent entries list

Section divider:
- Left: H2 "📒 ბოლო ჩანაწერები"
- Right: caption "12 ჩანაწერი" (`#7B6A9B`)

3 row cards in vertical stack (12px gap), all white surface, radius 20, shadow-sm, padding 14×16:

**Row 1** — today
- Left: date block 40×40 (radius 14, `#FFE6F0` bg, pink text) — "12" big, "მაი" caption
- Middle: H2 "54.3 კგ" + caption "ოთხშაბათი" (`#7B6A9B`)
- Right: mint pill "↓ 0.4 კგ" (`#E7F8EE` bg, `#2E8B57` text, 11/700)

**Row 2** — yesterday
- Date block: "11 / მაი" (lilac tint `#F0E5F9`)
- "54.7 კგ" + caption "სამშაბათი"
- Right: mint pill "↓ 0.5 კგ"

**Row 3**
- Date block: "10 / მაი"
- "55.2 კგ" + caption "ორშაბათი"
- Right: mint pill "↓ 0.6 კგ"

#### Achievement banner

Small banner card below the entries, full-width-margin (18 horiz). Uses the workout-card gradient bg `135deg, #E8DFF7 → #FFE6F0`, radius 20, padding 16×18:
- Floating emoji absolute right side: ✨ (size 50, opacity 0.6)
- Inline 2-row content:
  - Caption 10.5/700 uppercase `#7B4FA8` — "შენ ხარ ცეცხლი!"
  - Body 13/600 — "−2.7 კგ მიღწეული — ნახევარი გზა გაიარე 🎉"

#### Tab-content previews (small bottom-of-screen ghost panel)

Just before the bottom nav, show a small caption row to hint that the other 3 tabs have content:
- Subtle horizontal scroll of 3 tiny preview cards:
  - "📏 ზომები — ბოლო გაზომვა 7 დღის წინ"
  - "📸 ფოტო — 4 ფოტო"
  - "✨ სტატ. — adherence 82%"
- Each preview card: white surface, shadow-sm, radius 16, padding 10×14, font 11/600, soft ink

#### Bottom navigation

Same frosted-glass pill. **Active: "პროგრესი"** — yellow→pink gradient behind icon.

---

### Layout & spacing

- Page bg: lilac→pink gradient + 3 ambient blobs (yellow upper-left, mint mid-right, lilac near chart)
- Hero stats card and tabs separated by 14px
- Tabs and weight chart card separated by 16px
- Big-section dividers 24px top padding
- Chart card has internal divider line above the line chart (dashed `#F4ECFA`)
- 110px bottom safe area

### Output

Single 390 × 844 artboard. Real Georgian text. The line chart must visually communicate a clear downward trend — that's the emotional centerpiece of the screen.
