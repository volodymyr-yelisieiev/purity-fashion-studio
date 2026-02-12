"use client";

import { ReactNode } from "react";
import { useMethodology } from "@/lib/store/MethodologyContext";

interface MethodologyShellProps {
  children: ReactNode;
}

/**
 * Thin client wrapper that applies `data-methodology` to the root layout div,
 * activating the dark CSS custom properties from tokens.css for all three stages.
 *
 *   @RESEARCH  → dark + gold (#1A1A1A / #D4AF37)
 *   @IMAGINE   → dark + gold (#1A1A1A / #D4AF37)
 *   @CREATE    → dark + gold (#1A1A1A / #D4AF37)
 */
export function MethodologyShell({ children }: MethodologyShellProps) {
  const { mode } = useMethodology();

  return (
    <div
      className="flex min-h-screen flex-col font-sans text-foreground bg-background transition-colors duration-500"
      data-methodology={mode ?? undefined}
    >
      {children}
    </div>
  );
}
