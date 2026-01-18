import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Grid({
  children,
  cols = 3,
  md,
  lg,
  gap = "md",
  className,
}: {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4;
  md?: 1 | 2 | 3 | 4;
  lg?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid",
        {
          "grid-cols-1": cols === 1,
          "grid-cols-2": cols === 2,
          "grid-cols-3": cols === 3,
          "grid-cols-4": cols === 4,

          "md:grid-cols-1": md === 1 || (!md && cols === 1),
          "md:grid-cols-2":
            md === 2 || (!md && (cols === 2 || cols === 3 || cols === 4)),
          "md:grid-cols-3": md === 3 || (!md && !lg && cols === 3),
          "md:grid-cols-4": md === 4 || (!md && !lg && cols === 4),

          "lg:grid-cols-1": lg === 1,
          "lg:grid-cols-2": lg === 2,
          "lg:grid-cols-3": lg === 3 || (!md && !lg && cols === 3),
          "lg:grid-cols-4": lg === 4 || (!md && !lg && cols === 4),

          "gap-4": gap === "sm",
          "gap-6 md:gap-8": gap === "md",
          "gap-8 md:gap-12": gap === "lg",
        },
        className,
      )}
    >
      {children}
    </div>
  );
}
