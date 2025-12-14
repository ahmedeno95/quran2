import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ar",
  display: "swap"
});

export const metadata: Metadata = {
  title: "أكاديمية القرآن المنير | تقديم المعلمات",
  description: "صفحة تقديم المعلمات لأكاديمية القرآن المنير (نموذج متعدد الخطوات)."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable} suppressHydrationWarning>
      <body className="font-sans">{children}</body>
    </html>
  );
}
