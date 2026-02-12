"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface ExpandableGridProps {
  children: ReactNode;
  /** Number of visible rows before collapsing (default: 2) */
  visibleRows?: number;
  className?: string;
}

/**
 * Wraps a Grid and collapses it to `visibleRows` rows.
 * Shows "Show All" / "Show Less" toggle when content overflows.
 */
export function ExpandableGrid({
  children,
  visibleRows = 2,
  className,
}: ExpandableGridProps) {
  const t = useTranslations("common");
  const gridRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const [collapsedHeight, setCollapsedHeight] = useState<number | undefined>(
    undefined,
  );

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    function measure() {
      if (!el) return;
      const gridStyle = getComputedStyle(el);
      const rowGap = parseFloat(gridStyle.rowGap) || 0;

      // Find unique row top positions to determine row boundaries
      const items = Array.from(el.children) as HTMLElement[];
      if (items.length === 0) return;

      const rowTops = new Map<number, number>(); // rounded top -> index
      items.forEach((item) => {
        const top = Math.round(item.offsetTop);
        if (!rowTops.has(top)) {
          rowTops.set(top, rowTops.size);
        }
      });

      const totalRows = rowTops.size;
      const needsCollapse = totalRows > visibleRows;
      setOverflows(needsCollapse);

      if (needsCollapse) {
        // Calculate height to show exactly `visibleRows` rows
        const sortedTops = Array.from(rowTops.keys()).sort((a, b) => a - b);
        const lastVisibleRowTop = sortedTops[visibleRows - 1];

        // Find tallest item in the last visible row
        let maxBottom = 0;
        items.forEach((item) => {
          const itemTop = Math.round(item.offsetTop);
          if (itemTop === lastVisibleRowTop) {
            maxBottom = Math.max(maxBottom, item.offsetTop + item.offsetHeight);
          }
        });

        setCollapsedHeight(maxBottom + rowGap / 2);
      }
    }

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();

    return () => ro.disconnect();
  }, [visibleRows]);

  const showToggle = overflows;

  return (
    <div className={className}>
      <div
        ref={gridRef}
        style={
          !expanded && overflows && collapsedHeight !== undefined
            ? { maxHeight: collapsedHeight, overflow: "hidden" }
            : undefined
        }
        className="transition-[max-height] duration-300 ease-in-out"
      >
        {children}
      </div>

      {showToggle && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setExpanded((v) => !v)}
            className={cn(
              "inline-flex items-center gap-2 text-sm uppercase tracking-widest",
              "hover:opacity-70 transition-opacity font-medium",
            )}
          >
            {expanded ? t("showLess") : t("showAll")}
          </button>
        </div>
      )}
    </div>
  );
}
