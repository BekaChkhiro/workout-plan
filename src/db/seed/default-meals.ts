/**
 * Default meal templates — 5 meals × 2 day-types = 10 rows.
 * Source: `Downloads/კვების_ვარჯიშის გეგმა.docx` (T2.4).
 *
 * Stored in the `default_meals` set of tables; on signup, copied into the
 * user-owned `meals` rows by `seedUserPlan()` (T2.6).
 */

export type DefaultMealSeed = {
  dayType: "workout" | "rest";
  time: string;
  name: string;
  summary: string;
  calories: number;
  pG: number;
  nG: number;
  fG: number;
  sortOrder: number;
  ingredients: { name: string; amount: string }[];
  swaps: string[];
};

const workoutDay: DefaultMealSeed[] = [
  {
    dayType: "workout",
    time: "10:00",
    name: "საუზმე",
    summary: "კვერცხის ომლეტი + ბოსტნეული",
    calories: 280,
    pG: 22,
    nG: 10,
    fG: 16,
    sortOrder: 1,
    ingredients: [
      { name: "კვერცხი (ომლეტი ან მოხარშული)", amount: "3 ცალი" },
      { name: "პომიდორი", amount: "1 ცალი" },
      { name: "კიტრი", amount: "1 ცალი" },
      { name: "ყავა/ჩაი შაქრის გარეშე", amount: "1 ჭიქა" },
    ],
    swaps: [
      "🥣 შვრიის ფაფა რძით (40გ)",
      "🍳 4 თეთრი + 1 მთლიანი კვერცხი",
      "🥑 ავოკადო ტოსტი ცილოვან პურზე",
    ],
  },
  {
    dayType: "workout",
    time: "12:30",
    name: "შუაქვე",
    summary: "კოტეჯი + კენკრა",
    calories: 170,
    pG: 16,
    nG: 16,
    fG: 4,
    sortOrder: 2,
    ingredients: [
      { name: "კოტეჯი 5%", amount: "150 გრ" },
      { name: "კენკრა (შეიძლება მოყინული)", amount: "მუჭა" },
      { name: "თაფლი (სურვილისამებრ)", amount: "1 ჩ.კ." },
    ],
    swaps: [
      "🥛 ბერძნული იოგურტი 2% + ხილი (150გ)",
      "🍎 ვაშლი + არაქისის კარაქი (1 ს.კ.)",
      "🌰 ნუში/ნიგოზი (30გ)",
    ],
  },
  {
    dayType: "workout",
    time: "15:00",
    name: "სადილი",
    summary: "ქათამი + ბრინჯი + ბოსტნეული",
    calories: 330,
    pG: 38,
    nG: 32,
    fG: 9,
    sortOrder: 3,
    ingredients: [
      { name: "გამომცხვარი ქათმის მკერდი", amount: "150 გრ" },
      { name: "ბოსტნეული (ბროკოლი, კაბახი, წიწაკა)", amount: "200 გრ" },
      { name: "ყავისფერი ბრინჯი / გრეჩკა", amount: "3 ს.კ." },
    ],
    swaps: ["🐟 თევზი (150გ)", "🦃 ინდაური (150გ)", "🍠 ბატატი (100გ)", "🥬 მეტი სალათი"],
  },
  {
    dayType: "workout",
    time: "17:30",
    name: "ვარჯიშამდე",
    summary: "იოგურტი + კაკალი",
    calories: 175,
    pG: 12,
    nG: 15,
    fG: 8,
    sortOrder: 4,
    ingredients: [
      { name: "ბერძნული იოგურტი 2%", amount: "150 გრ" },
      { name: "ნუში (ან 3-4 ნიგოზი)", amount: "10-12 ცალი" },
    ],
    swaps: [
      "🍌 ბანანი + არაქისის კარაქი (1 ს.კ.)",
      "🍞 ცილოვანი პური + ცილოვანი ყველი",
      "🥚 მოხარშული კვერცხი (2 ცალი)",
    ],
  },
  {
    dayType: "workout",
    time: "20:00",
    name: "ვახშამი",
    summary: "კვერცხი + სალათი",
    calories: 240,
    pG: 22,
    nG: 12,
    fG: 10,
    sortOrder: 5,
    ingredients: [
      { name: "კვერცხი", amount: "2 ცალი" },
      { name: "ქათამი (ან 150გ კოტეჯი)", amount: "100 გრ" },
      { name: "დიდი სალათი + ზეთი", amount: "1 ჩ.კ." },
    ],
    swaps: ["🐟 ორთქლზე თევზი (150გ)", "🥒 ბერძნული სალათი ფეტათი", "🍳 ბოსტნეულის ომლეტი"],
  },
];

const restDay: DefaultMealSeed[] = [
  {
    dayType: "rest",
    time: "10:00",
    name: "საუზმე",
    summary: "კვერცხის ომლეტი + ბოსტნეული",
    calories: 280,
    pG: 22,
    nG: 10,
    fG: 16,
    sortOrder: 1,
    ingredients: [
      { name: "კვერცხი (ომლეტი ან მოხარშული)", amount: "3 ცალი" },
      { name: "პომიდორი", amount: "1 ცალი" },
      { name: "კიტრი", amount: "1 ცალი" },
      { name: "ყავა/ჩაი შაქრის გარეშე", amount: "1 ჭიქა" },
    ],
    swaps: [
      "🥣 შვრიის ფაფა რძით (40გ)",
      "🍳 4 თეთრი + 1 მთლიანი კვერცხი",
      "🥑 ავოკადო ტოსტი ცილოვან პურზე",
    ],
  },
  {
    dayType: "rest",
    time: "12:30",
    name: "შუაქვე",
    summary: "კოტეჯი + კენკრა",
    calories: 170,
    pG: 16,
    nG: 16,
    fG: 4,
    sortOrder: 2,
    ingredients: [
      { name: "კოტეჯი 5%", amount: "150 გრ" },
      { name: "კენკრა (შეიძლება მოყინული)", amount: "მუჭა" },
      { name: "თაფლი (სურვილისამებრ)", amount: "1 ჩ.კ." },
    ],
    swaps: [
      "🥛 ბერძნული იოგურტი 2% + ხილი (150გ)",
      "🍎 ვაშლი + არაქისის კარაქი (1 ს.კ.)",
      "🌰 ნუში/ნიგოზი (30გ)",
    ],
  },
  {
    dayType: "rest",
    time: "15:00",
    name: "სადილი",
    summary: "ქათამი + დამატებითი ბოსტნეული (ბრინჯის გარეშე)",
    calories: 230,
    pG: 36,
    nG: 18,
    fG: 8,
    sortOrder: 3,
    ingredients: [
      { name: "გამომცხვარი ქათმის მკერდი", amount: "150 გრ" },
      { name: "ბოსტნეული (ბროკოლი, კაბახი, წიწაკა)", amount: "300 გრ" },
    ],
    swaps: ["🐟 თევზი (150გ)", "🦃 ინდაური (150გ)", "🥬 ბერძნული სალათი ფეტათი"],
  },
  {
    dayType: "rest",
    time: "17:30",
    name: "შუა საქმე",
    summary: "იოგურტი + კაკალი",
    calories: 175,
    pG: 12,
    nG: 15,
    fG: 8,
    sortOrder: 4,
    ingredients: [
      { name: "ბერძნული იოგურტი 2%", amount: "150 გრ" },
      { name: "ნუში (ან 3-4 ნიგოზი)", amount: "10-12 ცალი" },
    ],
    swaps: [
      "🍌 ბანანი + არაქისის კარაქი (1 ს.კ.)",
      "🍞 ცილოვანი პური + ცილოვანი ყველი",
      "🥚 მოხარშული კვერცხი (2 ცალი)",
    ],
  },
  {
    dayType: "rest",
    time: "19:00",
    name: "ვახშამი",
    summary: "კვერცხი + სალათი",
    calories: 240,
    pG: 22,
    nG: 12,
    fG: 10,
    sortOrder: 5,
    ingredients: [
      { name: "კვერცხი", amount: "2 ცალი" },
      { name: "ქათამი (ან 150გ კოტეჯი)", amount: "100 გრ" },
      { name: "დიდი სალათი + ზეთი", amount: "1 ჩ.კ." },
    ],
    swaps: ["🐟 ორთქლზე თევზი (150გ)", "🥒 ბერძნული სალათი ფეტათი", "🍳 ბოსტნეულის ომლეტი"],
  },
];

export const defaultMealsSeed: DefaultMealSeed[] = [...workoutDay, ...restDay];
