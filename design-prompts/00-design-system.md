# Prompt 00 — Design System: Pick a Vibe

**How to use:** Paste this whole prompt into Claude Design (claude.ai → New Design). It will generate three style explorations side-by-side. You pick one; I'll lock the tokens from your chosen direction and rewrite all subsequent screen prompts to match it.

---

## Prompt to paste

I'm designing a mobile-only PWA called **"Fit Plan"** — a personal 4-week nutrition + workout tracker in Georgian. The app is for one user (a 22-year-old woman, 152cm / 57kg, goal: -4-6kg in 4 weeks). She'll check it 5+ times per day to log meals, mark workouts, track water and weight. The feeling must be **personal, calm, motivating — never clinical or aggressive.**

Generate **three side-by-side style explorations** of the **Today screen** at iPhone size (390 × 844). All three show the same content; only the visual language changes. Each style must include a fully resolved token system below the mockup (colors, type, radii, shadow, motion).

### The Today screen content (identical across all three styles)

Top of screen:
- Status: "ოთხშაბათი, 11 მაისი" (small label) + "კვირა 2 / 4" (week badge)
- Big greeting: "გამარჯობა, ნინო 👋"
- "დღეს ვარჯიშის დღეა" subtitle

Middle — daily snapshot card:
- Large circular calorie ring: **820 / 1250 კკალ** (66% filled), with macros below in 3 mini-bars: P 64/100გ, ნ 78/120გ, ც 26/40გ
- Water row to the right or below: 8 glass icons, 5 filled, "1.25 / 2 ლ"

Meals list (5 cards, vertical):
1. ✅ **10:00 — საუზმე** · "კვერცხის ომლეტი + ბოსტნეული" · 280 კკალ · *completed (struck through or dimmed)*
2. ✅ **12:30 — შუაქვე** · "კოტეჯი + კენკრა" · 170 კკალ · *completed*
3. ✅ **15:00 — სადილი** · "ქათამი + ბრინჯი + ბოსტნეული" · 330 კკალ · *completed*
4. ⏰ **17:30 — ვარჯიშამდე** · "იოგურტი + კაკალი" · 175 კკალ · *active / current — emphasized*
5. ○ **20:00 — ვახშამი** · "კვერცხი + სალათი" · 240 კკალ · *upcoming, muted*

Workout card (below meals):
- "💪 დღევანდელი ვარჯიში" header
- Type: "🧘 პილატესი — ბირთვი, ზურგი, დუნდულო"
- Duration: "35-45 წთ" · Intensity: "საშუალო"
- "18:30-19:30" time
- Big completion button: "დასრულდა"

Bottom: 5-tab navigation bar (icons + Georgian labels):
- დღეს · გეგმა · კვება · პროგრესი · პროფილი

---

### Style A — Warm Minimalist (soft pastel)

- **Palette:** cream background `#FAF6F0`, mint accent `#A8D5BA`, peach accent `#F5B7A1`, terracotta text `#5C4033`, soft white cards `#FFFFFF` with `8px` subtle shadow
- **Type:** large display headings in a friendly serif (Fraunces / DM Serif Display), body in Inter / Noto Sans Georgian
- **Shape:** generous `24px` card radii, lots of whitespace, hand-drawn-feeling iconography
- **Motion:** gentle fades, subtle spring on tap
- **Mood reference:** Notion + Calm app + a hint of Apothecary

### Style B — Premium Dark (Apple Fitness vibe)

- **Palette:** near-black background `#0A0A0B`, elevated card `#16161A`, neon-green accent `#A8FF60` for progress, hot pink `#FF3D71` for alerts, white text
- **Type:** SF Pro / Inter, tight tracking, all-caps small labels, big bold numerics
- **Shape:** rounded `20px` cards, subtle inner glow on active card, ring progress with gradient stroke
- **Motion:** crisp 200ms eases, haptic-feeling tap feedback
- **Mood reference:** Apple Fitness+ + Whoop + Strava

### Style C — Soft Pastel Feminine (energetic & encouraging)

- **Palette:** lilac-to-pink gradient background `#F4E5FA → #FCE4EC`, deep purple text `#3D2C5F`, mint-green success `#7DDFA8`, sunshine yellow accent `#FFD66B`
- **Type:** rounded geometric sans (DM Sans / Quicksand / Noto Sans Georgian), generous line-height, big emoji as primary iconography
- **Shape:** pill-shaped buttons, `28px` super-rounded cards, soft pink shadows
- **Motion:** bouncy springs, confetti on meal completion
- **Mood reference:** Flo + Headspace + Duolingo

---

### Output requirements

For each of the three styles, deliver in a single Claude Design canvas, arranged horizontally:

1. **Phone mockup** (390 × 844, with phone frame optional) showing the full Today screen scrolled to top
2. **Token sheet below** containing:
   - 6–8 named color tokens (hex)
   - 5-step type scale (display, h1, h2, body, caption — with sizes & weights)
   - Radii scale (sm/md/lg/xl)
   - Shadow scale (none/sm/md/lg)
   - One sentence describing the motion language

Use real Georgian characters in all sample text — do NOT substitute Latin placeholders. Make the active meal card (5:30pm pre-workout) visually distinct from completed/upcoming meals so the priority is obvious at a glance.

After I see the three, I'll tell you which to lock as the project's design system.
