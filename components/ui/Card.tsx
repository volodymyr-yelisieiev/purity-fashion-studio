import { type ReactNode, type HTMLAttributes } from "react";
import { cn, getMediaUrl } from "@/lib/utils";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

/* ============================================
   Card Container
   ============================================ */

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "bordered" | "elevated" | "flat";
  padding?: "none" | "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  hover?: boolean | "scale";
  hoverable?: boolean;
  link?: {
    href: string;
    label?: string;
  };
}

export function Card({
  children,
  variant = "default",
  padding = "md",
  className,
  onClick,
  hover = false,
  hoverable,
  link,
  ...props
}: CardProps) {
  const isHoverable = hoverable || hover;
  const content = (
    <div
      className={cn(
        "transition-colors duration-300 overflow-hidden h-full flex flex-col rounded-none",
        {
          // Variants
          "bg-background border border-border": variant === "default",
          "border border-border bg-background": variant === "bordered",
          "shadow-sm border border-border bg-background":
            variant === "elevated",
          "bg-transparent": variant === "flat",

          // Padding
          "p-0": padding === "none",
          "p-4": padding === "sm",
          "p-6": padding === "md",
          "p-8": padding === "lg",

          // Hover
          "cursor-pointer hover:border-foreground/20": isHoverable,
        },
        className,
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );

  if (link) {
    return (
      <Link href={link.href} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
}

/* ============================================
   Card Header
   ============================================ */

export function CardHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("mb-4", className)}>{children}</div>;
}

/* ============================================
   Card Body
   ============================================ */

export function CardBody({
  children,
  title,
  description,
  category,
  className,
}: {
  children?: ReactNode;
  title?: string;
  description?: string;
  category?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex-1 flex flex-col", className)}>
      <div className="flex flex-col gap-2">
        {category && (
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {category}
          </span>
        )}
        {title && (
          <h3 className="font-serif text-xl font-light leading-tight text-foreground">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}
      </div>
      {children && <div className="mt-auto pt-4">{children}</div>}
    </div>
  );
}

/* ============================================
   Card Footer
   ============================================ */

export function CardFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mt-4 pt-4 border-t border-border", className)}>
      {children}
    </div>
  );
}

/* ============================================
   Card Image
   ============================================ */

interface CardImageProps {
  src: string;
  alt: string;
  aspect?: "portrait" | "landscape" | "square" | "video";
  aspectRatio?: string;
  priority?: boolean;
  className?: string;
}

const aspectRatios = {
  portrait: "aspect-4/5",
  landscape: "aspect-4/3",
  square: "aspect-square",
  video: "aspect-video",
};

export function CardImage({
  src,
  alt,
  aspect = "portrait",
  aspectRatio,
  priority = false,
  className,
}: CardImageProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-white rounded-none mb-4",
        aspectRatio ? `aspect-[${aspectRatio}]` : aspectRatios[aspect],
        className,
      )}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      <Image
        src={getMediaUrl(src)}
        alt={alt || "Card image"}
        fill
        priority={priority}
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}

/* ============================================
   Card Price
   ============================================ */

interface CardPriceProps {
  eur?: number | null;
  uah?: number | null;
  note?: string | null;
  className?: string;
}

export function CardPrice({ eur, uah, note, className }: CardPriceProps) {
  const hasPrice = eur || uah;

  if (!hasPrice) {
    return (
      <div className={cn("text-sm text-muted-foreground", className)}>
        Price on request
      </div>
    );
  }

  return (
    <div className={cn("text-sm", className)}>
      {note && <span className="text-muted-foreground mr-1">{note}</span>}
      {eur && <span className="font-medium text-foreground">€{eur}</span>}
      {eur && uah && <span className="text-muted-foreground mx-1">/</span>}
      {uah && (
        <span className="text-muted-foreground">₴{uah.toLocaleString()}</span>
      )}
    </div>
  );
}
