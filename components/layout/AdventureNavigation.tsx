"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/i18n/navigation";
import {
  useMethodology,
  methodologyStages,
} from "@/lib/store/MethodologyContext";
import { H2, Lead, LanguageSwitcher } from "@/components/ui";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface AdventureNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdventureNavigation({
  isOpen,
  onClose,
}: AdventureNavigationProps) {
  const t = useTranslations("navigation");
  const tStages = useTranslations("common.stages");
  const { mode, setMode } = useMethodology();
  const overlayRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const stages = Object.values(methodologyStages);

  // Focus trap: trap Tab/Shift+Tab inside overlay
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !overlayRef.current) return;

      const focusableElements = Array.from(
        overlayRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      if (focusableElements.length === 0) return;

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose],
  );

  // Focus management: focus first element on open, restore on close
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.addEventListener("keydown", handleKeyDown);
      const timer = setTimeout(() => {
        const first =
          overlayRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
        first?.focus();
      }, 100);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        clearTimeout(timer);
      };
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-200 bg-background flex flex-col pt-(--header-height) overflow-y-auto overscroll-contain min-h-dvh"
          role="dialog"
          aria-modal="true"
        >
          {/* Methodology Map — centered content area */}
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:px-8 md:py-12">
            <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 lg:gap-12 auto-rows-fr">
              {stages.map((stage) => (
                <motion.div
                  key={stage.id}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + stages.indexOf(stage) * 0.1 }}
                >
                  <Link
                    href={stage.route as any}
                    className={cn(
                      "group relative block h-full p-6 md:p-8 border border-border/50 hover:border-foreground transition-colors duration-500 min-h-50 md:min-h-70",
                      mode === stage.id && "bg-foreground text-background",
                    )}
                    onClick={() => {
                      setMode(stage.id);
                      onClose();
                    }}
                  >
                    <div className="flex flex-col h-full space-y-4 md:space-y-8">
                      <span className="font-serif text-4xl md:text-6xl opacity-20 group-hover:opacity-100 transition-opacity">
                        {stage.num}
                      </span>
                      <div className="space-y-2 md:space-y-4">
                        <H2
                          className={cn(
                            "heading-3",
                            mode === stage.id && "text-background",
                          )}
                        >
                          {tStages(stage.id as any)}
                        </H2>
                        <Lead
                          className={cn(
                            "text-sm md:text-base",
                            mode === stage.id
                              ? "text-background/80"
                              : "text-muted-foreground",
                          )}
                        >
                          {tStages(`${stage.id}Description` as any)}
                        </Lead>
                      </div>

                      <span className="link-editorial mt-auto self-start text-sm">
                        {t("exploreStage")}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Quick Links */}
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-10 md:mt-20 flex flex-wrap justify-center gap-4 md:gap-8 pb-4"
            >
              {[
                "collections",
                "portfolio",
                "blog",
                "school",
                "about",
                "contact",
              ].map((key) => (
                <Link
                  key={key}
                  href={`/${key}`}
                  className="text-xs md:text-sm uppercase tracking-widest hover:opacity-50 transition-opacity"
                  onClick={onClose}
                >
                  {t(key)}
                </Link>
              ))}
            </motion.nav>

            {/* Language Switcher — mobile-visible */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="pb-8 md:hidden"
            >
              <LanguageSwitcher />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
