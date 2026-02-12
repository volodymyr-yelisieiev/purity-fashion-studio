"use client";

import { useEffect } from "react";
import {
  useMethodology,
  type MethodologyMode,
} from "@/lib/store/MethodologyContext";

/**
 * useJourneyProgress
 * Automatically updates the global methodology stage based on viewport intersection
 */
export function useJourneyProgress() {
  const { setMode } = useMethodology();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stage = entry.target.getAttribute(
              "data-stage",
            ) as MethodologyMode;
            if (stage) {
              setMode(stage);
            }
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of the section is visible
        rootMargin: "-10% 0px -40% 0px", // Biased towards top-center of screen
      },
    );

    // Target sections that have data-stage attribute
    const sections = document.querySelectorAll("[data-stage]");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [setMode]);
}
