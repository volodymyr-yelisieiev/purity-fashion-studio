"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn, getMediaUrl } from "@/lib/utils";
import { Reveal } from "../animations/Reveal";

interface EditorialHeroProps {
  layout?: "full" | "split" | "overlap";
  media: any; // Payload Media object
  overlayMedia?: any;
  title: string;
  subtitle?: string;
  theme?: "light" | "dark" | "parchment";
}

export const EditorialHero: React.FC<EditorialHeroProps> = ({
  layout = "full",
  media,
  overlayMedia,
  title,
  subtitle,
  theme = "light",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const overlayY = useTransform(scrollYProgress, [0, 1], [0, -150]);

  return (
    <section
      ref={containerRef}
      className={cn(
        "relative w-full h-usable overflow-hidden flex items-center justify-center",
        theme === "dark"
          ? "bg-black text-white"
          : "bg-background text-foreground",
      )}
    >
      {/* Background Media */}
      <motion.div style={{ scale }} className="absolute inset-0 z-0">
        {media?.url && (
          <Image
            src={getMediaUrl(media.url)}
            alt={media.alt || title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/10" />
      </motion.div>

      {/* Content */}
      <div className="container-xl relative z-10 flex flex-col items-center text-center">
        <motion.div style={{ y, opacity }}>
          <Reveal direction="up" delay={0.2}>
            <h1 className="editorial-title not-italic mb-6">{title}</h1>
          </Reveal>
          {subtitle && (
            <Reveal direction="up" delay={0.4}>
              <p className="body-lead max-w-2xl mx-auto uppercase tracking-widest text-sm text-foreground opacity-100">
                {subtitle}
              </p>
            </Reveal>
          )}
        </motion.div>
      </div>

      {/* Floating Overlay Media (Overlap layout) */}
      {layout === "overlap" && overlayMedia?.url && (
        <motion.div
          style={{ y: overlayY }}
          className="absolute bottom-10 right-10 w-1/4 aspect-3/4 z-20 shadow-2xl hidden md:block"
        >
          <Image
            src={getMediaUrl(overlayMedia.url)}
            alt="Cinematic layer"
            fill
            className="object-cover border-10 border-white/10 backdrop-blur-sm"
            sizes="25vw"
          />
        </motion.div>
      )}
    </section>
  );
};
