import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

interface PageHeaderProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  /** Use full viewport height minus header */
  fullHeight?: boolean;
  /** Center content vertically */
  centered?: boolean;
  className?: string;
}

/**
 * PageHeader - Hero section wrapper with proper spacing
 *
 * @param fullHeight - Make section take most of viewport height
 * @param centered - Center content both horizontally and vertically
 */
export function PageHeader({
  children,
  fullHeight = false,
  centered = true,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "bg-background px-4 sm:px-6",
        fullHeight ? "min-h-[60vh] sm:min-h-[70vh]" : "py-12 sm:py-16 md:py-24",
        centered && "flex flex-col items-center justify-center text-center",
        className
      )}
      {...props}
    >
      {children}
    </header>
  );
}
