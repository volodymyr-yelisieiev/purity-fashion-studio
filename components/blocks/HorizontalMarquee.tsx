"use client";

import React from "react";

interface HorizontalMarqueeProps {
  items: Array<{ text: string }>;
  speed?: "slow" | "normal" | "fast";
  direction?: "left" | "right";
}

export const HorizontalMarquee: React.FC<HorizontalMarqueeProps> = ({
  items,
  speed = "slow",
  direction = "left",
}) => {
  const duration = speed === "slow" ? 60 : speed === "normal" ? 40 : 20;

  // Render one copy of items — we'll triplicate via wrapper divs for seamless looping
  const renderItems = () =>
    items.map((item, index) => (
      <div key={index} className="flex items-center gap-12 md:gap-24 shrink-0">
        <span className="text-3xl md:text-5xl lg:text-7xl font-serif font-extralight uppercase tracking-widest">
          {item.text}
        </span>
        <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-current opacity-20 shrink-0" />
      </div>
    ));

  return (
    <section className="py-12 md:py-20 bg-foreground text-background overflow-hidden border-y border-border/10">
      <div
        className="flex whitespace-nowrap"
        style={{
          ["--marquee-duration" as string]: `${duration}s`,
          ["--marquee-direction" as string]:
            direction === "left" ? "normal" : "reverse",
        }}
      >
        {/* Three copies for seamless wrapping — CSS scrolls exactly 1/3 */}
        <div className="flex gap-12 md:gap-24 items-center shrink-0 animate-marquee will-change-transform pr-12 md:pr-24">
          {renderItems()}
        </div>
        <div
          className="flex gap-12 md:gap-24 items-center shrink-0 animate-marquee will-change-transform pr-12 md:pr-24"
          aria-hidden
        >
          {renderItems()}
        </div>
        <div
          className="flex gap-12 md:gap-24 items-center shrink-0 animate-marquee will-change-transform pr-12 md:pr-24"
          aria-hidden
        >
          {renderItems()}
        </div>
      </div>
    </section>
  );
};
