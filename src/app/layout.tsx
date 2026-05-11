import type { Metadata } from "next";
import { DM_Sans, Noto_Sans_Georgian } from "next/font/google";
import "./globals.css";

/* DM Sans handles Latin; Noto Sans Georgian fills in Georgian glyphs the
   first family lacks. Both are variable fonts — no `weight` needed.
   --font-sans is composed from both in globals.css @theme. */
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const notoSansGeorgian = Noto_Sans_Georgian({
  variable: "--font-noto-georgian",
  subsets: ["georgian", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fit Plan",
  description: "Personal 4-week nutrition + workout PWA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${notoSansGeorgian.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
