// app/layout.tsx
// Minimal root layout - required for root not-found.tsx
// This layout should NOT include any HTML/body tags or providers
// as those are defined in the route group layouts

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
