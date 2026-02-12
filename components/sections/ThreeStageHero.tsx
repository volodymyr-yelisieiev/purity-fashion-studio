"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import {
  FadeInStagger,
  FadeInStaggerContainer,
} from "@/components/animations/FadeInStagger";
import { H1, H2, Lead, Button } from "@/components/ui";
import { Container, Section } from "@/components/layout";
import { cn, getMediaUrl } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

export interface HeroStage {
  key: "research" | "imagine" | "create";
  title: string;
  localizedTitle?: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  href: string;
}

export interface ThreeStageHeroProps {
  headline: string;
  subheadline?: string;
  stages: HeroStage[];
  ctaText: string;
  ctaLink: string;
  finalCtaTitle?: string;
  finalCtaDescription?: string;
  className?: string;
}

/* ── Stage Section subcomponent ──────────────────────── */
interface StageSectionProps {
  stage: HeroStage;
  sectionRef: React.RefObject<HTMLElement | null>;
  opacity: MotionValue<number>;
  y: MotionValue<number>;
  priority?: boolean;
  learnMoreLabel: string;
}

function StageSection({
  stage,
  sectionRef,
  opacity,
  y,
  priority,
  learnMoreLabel,
}: StageSectionProps) {
  return (
    <section ref={sectionRef} className="h-[150vh] relative">
      <div className="sticky top-(--header-height) h-usable flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={getMediaUrl(stage.backgroundImage)}
            alt={stage.title}
            fill
            sizes="100vw"
            className="object-cover blur-sm"
            quality={85}
            priority={priority}
          />
        </div>
        <div className="absolute inset-0 bg-background/60" />

        <motion.div
          className="relative z-10 container px-4 md:px-6 lg:px-8 text-center text-foreground"
          style={{ opacity, y }}
        >
          <H2 className="text-foreground mb-4">
            {stage.localizedTitle || stage.title}
          </H2>
          <p className="text-lg md:text-xl mb-2 text-foreground/80">
            {stage.subtitle}
          </p>
          <Lead className="text-foreground/90 max-w-2xl mx-auto mb-8">
            {stage.description}
          </Lead>
          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto border-foreground text-foreground hover:bg-foreground hover:text-background"
          >
            <Link href={stage.href}>{learnMoreLabel}</Link>
          </Button>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-foreground"
          style={{ opacity }}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </div>
    </section>
  );
}

export function ThreeStageHero({
  headline,
  subheadline,
  stages,
  ctaText,
  ctaLink,
  finalCtaTitle,
  finalCtaDescription,
  className,
}: ThreeStageHeroProps) {
  const t = useTranslations("common");

  const sectionRefs = [
    useRef<HTMLElement>(null),
    useRef<HTMLElement>(null),
    useRef<HTMLElement>(null),
  ];

  const scrollConfigs = sectionRefs.map((ref) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useScroll({ target: ref, offset: ["start start", "end end"] }),
  );

  // Opacity: first two stages fade in and out, last stage stays visible
  const opacityRanges: [number[], number[]][] = [
    [
      [0, 0.4, 0.6, 1],
      [0, 1, 1, 0],
    ],
    [
      [0, 0.4, 0.6, 1],
      [0, 1, 1, 0],
    ],
    [
      [0, 0.4, 1],
      [0, 1, 1],
    ],
  ];

  const opacities = scrollConfigs.map(({ scrollYProgress }, i) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTransform(scrollYProgress, opacityRanges[i][0], opacityRanges[i][1]),
  );

  const yValues = scrollConfigs.map(({ scrollYProgress }) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTransform(scrollYProgress, [0, 0.4], [50, 0]),
  );

  return (
    <div className={cn("w-full", className)}>
      {/* Section 1 - Intro */}
      <section className="h-usable flex items-center justify-center bg-background relative">
        <Container className="text-center">
          <FadeInStaggerContainer>
            <FadeInStagger>
              <H1 className="mb-4 md:mb-6">{headline}</H1>
            </FadeInStagger>
            {subheadline && (
              <FadeInStagger>
                <Lead className="max-w-2xl mx-auto">{subheadline}</Lead>
              </FadeInStagger>
            )}
          </FadeInStaggerContainer>
        </Container>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
          <ChevronDown className="w-6 h-6" />
        </div>
      </section>

      {/* Stage Sections */}
      {stages.map((stage, i) => (
        <StageSection
          key={stage.key}
          stage={stage}
          sectionRef={sectionRefs[i]}
          opacity={opacities[i]}
          y={yValues[i]}
          priority={i === 0}
          learnMoreLabel={t("learnMore")}
        />
      ))}

      {/* Section 5 - Final CTA */}
      <Section spacing="lg">
        <Container size="sm">
          <div className="mx-auto max-w-2xl text-center">
            <FadeInStaggerContainer>
              <FadeInStagger>
                <H2 className="mb-4">
                  {finalCtaTitle || "Ready for your transformation?"}
                </H2>
              </FadeInStagger>
              {finalCtaDescription && (
                <FadeInStagger>
                  <Lead className="mb-8">{finalCtaDescription}</Lead>
                </FadeInStagger>
              )}
              <FadeInStagger>
                <Button
                  asChild
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <Link href={ctaLink}>{ctaText}</Link>
                </Button>
              </FadeInStagger>
            </FadeInStaggerContainer>
          </div>
        </Container>
      </Section>
    </div>
  );
}
