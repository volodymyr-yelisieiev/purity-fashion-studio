"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { getMediaUrl } from "@/lib/utils";
import { H2, Lead } from "@/components/ui/Typography";
import { MethodologyMode } from "@/lib/store/MethodologyContext";

interface TimelineStep {
  stage: MethodologyMode;
  title: string;
  description: string;
  media: any;
}

interface MethodologyTimelineProps {
  title: string;
  steps: TimelineStep[];
}

export const MethodologyTimeline: React.FC<MethodologyTimelineProps> = ({
  title,
  steps,
}) => {
  const t = useTranslations("common");
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const stepsCount = steps.length;
  // Ensure 100dvw for horizontal items but ensure sticky behavior is stable
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0dvw", `-${(stepsCount - 1) * 100}dvw`],
  );

  return (
    <section
      ref={targetRef}
      className="relative bg-background"
      style={{ height: `${stepsCount * 120}vh` }}
    >
      <div className="sticky top-(--header-height) h-usable overflow-hidden w-full">
        {/* Fixed Title */}
        <div className="absolute top-12 left-0 right-0 z-20 text-center">
          <span className="label text-muted-foreground mb-4 block">
            {t("theJourney")}
          </span>
          <H2 className="editorial-title">{title}</H2>
        </div>

        <motion.div
          style={{ x, width: `${stepsCount * 100}dvw` }}
          className="flex h-full"
        >
          {steps.map((step, index) => (
            <StepItem key={index} step={step} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

interface StepItemProps {
  step: TimelineStep;
  index: number;
}

const StepItem: React.FC<StepItemProps> = ({ step, index }) => {
  const t = useTranslations("common");
  const tStages = useTranslations("common.stages");
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(
    scrollYProgress,
    [0.3, 0.45, 0.55, 0.7],
    [0, 1, 1, 0],
  );
  const y = useTransform(scrollYProgress, [0.3, 0.45], [50, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y }}
      className="relative flex h-full w-dvw shrink-0 items-center justify-center p-8 md:p-24 bg-background text-foreground"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-7xl w-full">
        {/* Media Column */}
        <div className="relative aspect-4/5 bg-muted overflow-hidden">
          {step.media?.url && (
            <Image
              src={getMediaUrl(step.media.url)}
              alt={step.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
          {/* Subtle index indicator */}
          <div className="absolute bottom-4 left-4 text-white/50 font-serif text-6xl opacity-30">
            0{index + 1}
          </div>
        </div>

        {/* Content Column */}
        <div className="space-y-6">
          <span className="label text-primary">{tStages(step.stage)}</span>
          <H2 className="heading-1">{step.title}</H2>
          <Lead className="body-lead">{step.description}</Lead>

          {/* Visual link or decoration */}
          <div className="pt-8 border-t border-border/50 max-w-xs">
            <p className="body-small italic">
              {t("partOfPhase", { stage: tStages(step.stage) })}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
