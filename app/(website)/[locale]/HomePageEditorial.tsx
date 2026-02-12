"use client";

import { HorizontalMarquee } from "@/components/blocks/HorizontalMarquee";
import { MethodologyTimeline } from "@/components/blocks/MethodologyTimeline";
import { LiquidCinematicHero } from "@/components/blocks/LiquidCinematicHero";
import { Section, Container } from "@/components/layout";
import { H2, Lead, Button } from "@/components/ui";
import {
  FadeInStagger,
  FadeInStaggerContainer,
} from "@/components/animations/FadeInStagger";
import { Link } from "@/i18n/navigation";
import { PLACEHOLDER_IMAGE } from "@/lib/utils";
import type { MethodologyMode } from "@/lib/store/MethodologyContext";

interface ImageSlot {
  url: string;
  alt: string;
}

interface StageContent {
  localizedTitle: string;
  subtitle: string;
  description: string;
}

interface HomePageEditorialProps {
  headline: string;
  subheadline: string;
  media: {
    background: ImageSlot;
    foreground: ImageSlot;
    research: ImageSlot;
    imagine: ImageSlot;
    create: ImageSlot;
  };
  stages: {
    research: StageContent;
    imagine: StageContent;
    create: StageContent;
  };
  ctaTitle: string;
  ctaDescription: string;
  ctaText: string;
}

function img(slot: ImageSlot): ImageSlot {
  return slot.url
    ? slot
    : { url: PLACEHOLDER_IMAGE, alt: slot.alt || "PURITY" };
}

export function HomePageEditorial({
  headline,
  subheadline,
  media,
  stages,
  ctaTitle,
  ctaDescription,
  ctaText,
}: HomePageEditorialProps) {
  return (
    <div data-hero-fullbleed>
      {/* 1. Liquid Cinematic Hero — immersive entrance */}
      <div data-stage="research">
        <LiquidCinematicHero
          title={headline}
          subtitle={subheadline}
          backgroundImage={img(media.background)}
          foregroundImage={img(media.foreground)}
          revealIntensity="medium"
          cta={{ label: ctaText, link: "/contact" }}
        />
      </div>

      {/* 2. Brand Marquee — editorial rhythm break */}
      <HorizontalMarquee
        items={[
          { text: "@RESEARCH" },
          { text: "@IMAGINE" },
          { text: "@CREATE" },
          { text: "PURITY" },
          { text: "@RESEARCH" },
          { text: "@IMAGINE" },
          { text: "@CREATE" },
        ]}
        speed="slow"
      />

      {/* 3. Methodology Timeline — the three-stage adventure */}
      <div data-stage="imagine">
        <MethodologyTimeline
          title="The Adventure"
          steps={[
            {
              stage: "research" as MethodologyMode,
              title: stages.research?.localizedTitle || "Research",
              description: stages.research?.description,
              media: img(media.research),
            },
            {
              stage: "imagine" as MethodologyMode,
              title: stages.imagine?.localizedTitle || "Imagine",
              description: stages.imagine?.description,
              media: img(media.imagine),
            },
            {
              stage: "create" as MethodologyMode,
              title: stages.create?.localizedTitle || "Create",
              description: stages.create?.description,
              media: img(media.create),
            },
          ]}
        />
      </div>

      {/* 4. Final CTA */}
      <Section spacing="lg">
        <Container size="sm">
          <div className="mx-auto max-w-2xl text-center">
            <FadeInStaggerContainer>
              <FadeInStagger>
                <H2 className="mb-4">{ctaTitle}</H2>
              </FadeInStagger>
              <FadeInStagger>
                <Lead className="mb-8">{ctaDescription}</Lead>
              </FadeInStagger>
              <FadeInStagger>
                <Button
                  asChild
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <Link href="/contact">{ctaText}</Link>
                </Button>
              </FadeInStagger>
            </FadeInStaggerContainer>
          </div>
        </Container>
      </Section>
    </div>
  );
}
