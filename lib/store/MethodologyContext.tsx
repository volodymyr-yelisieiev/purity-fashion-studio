"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export type MethodologyMode = "research" | "imagine" | "create";
export type NullableMethodologyMode = MethodologyMode | null;

/**
 * Central mapping between brand methodology verbs and technical routes.
 *
 *   @RESEARCH  → /research
 *   @IMAGINE   → /imagine
 *   @CREATE    → /create
 */
export const methodologyStages: Record<
  MethodologyMode,
  { id: MethodologyMode; num: string; label: string; route: string }
> = {
  research: {
    id: "research",
    num: "01",
    label: "RESEARCH",
    route: "/research",
  },
  imagine: { id: "imagine", num: "02", label: "IMAGINE", route: "/imagine" },
  create: { id: "create", num: "03", label: "CREATE", route: "/create" },
};

/** Reverse-lookup: route segment → MethodologyMode */
const routeToMode: Record<string, MethodologyMode> = {
  research: "research",
  imagine: "imagine",
  create: "create",
};

/**
 * Resolve the methodology stage from a Next.js pathname.
 * Strips the locale prefix (e.g. `/uk/research` → `research` segment).
 */
export function resolveStageFromPathname(
  pathname: string,
): MethodologyMode | null {
  // pathname may be `/uk/research`, `/en/imagine`, or just `/research`
  const segments = pathname.split("/").filter(Boolean);
  for (const seg of segments) {
    if (seg in routeToMode) return routeToMode[seg];
  }
  return null;
}

interface MethodologyContextType {
  mode: NullableMethodologyMode;
  setMode: (mode: NullableMethodologyMode) => void;
  stageInfo: (typeof methodologyStages)[MethodologyMode] | null;
}

const MethodologyContext = createContext<MethodologyContextType | undefined>(
  undefined,
);

export const MethodologyProvider: React.FC<{
  children: React.ReactNode;
  defaultMode?: NullableMethodologyMode;
}> = ({ children, defaultMode = null }) => {
  const pathname = usePathname();

  const [mode, setModeState] = useState<NullableMethodologyMode>(defaultMode);

  // Auto-detect stage from route — null for non-methodology pages
  useEffect(() => {
    const detected = resolveStageFromPathname(pathname);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setModeState(detected);
  }, [pathname]);

  const setMode = (newMode: NullableMethodologyMode) => {
    setModeState(newMode);
  };

  return (
    <MethodologyContext.Provider
      value={{
        mode,
        setMode,
        stageInfo: mode ? methodologyStages[mode] : null,
      }}
    >
      {children}
    </MethodologyContext.Provider>
  );
};

export const useMethodology = () => {
  const context = useContext(MethodologyContext);
  if (context === undefined) {
    throw new Error("useMethodology must be used within a MethodologyProvider");
  }
  return context;
};
