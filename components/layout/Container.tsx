import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({
  children,
  size = "lg",
  className,
}: {
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
}) {
  return (
    <div
      className={cn(
        {
          "container-sm": size === "sm",
          "container-md": size === "md",
          "container-lg": size === "lg",
          "container-xl": size === "xl",
          "max-w-full px-4 md:px-6 lg:px-8": size === "full",
        },
        className,
      )}
    >
      {children}
    </div>
  );
}
