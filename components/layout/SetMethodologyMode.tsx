"use client";

import { useEffect } from "react";
import {
  useMethodology,
  type NullableMethodologyMode,
} from "@/lib/store/MethodologyContext";

/**
 * Drop into any server page to override the auto-detected methodology stage.
 * Useful for service detail pages where the stage comes from CMS data,
 * not from the URL.
 *
 * Usage: <SetMethodologyMode mode={service.category} />
 */
export function SetMethodologyMode({
  mode,
}: {
  mode: NullableMethodologyMode;
}) {
  const { setMode } = useMethodology();

  useEffect(() => {
    if (mode) setMode(mode);
    return () => setMode(null);
  }, [mode, setMode]);

  return null;
}
