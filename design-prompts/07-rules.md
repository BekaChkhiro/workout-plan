# Prompt 07 — Rules / Tips Reference Screen

**How to use:** Paste the prompt below into Claude Design. This is a **standalone reference screen** — accessible from Profile or as a deep-link. Content is static (from the source document). Goal: skim-friendly, motivating, easy to find specific rules. Reads like a small handbook.

---

## Prompt to paste

Design the **Rules / Tips reference screen** (`წესები`) for the mobile PWA "Fit Plan" (390 × 844, Georgian). Use the locked **Soft Pastel Feminine** design system. The screen is **standalone** — entered from Profile (settings) or onboarding completion. It's a tall scrollable page grouped into thematic sections with colorful category headers.

### Locked tokens (full reference in style-c.jsx)

- Bg: lilac→pink gradient + 3 ambient blobs (yellow / mint / lilac)
- Ink: `#3D2C5F` / `#7B6A9B` / `#B7AAD0`
- Brand: lilac `#C9A8E8`, pink `#FF9EC5`, mint `#7DDFA8`, yellow `#FFD66B`
- Surfaces: white `#FFFFFF`, muted `#F4ECFA`
- Type: DM Sans + Noto Sans Georgian
- Radii: sm 12, md 20, lg 28, pill 999
- Shadow md formula: `0 4px 16px rgba(255,158,197,0.18), 0 1px 4px rgba(201,168,232,0.12)`

There is **no bottom navigation** on this screen — it's a deep-link reference. Instead, the top header has a back arrow that returns the user to where they came from.

---

### Rules screen content (390 × 844, tall scrollable)

#### Top header (sticky)

Title row:
- Left: back chevron icon `← ` 24×24 (lilac, frosted bg pill 36×36)
- Center: H1 "წესები 📖" 19/800
- Right: search icon 🔍 (frosted bg pill 36×36) — decorative

Below: caption row, centered — "8 თემა · 24 წესი" 11.5/600 `#7B6A9B`

#### Hero intro card

Big rounded-28 card with gradient bg `135deg, #E8DFF7 → #FFE6F0`. Padding 20×22. Mx 18:
- Floating big emoji absolute right: ✨ size 80 opacity 0.18
- Caption above: "გახსოვდეს" uppercase letter-spacing 0.08em 10.5/700 `#7B4FA8`
- H1 18/800 "მთავარი ცვლილება — 5-ჯერ ჭამა"
- Body 12.5/500 `#3D2C5F` — "1-2-ჯერ ჭამიდან გადადი 5-ჯერ ჭამაზე. ეს ყველაზე ეფექტური ნაბიჯია მეტაბოლიზმის გასაუმჯობესებლად."

#### Sections (each section is a thematic group with its own color tint)

Pattern per section:
- Section header row — 24px top padding, 22px horizontal:
  - Big colored emoji circle 36×36 — radius 999, faintly-tinted bg matching the section theme
  - H2 16/800 section title (ink color)
  - Right: caption count "4 წესი" `#7B6A9B` 10.5/700
- Section card (white, radius 20, shadow-sm, padding 0 — rows handle their own)
- Each rule is a row inside the card, separated by thin dividers `#F4ECFA`
- Row layout: small emoji icon left (24×24, on tinted circle), rule text 13/500 ink, optional subtitle 11.5/500 soft ink below

##### Section 1 — 💧 წყალი (Water)

Emoji circle bg: light water-blue `#E3F2FD`. Section count: "3 წესი"

Rules:
- 💧 "მინიმუმ 2 ლიტრი დღეში"
- 🥛 "ვარჯიშამდე 30 წთ — 1 ჭიქა"
- 💪 "ვარჯიშის შემდეგ — 1.5 ჭიქა"

##### Section 2 — 🌙 დროები (Timing)

Emoji circle bg: lilac muted `#F0E5F9`. Section count: "2 წესი"

Rules:
- 🌙 "ბოლო კვება 20:00-მდე"
- 💤 "ძილამდე მინიმუმ 2.5-3 საათი"

##### Section 3 — 🥚 პროტეინი (Protein)

Emoji circle bg: yellow tint `#FFF5DA`. Section count: "2 წესი"

Rules:
- 🥚 "პროტეინი ყველა კვებაზე — კვერცხი, ქათამი, კოტეჯი ან იოგურტი"
- 🥤 "პროტეინის კოქტეილი — ჩაანაცვლე ვახშამი, ვარჯიშის შემდეგ 30 წთ-ში"

##### Section 4 — 🚫 გამოირიცხება (Avoid)

Emoji circle bg: pink soft `#FFE6F0`. Section count: "5 პროდუქტი"

Instead of long rows, use chip-cloud with pink-tinted chips:
- "🍞 თეთრი პური"
- "🍺 ბოქალი"
- "🥤 ტკბილი სასმელები"
- "🍟 ჩიფსი"
- "🍰 ნამცხვარი"
- "🌭 ძეხვი"

(Each chip: bg `#FFE6F0`, color `#C04A7E`, 12/700, padding 7×13, radius 999)

##### Section 5 — 💪 ვარჯიში (Workout)

Emoji circle bg: lilac→pink `#F0E5F9`. Section count: "3 წესი"

Rules:
- 🔥 "პარასკევის კომბო დღე — ნუ გამოტოვებ" + subtitle "ყველაზე მეტ კალორიას წვავს"
- 📺 "პილატესის ვიდეო — ყოველ კვირა ახალი" + subtitle "სხვადასხვა კუნთთა ჯგუფი"
- 😴 "ხუთშაბათი + კვირა — სრული დასვენება" + subtitle "კუნთი დასვენებისას იზრდება"

##### Section 6 — 📈 პროგრესია (Progression)

Emoji circle bg: mint `#E7F8EE`. Section count: "2 წესი"

Rules:
- 📈 "ყოველ კვირა ინტენსიობა ოდნავ გაიზარდება"
- 🎯 "ეს ყველაზე ეფექტური გზაა პროგრესისთვის"

##### Section 7 — ⚖️ მოლოდინი (Expectations)

Emoji circle bg: yellow `#FFF5DA`. Section count: "3 წესი"

Rules:
- ⚖️ "ჯანმრთელი ტემპი — 0.5-1 კგ/კვირაში" + subtitle "რეალისტური მოლოდინი ამ გეგმით — 4-6 კგ"
- 📏 "სასწორი ყოველდღე ნუ" + subtitle "გაზომე მუცელი, მკლავი, ბარძაყი კვირაში ერთხელ"
- 💤 "ძილი — 7-8 საათი სავალდებულოა" + subtitle "ნაკლები ძილი → კორტიზოლი ↑ → ცხიმი არ ნადნება"

##### Section 8 — ✨ 4 კვირის შემდეგ

Special **closing card** — uses gradient bg `135deg, #E8DFF7 → #FFE6F0`, radius 28, padding 22×20, shadow-md:

- Floating ✨ absolute top-right (size 60, opacity 0.4)
- Caption "ფინიში" uppercase 10.5/700 `#7B4FA8`
- H1 18/800 "4 კვირის შემდეგ — გადახედე გეგმას"
- Body 12.5/500 "ახალ წონასა და შედეგებს მიუსადაგე ახალი მიზნები"
- Below — full-width pill button "📋 ახალი გეგმის შექმნა" outlined lilac (not filled), 13/700, padding 12×18, radius 999, border 1.5px `#C9A8E8`

#### Footer

Small caption row, centered, 30px bottom:
- "✨ წყარო: კვებისა და ვარჯიშის გეგმის დოკუმენტი"
- 10.5/500 `#B7AAD0`

---

### Layout & spacing

- Page bg: lilac→pink gradient + 3 ambient blobs (yellow upper-right, mint mid-left, lilac lower-right)
- Horizontal padding: 22 for text rows, 18 for cards
- Section header to its card: 8px gap
- Between sections: 24px
- Tall artboard: 390 × 1800 if Claude Design supports it, so all sections render together

### Output

Single 390 × 1800 (or longest available) artboard, real Georgian text throughout. Each section emoji circle should feel like a friendly chapter marker. The Avoid section's chip-cloud breaks up vertical monotony — it should feel visually distinct from the other sections.

Below the canvas, briefly note any token deviations.
