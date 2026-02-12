import { getTranslations } from "next-intl/server";
import { getServices, getPageHeroMedia, type Locale } from "@/lib/payload";
import { generateSeoMetadata } from "@/lib/seo";
import { logger } from "@/lib/logger";
import { normalizeServices } from "@/lib/utils/safeData";
import {
  H2,
  H3,
  Lead,
  Body,
  Card,
  CardImage,
  CardBody,
  CardPrice,
} from "@/components/ui";
import { Section, Container, Grid } from "@/components/layout";
import { CTASection } from "@/components/sections";
import { EditorialHero } from "@/components/blocks/EditorialHero";
import {
  FadeInStagger,
  FadeInStaggerContainer,
} from "@/components/animations/FadeInStagger";
import type { Metadata } from "next";
import type { Service, Media } from "@/payload-types";
import { getMediaUrl } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "imagine" });

  return generateSeoMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/imagine",
  });
}

/**
 * Imagine Page
 *
 * Second stage of the PURITY methodology.
 * Shows shopping services and atelier services.
 */
export default async function ImaginePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "imagine" });
  const tPages = await getTranslations({ locale, namespace: "pages" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const heroMedia = await getPageHeroMedia("imagine");

  // Fetch all services
  let servicesResult;
  try {
    servicesResult = await getServices(locale as Locale);
  } catch (err) {
    logger.error("ImaginePage: failed to fetch services —", err);
    servicesResult = { docs: [] };
  }

  // Filter for imagine-phase services (Shopping Service, Atelier Service)
  const normalized = normalizeServices(servicesResult.docs || []);
  const imagineServices = normalized.filter(
    (service: Service) => service.category === "imagine",
  );

  return (
    <div className="flex flex-col w-full" data-hero-fullbleed>
      {/* 1. Hero Section */}
      <EditorialHero
        title={tPages("imagine.title")}
        subtitle={tPages("imagine.subtitle")}
        media={{
          url: heroMedia.url || "",
          alt: tPages("imagine.title"),
        }}
        theme="light"
      />

      {/* 2. FROM VISION TO REALITY - White background */}
      <Section spacing="lg">
        <Container size="md">
          <FadeInStaggerContainer className="mx-auto max-w-3xl text-center">
            <FadeInStagger>
              <div className="mb-12">
                <H2 className="mb-4">{t("intro.title")}</H2>
                <Lead>{t("intro.subtitle")}</Lead>
              </div>
            </FadeInStagger>
            <FadeInStagger>
              <Body className="mx-auto max-w-3xl text-center text-lg leading-relaxed">
                {t("intro.paragraph1")}
              </Body>
            </FadeInStagger>
          </FadeInStaggerContainer>
        </Container>
      </Section>

      {/* 3. IMAGINE SERVICES - Gray background */}
      <Section spacing="lg" background="gray">
        <Container>
          <div className="mx-auto max-w-2xl mb-12 text-center">
            <H2 className="mb-4">{t("shopping.title")}</H2>
            <Lead>{t("shopping.subtitle")}</Lead>
          </div>

          {imagineServices.length > 0 ? (
            <FadeInStaggerContainer>
              <Grid cols={2} gap="md">
                {imagineServices.map((service: Service) => {
                  const heroImage =
                    typeof service.heroImage === "object"
                      ? (service.heroImage as Media | null)
                      : null;
                  return (
                    <FadeInStagger key={service.id}>
                      <Card link={{ href: `/services/${service.slug}` }} hover>
                        <CardImage
                          src={getMediaUrl(heroImage?.url)}
                          alt={heroImage?.alt || service.title}
                          aspect="video"
                        />
                        <CardBody
                          title={service.title}
                          description={service.excerpt || ""}
                        >
                          <CardPrice
                            eur={service.pricing?.eur}
                            uah={service.pricing?.uah}
                            note={service.pricing?.priceNote}
                          />
                        </CardBody>
                      </Card>
                    </FadeInStagger>
                  );
                })}
              </Grid>
            </FadeInStaggerContainer>
          ) : (
            <div className="text-center py-16">
              <Body>{tCommon("noContent")}</Body>
            </div>
          )}
        </Container>
      </Section>

      {/* 4. THE ATELIER PROCESS - White background */}
      <Section spacing="lg">
        <Container size="md">
          <div className="mx-auto max-w-2xl mb-12 text-center">
            <H2 className="mb-4">{t("process.title")}</H2>
            <Lead>{t("process.subtitle")}</Lead>
          </div>

          <div className="relative">
            {/* Process Timeline */}
            <div className="hidden md:absolute md:left-1/2 md:top-0 md:h-full md:w-px md:-translate-x-1/2 md:bg-border md:block" />

            <FadeInStaggerContainer className="space-y-12">
              {[1, 2, 3, 4, 5].map((step) => (
                <FadeInStagger key={step}>
                  <div
                    className={`flex flex-col md:flex-row ${
                      step % 2 === 0 ? "md:flex-row-reverse" : ""
                    } items-center gap-8`}
                  >
                    <div
                      className={`flex-1 ${
                        step % 2 === 0 ? "md:text-left" : "md:text-right"
                      }`}
                    >
                      <H3 className="mb-2">{t(`process.step${step}.title`)}</H3>
                      <Body>{t(`process.step${step}.description`)}</Body>
                    </div>

                    <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-sm font-medium">
                      {String(step).padStart(2, "0")}
                    </div>

                    <div className="flex-1" />
                  </div>
                </FadeInStagger>
              ))}
            </FadeInStaggerContainer>
          </div>
        </Container>
      </Section>

      {/* 5. CTA SECTION - Gray background */}
      <CTASection
        title={t("cta.title")}
        description={t("cta.description")}
        ctaText={t("cta.button")}
        ctaLink="/create"
        variant="muted"
      />
    </div>
  );
}
