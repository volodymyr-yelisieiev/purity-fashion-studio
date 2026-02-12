"use client";

import React, { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { getMediaUrl } from "@/lib/utils";
import { H1, Lead } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";

interface LiquidCinematicHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage: any;
  foregroundImage: any;
  revealIntensity?: "subtle" | "medium" | "bold";
  cta?: {
    label?: string;
    link?: string;
  };
}

export const LiquidCinematicHero: React.FC<LiquidCinematicHeroProps> = ({
  title,
  subtitle,
  backgroundImage,
  foregroundImage,
  cta,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", prefersReducedMotion ? "0%" : "8%"],
  );
  const foregroundY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", prefersReducedMotion ? "0%" : "-5%"],
  );
  const textY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", prefersReducedMotion ? "0%" : "-10%"],
  );

  // Whether to use the SVG liquid filter (skip on reduced motion)
  const liquidFilter = prefersReducedMotion ? "none" : "url(#liquid-reveal)";

  return (
    <section
      ref={containerRef}
      className="relative h-usable w-full overflow-hidden bg-black"
    >
      {/* Background Layer (Deep/Parallax) */}
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 z-0">
        {backgroundImage?.url && (
          <Image
            src={getMediaUrl(backgroundImage.url)}
            alt=""
            fill
            className="object-cover opacity-60 grayscale-[0.5] blur-[2px]"
            sizes="100vw"
            priority
          />
        )}
      </motion.div>

      {/* Foreground Subject Layer (Liquid Reveal) */}
      <motion.div
        style={{ y: foregroundY }}
        initial={{ opacity: 0, scale: 1.1, filter: liquidFilter }}
        animate={
          isInView
            ? { opacity: 1, scale: 1, filter: "none" }
            : { opacity: 0, scale: 1.1, filter: liquidFilter }
        }
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 z-10 flex items-center justify-center p-4 md:p-8 lg:p-24 will-change-[filter,transform]"
      >
        <div className="relative h-full w-full max-w-5xl">
          {foregroundImage?.url && (
            <Image
              src={getMediaUrl(foregroundImage.url)}
              alt={title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 90vw, (max-width: 1200px) 80vw, 1200px"
              priority
            />
          )}
        </div>
      </motion.div>

      {/* Content Overlay */}
      <motion.div
        style={{ y: textY }}
        className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-4 md:p-8"
      >
        <div className="w-full space-y-4 md:space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <H1 className="text-white drop-shadow-2xl">{title}</H1>
          </motion.div>

          {subtitle && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Lead className="text-white italic font-serif mx-auto max-w-2xl text-sm md:text-base lg:text-lg">
                {subtitle}
              </Lead>
            </motion.div>
          )}

          {cta?.label && cta?.link && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-white/10 text-white border-white/40 hover:bg-white hover:text-black transition-all duration-500 backdrop-blur-md"
              >
                <Link href={cta.link}>{cta.label}</Link>
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Bottom Gradient Fade */}
      <div className="absolute inset-x-0 bottom-0 h-24 md:h-48 bg-linear-to-t from-background to-transparent z-30" />
    </section>
  );
};
