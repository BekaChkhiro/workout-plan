# Prompt 01 — Plan Screen (Weekly Schedule + 4-Week Progression)

**How to use:** Paste the prompt below into Claude Design as a new artifact (or use "extend" on the same project file you already have with style-c.jsx). The output should match the Style C tokens we locked in `_TOKENS.md`.

---

## Prompt to paste

Design the **Plan screen** for the mobile PWA "Fit Plan" (390 × 844, Georgian language). Use the **Soft Pastel Feminine** design system we already locked. Below is the full token reference + screen-specific content.

### Locked design tokens (Style C — Soft Pastel Feminine)

**Colors**
- bg gradient: lilac `#F4E5FA` → pink `#FCE4EC` (page background)
- surface: `#FFFFFF` cards; muted surface `#F4ECFA`
- ink: `#3D2C5F` (primary text), `#7B6A9B` (soft), `#B7AAD0` (mute)
- brand: lilac `#C9A8E8`, pink `#FF9EC5`
- accents: mint `#7DDFA8` (success/done), yellow `#FFD66B` (active/now)

**Gradients**
- Brand button: `linear-gradient(135deg, #C9A8E8 0%, #FF9EC5 100%)`
- Active tab pill: `linear-gradient(135deg, #FFD66B 0%, #FF9EC5 100%)`
- Workout-day card highlight: `linear-gradient(135deg, #E8DFF7 0%, #FFE6F0 100%)`
- Ambient decorative blobs: yellow radial top-right + mint radial mid-left (low opacity)

**Typography:** DM Sans + Noto Sans Georgian
- Display 30/700 · H1 22/800 · H2 16/ 700 · Body 14/500 · Caption 11.5/600

**Radii:** sm 12 · md 20 · lg 28 · pill 999
**Shadow md:** `0 4px 16px rgba(255,158,197,0.18), 0 1px 4px rgba(201,168,232,0.12)`
**Motion:** spring stiffness 260 / damping 18; 220ms ease-out fades

**Bottom nav:** floating pill, frosted glass, 5 tabs (დღეს · გეგმა · კვება · პროგრესი · პროფილი) — active tab here is **გეგმა**.

---

### Plan screen content (390 × 844)

The user is on **Week 2 of 4**. She's currently viewing the schedule for this week. She can swipe between weeks 1–4 to preview future intensity. Rest days look distinctly calm; workout days feel alive.

#### Top header (sticky)

Title row:
- Left: H1 "გეგმა" (with subtle "📅" before or after — designer's choice)
- Right: small pill-button "✨ რედაქტირება" (lilac outline, ink color text) — leads to edit mode

Below title — **Week tabs (1, 2, 3, 4)**:
- 4 equal-width tabs in a frosted-glass pill container
- Tab 2 is **active**: gradient pill background `linear-gradient(135deg, #FFD66B 0%, #FF9EC5 100%)`, white text, mini ✨
- Inactive tabs: muted ink color, transparent bg
- Each tab shows: "კვირა 1" · "კვირა 2" · "კვირა 3" · "კვირა 4"
- Below active tab a tiny dot indicator (yellow `#FFD66B`)

#### Week-summary card (just below tabs)

Big rounded-28 card with `linear-gradient(135deg, #E8DFF7 0%, #FFE6F0 100%)` and a faint big "📈" emoji decoration absolute top-right (opacity 0.18, size 110).

Content:
- Caption "ამ კვირის ფოკუსი" (uppercase letter-spacing 0.08em, color `#7B4FA8`)
- H1 "ინტენსიობა იზრდება" with small "↗" indicator (mint color)
- 3 inline pill chips (semi-transparent white bg):
  - "🧘 პილატესი 40 წთ"
  - "🏃 კარდიო 25 წთ"
  - "⚡ საშუალო დონე"
- Bottom row — **intensity progression bar** showing weeks 1→4:
  - 4 segments side-by-side (height 28, full-row width, gap 4)
  - Segment 1 (W1): solid mint `#7DDFA8` height 35% → label "1" + "მსუბუქი"
  - Segment 2 (W2): solid yellow `#FFD66B` height 60% → label "2" + "საშუალო" — **highlighted with thin pink ring border**
  - Segment 3 (W3): muted lilac `#C9A8E8` height 80% → label "3" + "ძლიერი"
  - Segment 4 (W4): muted pink `#FF9EC5` height 100% → label "4" + "მძიმე"
  - These are NOT bars in a chart axis — they're stylised mini-cards that visualise the ramp

#### Section divider

Caption row (22px horiz padding):
- Left: H2 "📋 კვირის ცხრილი"
- Right: caption "3 / 5 ვარჯიში დასრულდა"

#### 7-day list (vertical stack, 10px gap between rows)

Each day is a horizontal card (radius 20, padding 14 × 14). Pattern:

```
[avatar 44×44] [day-name + workout title + meta] [right-side: status indicator]
```

**The 7 cards in order (Mon → Sun)**, with these exact contents for Week 2:

1. **ორშაბათი** · 🧘 პილატესი
   - Subtitle: "ბირთვი, ზურგი, დუნდულო"
   - Meta chips: ⏱ 40 წთ · საშ. დონე
   - Status: ✅ **დასრულდა** (mint pill, faint check icon left)
   - Card style: white surface, light mint dot in avatar bg, dimmed slightly (opacity 0.85)

2. **სამშაბათი** · 🏃 კარდიო
   - Subtitle: "სიარული + ლახტი"
   - Meta chips: ⏱ 35 წთ · ტემპი ↑
   - Status: ✅ **დასრულდა**
   - Card style: same as above

3. **ოთხშაბათი** · 🧘 პილატესი
   - Subtitle: "მკლავები + გვერდები"
   - Meta chips: ⏱ 45 წთ · საშ. დონე
   - Status: ⏰ **დღეს** — **ACTIVE CARD**
     - Background: `linear-gradient(120deg, #FFF5DA 0%, #FFE6F0 100%)`
     - Border: 2px solid `#FFD66B`
     - Shadow: `0 6px 20px rgba(255,158,197,0.28)`
     - Floating top-left badge "⏰ დღეს" pill in yellow (`#FFD66B` bg, `#5A3A0A` text, font 9.5/800, padding 3×9, top: -9, left: 14)
     - Tap CTA on the right: small pink-gradient pill "დაიწყე →"

4. **ხუთშაბათი** · 😴 დასვენება
   - Subtitle: "სრული დასვენება — სიარული ნებაყოფლ."
   - No meta chips
   - Status: small lilac pill "ღია" (means "open / free")
   - Card style: subtle muted — surface `#F4ECFA`, no shadow, ink slightly faded
   - Avatar: bigger 😴 emoji over light lilac bg

5. **პარასკევი** · 🔥 კომბო დღე
   - Subtitle: "20 წთ პილატესი + 20 წთ ლახტი"
   - Meta chips: ⏱ 45 წთ · 🔥 ყველაზე ინტენს.
   - Status: small pink pill "მაქს. დატვ."
   - Card style: white surface with a tiny vertical pink gradient strip on left edge to flag intensity

6. **შაბათი** · 🏃 კარდიო
   - Subtitle: "სიარული + ლახტი"
   - Meta chips: ⏱ 40 წთ · ტემპი ↑
   - Status: ○ "მოლოდინში" (mute ink, light circle icon)
   - Card style: white surface

7. **კვირა** · 😴 დასვენება
   - Subtitle: "სრული დასვენება"
   - No meta chips
   - Status: lilac pill "ღია"
   - Card style: muted, same as Thursday

#### Bottom info card (below the 7-day list, before nav padding)

Small rounded-20 card with mint-tint bg `#E7F8EE`, padding 16×16:
- Inline: 💡 caption "ხუთშაბათი და კვირა — სრული დასვენება სავალდებულოა. კუნთი დასვენებისას იზრდება."
- Use a 2-line cap with friendly tone

#### Bottom navigation

Same pattern as Today screen. **Active tab here is "გეგმა"** — yellow→pink gradient pill behind icon.

---

### Layout & spacing notes

- Page bg: same lilac→pink gradient + the two decorative blobs (positions slightly different so it doesn't look identical to Today)
- Top safe area: 54px
- Bottom safe area: 110px reserved (nav floats above)
- Page horizontal padding: 22px for text rows, 18px for cards
- Sticky header (title + week tabs + week-summary card) should feel cohesive — consider a unified "frosted-glass top zone" with subtle bg blur if it helps visual rhythm
- The 7-day list scrolls; everything above stays in view long enough to give context

### Output requirements

Single phone-frame artboard (390 × 844), plus a small note below the canvas stating which tokens you used so I can verify alignment with `style-c.jsx`. Use real Georgian text — NO Latin placeholders. Use emoji as iconography per the Style C playbook.

After you generate, I'll diff what you produced against `_TOKENS.md` and confirm or tweak.
