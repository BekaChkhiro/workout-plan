import type { Metadata, Viewport } from "next";
import "./globals.css";

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
  themeColor: "#FCE4EC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ka" className="h-full antialiased">
      <body className="min-h-screen bg-linear-to-b from-bg-lilac to-bg-pink font-sans text-ink">
        {children}
      </body>
    </html>
  );
}
