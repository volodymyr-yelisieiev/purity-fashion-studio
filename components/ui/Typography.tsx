import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TypographyProps {
  children: ReactNode;
  className?: string;
}

export function H1({ children, className }: TypographyProps) {
  return (
    <h1
      className={cn(
        "text-3xl md:text-4xl lg:text-5xl xl:text-6xl",
        "font-light tracking-tight font-serif",
        "text-foreground",
        className,
      )}
    >
      {children}
    </h1>
  );
}

export function H2({ children, className }: TypographyProps) {
  return (
    <h2
      className={cn(
        "text-2xl md:text-3xl lg:text-4xl",
        "font-light tracking-tight font-serif",
        "text-foreground",
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function H3({ children, className }: TypographyProps) {
  return (
    <h3
      className={cn(
        "text-xl md:text-2xl lg:text-3xl",
        "font-light tracking-tight font-serif",
        "text-foreground",
        className,
      )}
    >
      {children}
    </h3>
  );
}

export function Lead({ children, className }: TypographyProps) {
  return (
    <p
      className={cn(
        "text-lg md:text-xl lg:text-2xl",
        "text-muted-foreground",
        "max-w-3xl mx-auto",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function Body({ children, className }: TypographyProps) {
  return (
    <p
      className={cn(
        "text-base md:text-lg",
        "text-muted-foreground",
        "leading-relaxed",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function Small({ children, className }: TypographyProps) {
  return (
    <p
      className={cn("text-sm md:text-base", "text-muted-foreground", className)}
    >
      {children}
    </p>
  );
}
