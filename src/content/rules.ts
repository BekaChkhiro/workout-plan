export type Rule = {
  icon: string;
  tint: string;
  text: string;
  sub?: string;
};

export type RulesSection =
  | {
      variant?: "rows";
      emoji: string;
      circleBg: string;
      title: string;
      count: string;
      rules: Rule[];
    }
  | {
      variant: "chips";
      emoji: string;
      circleBg: string;
      title: string;
      count: string;
      chips: string[];
    };

export const RULES_SECTIONS: RulesSection[] = [
  {
    emoji: "💧",
    circleBg: "#E3F2FD",
    title: "წყალი",
    count: "3 წესი",
    rules: [
      { icon: "💧", tint: "#E3F2FD", text: "მინიმუმ 2 ლიტრი დღეში" },
      { icon: "🥛", tint: "#E3F2FD", text: "ვარჯიშამდე 30 წთ — 1 ჭიქა" },
      { icon: "💪", tint: "#E3F2FD", text: "ვარჯიშის შემდეგ — 1.5 ჭიქა" },
    ],
  },
  {
    emoji: "🌙",
    circleBg: "#F0E5F9",
    title: "დროები",
    count: "2 წესი",
    rules: [
      { icon: "🌙", tint: "#F0E5F9", text: "ბოლო კვება 20:00-მდე" },
      { icon: "💤", tint: "#F0E5F9", text: "ძილამდე მინიმუმ 2.5-3 საათი" },
    ],
  },
  {
    emoji: "🥚",
    circleBg: "#FFF5DA",
    title: "პროტეინი",
    count: "2 წესი",
    rules: [
      {
        icon: "🥚",
        tint: "#FFF5DA",
        text: "პროტეინი ყველა კვებაზე — კვერცხი, ქათამი, კოტეჯი ან იოგურტი",
      },
      {
        icon: "🥤",
        tint: "#FFF5DA",
        text: "პროტეინის კოქტეილი — ჩაანაცვლე ვახშამი, ვარჯიშის შემდეგ 30 წთ-ში",
      },
    ],
  },
  {
    variant: "chips",
    emoji: "🚫",
    circleBg: "#FFE6F0",
    title: "გამოირიცხება",
    count: "5 პროდუქტი",
    chips: [
      "🍞 თეთრი პური",
      "🍺 ბოქალი",
      "🥤 ტკბილი სასმელები",
      "🍟 ჩიფსი",
      "🍰 ნამცხვარი",
      "🌭 ძეხვი",
    ],
  },
  {
    emoji: "💪",
    circleBg: "#F0E5F9",
    title: "ვარჯიში",
    count: "3 წესი",
    rules: [
      {
        icon: "🔥",
        tint: "#FFE6F0",
        text: "პარასკევის კომბო დღე — ნუ გამოტოვებ",
        sub: "ყველაზე მეტ კალორიას წვავს",
      },
      {
        icon: "📺",
        tint: "#F0E5F9",
        text: "პილატესის ვიდეო — ყოველ კვირა ახალი",
        sub: "სხვადასხვა კუნთთა ჯგუფი",
      },
      {
        icon: "😴",
        tint: "#F4ECFA",
        text: "ხუთშაბათი + კვირა — სრული დასვენება",
        sub: "კუნთი დასვენებისას იზრდება",
      },
    ],
  },
  {
    emoji: "📈",
    circleBg: "#E7F8EE",
    title: "პროგრესია",
    count: "2 წესი",
    rules: [
      { icon: "📈", tint: "#E7F8EE", text: "ყოველ კვირა ინტენსიობა ოდნავ გაიზარდება" },
      { icon: "🎯", tint: "#E7F8EE", text: "ეს ყველაზე ეფექტური გზაა პროგრესისთვის" },
    ],
  },
  {
    emoji: "⚖️",
    circleBg: "#FFF5DA",
    title: "მოლოდინი",
    count: "3 წესი",
    rules: [
      {
        icon: "⚖️",
        tint: "#FFF5DA",
        text: "ჯანმრთელი ტემპი — 0.5-1 კგ/კვირაში",
        sub: "რეალისტური მოლოდინი ამ გეგმით — 4-6 კგ",
      },
      {
        icon: "📏",
        tint: "#FFF5DA",
        text: "სასწორი ყოველდღე ნუ",
        sub: "გაზომე მუცელი, მკლავი, ბარძაყი კვირაში ერთხელ",
      },
      {
        icon: "💤",
        tint: "#F0E5F9",
        text: "ძილი — 7-8 საათი სავალდებულოა",
        sub: "ნაკლები ძილი → კორტიზოლი ↑ → ცხიმი არ ნადნება",
      },
    ],
  },
];
