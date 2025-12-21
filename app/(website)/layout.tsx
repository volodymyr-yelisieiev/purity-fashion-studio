import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";

export const viewport: Viewport = {
  width: 320,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: "PURITY Fashion Studio",
  description: "Premium minimalist styling services and atelier",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
