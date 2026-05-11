import type { Metadata, Viewport } from "next";
import { DM_Sans, Noto_Sans_Georgian } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

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
  description: "4-კვირიანი კვების და ვარჯიშის გეგმა",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ka"
      className={`${dmSans.variable} ${notoSansGeorgian.variable} h-full antialiased`}
    >
      <body className="from-bg-lilac to-bg-pink text-ink min-h-screen bg-linear-to-b font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
