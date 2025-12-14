import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { getLocale } from 'next-intl/server';
import "@/styles/globals.css";

// Elegant serif font for headings - fashion aesthetic
const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// Clean sans-serif for body text - highly legible
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const viewport: Viewport = {
  width: 320,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: "PURITY Fashion Studio",
  description: "Premium minimalist styling services and atelier",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body
        className={`${inter.variable} ${cormorant.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
