import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MethodologyShell } from "./MethodologyShell";

interface RootLayoutProps {
  children: ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <MethodologyShell>
      <Header />
      <main className="w-full pt-(--header-height)">{children}</main>
      <Footer />

      {/* Global SVG Filters for Editorial Effects */}
      <svg
        className="hidden"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="liquid-reveal" colorInterpolationFilters="sRGB">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.01 0.05"
              numOctaves="2"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                values="0.01 0.05; 0.05 0.01; 0.01 0.05"
                dur="20s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="20"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
    </MethodologyShell>
  );
}
