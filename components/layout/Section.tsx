import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
  background?: "white" | "gray" | "black";
  className?: string;
}

const spacingMap = {
  none: "",
  sm: "section-sm",
  md: "section-md",
  lg: "section-lg",
  xl: "section-xl",
};

const backgroundMap = {
  white: "bg-background",
  gray: "bg-muted/50",
  black: "bg-primary text-primary-foreground",
};

export function Section({
  children,
  spacing = "md",
  background = "white",
  className,
}: SectionProps) {
  return (
    <section
      className={cn(spacingMap[spacing], backgroundMap[background], className)}
    >
      {children}
    </section>
  );
}
