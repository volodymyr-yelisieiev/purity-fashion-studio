"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "@/i18n/navigation";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/ui";
import { MiniCart } from "@/components/cart";
import { AdventureNavigation } from "./AdventureNavigation";
import { useMethodology } from "@/lib/store/MethodologyContext";
import { cn } from "@/lib/utils";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [headerHighZ, setHeaderHighZ] = useState(false);
  const zTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  const t = useTranslations("navigation");
  const tStages = useTranslations("common.stages");
  const { mode, stageInfo } = useMethodology();

  /** Close menu — used by cart and route changes */
  const closeMenu = useCallback(() => setIsOpen(false), []);

  // Manage delayed z-index drop to prevent header blink on menu close
  useEffect(() => {
    if (isOpen) {
      // Immediately raise z-index when opening
      if (zTimerRef.current) clearTimeout(zTimerRef.current);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHeaderHighZ((prev) => (prev === true ? prev : true));
    } else {
      // Delay z-index drop so header stays above the fading menu
      zTimerRef.current = setTimeout(() => {
        setHeaderHighZ(false);
      }, 350);
    }
    return () => {
      if (zTimerRef.current) clearTimeout(zTimerRef.current);
    };
  }, [isOpen]);

  // Close menu when pathname changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isOpen) setIsOpen(false);
  }, [pathname, isOpen]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Header stays ABOVE the adventure overlay via dynamic z-index */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 bg-background border-b border-border transition-colors duration-300",
          headerHighZ ? "z-210 border-transparent bg-background" : "z-110",
        )}
      >
        <div className="container px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo & Stage Indicator */}
            <div className="flex items-center gap-6 md:gap-8">
              <Link
                href="/"
                className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight font-serif"
                onClick={closeMenu}
              >
                PURITY
              </Link>

              {/* Methodology Stage Tracker — route-driven, hidden when null */}
              {pathname !== "/" && mode !== null && stageInfo && (
                <div className="hidden md:flex items-center gap-3">
                  <span className="text-[10px] font-bold py-1 px-2 bg-foreground text-background">
                    {stageInfo.num}
                  </span>
                  <span className="label text-[10px] opacity-60 uppercase tracking-widest">
                    {tStages(mode)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 md:gap-6">
              {/* Language Switcher — desktop */}
              <div className="hidden md:block">
                <LanguageSwitcher />
              </div>

              {/* Cart — closes menu when opened */}
              <div onClick={closeMenu}>
                <MiniCart />
              </div>

              {/* Menu Button - Adventure Trigger */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="group flex items-center gap-3 text-xs md:text-sm uppercase tracking-widest hover:opacity-70 transition-opacity font-medium"
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
              >
                <div className="relative flex flex-col justify-between w-6 h-3">
                  <span
                    className={cn(
                      "absolute left-0 w-6 h-px bg-foreground transition-all duration-300 origin-center",
                      isOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute left-0 w-6 h-px bg-foreground transition-all duration-300 top-1/2 -translate-y-1/2",
                      isOpen ? "opacity-0" : "opacity-100",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute left-0 w-6 h-px bg-foreground transition-all duration-300 origin-center",
                      isOpen
                        ? "top-1/2 -translate-y-1/2 -rotate-45"
                        : "bottom-0",
                    )}
                  />
                </div>
                <span className="hidden sm:inline">
                  {isOpen ? t("close") || "Close" : t("menu") || "Menu"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Adventure Navigation Overlay */}
      <AdventureNavigation isOpen={isOpen} onClose={closeMenu} />
    </>
  );
}
