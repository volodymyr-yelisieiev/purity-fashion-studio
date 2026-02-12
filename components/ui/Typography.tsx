import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TypographyProps {
  children: ReactNode;
  className?: string;
}

export function H1({ children, className }: TypographyProps) {
  return <h1 className={cn("heading-1", className)}>{children}</h1>;
}

export function H2({ children, className }: TypographyProps) {
  return <h2 className={cn("heading-2", className)}>{children}</h2>;
}

export function H3({ children, className }: TypographyProps) {
  return <h3 className={cn("heading-3", className)}>{children}</h3>;
}

export function Lead({ children, className }: TypographyProps) {
  return <p className={cn("body-lead", className)}>{children}</p>;
}

export function Body({ children, className }: TypographyProps) {
  return <p className={cn("body-base", className)}>{children}</p>;
}

export function Small({ children, className }: TypographyProps) {
  return <p className={cn("body-small", className)}>{children}</p>;
}
