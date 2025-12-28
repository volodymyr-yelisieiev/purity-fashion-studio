import { getTranslations } from "next-intl/server";
import { getServices, type Locale } from "@/lib/payload";
import { generateSeoMetadata } from "@/lib/seo";
import { logger } from "@/lib/logger";
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
import { HeroSection, CTASection } from "@/components/sections";
import {
  FadeInStagger,
  FadeInStaggerContainer,
} from "@/components/animations/FadeInStagger";
import type { Metadata } from "next";
import type { Service, Media } from "@/payload-types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "realisation" });

  return generateSeoMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/realisation",
  });
}

/**
 * Realisation Page
 *
 * Second stage of the PURITY transformation methodology.
 * Shows shopping services and atelier services.
 */
export default async function RealisationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "realisation" });
  const tPages = await getTranslations({ locale, namespace: "pages" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  // Fetch all services
  let servicesResult;
  try {
    servicesResult = await getServices(locale as Locale);
  } catch (err) {
    logger.error("RealisationPage: failed to fetch services —", err);
    servicesResult = { docs: [] };
  }

  // Filter for realisation-related services (Shopping Service, Atelier Service)
  const { normalizeServices } = await import("@/lib/utils/safeData");
  const normalized = normalizeServices(servicesResult.docs || []);
  const realisationServices = normalized.filter(
    (service: Service) => service.category === "realisation"
  );

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section */}
      <HeroSection
        title={tPages("realisation.title")}
        subtitle={tPages("realisation.subtitle")}
        backgroundImage="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&h=1080&fit=crop&q=85"
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
              <Body className="text-lg leading-relaxed">
                {t("intro.paragraph1")}
              </Body>
            </FadeInStagger>
          </FadeInStaggerContainer>
        </Container>
      </Section>

      {/* 3. REALISATION SERVICES - Gray background */}
      <Section spacing="lg" background="gray">
        <Container>
          <div className="mb-12 text-center">
            <H2 className="mb-4">{t("shopping.title")}</H2>
            <Lead>{t("shopping.subtitle")}</Lead>
          </div>

          {realisationServices.length > 0 ? (
            <FadeInStaggerContainer>
              <Grid cols={2} gap="md">
                {realisationServices.map((service: Service) => {
                  const heroImage =
                    typeof service.heroImage === "object"
                      ? (service.heroImage as Media | null)
                      : null;
                  return (
                    <FadeInStagger key={service.id}>
                      <Card link={{ href: `/services/${service.slug}` }} hover>
                        <CardImage
                          src={heroImage?.url || "/placeholder.jpg"}
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
          <div className="mb-12 text-center">
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
        ctaLink="/transformation"
        variant="muted"
      />
    </div>
  );
}
