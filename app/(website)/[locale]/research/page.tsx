import { getTranslations } from "next-intl/server";
import { getServices, type Locale } from "@/lib/payload";
import { generateSeoMetadata } from "@/lib/seo";
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
  const t = await getTranslations({ locale, namespace: "research" });

  return generateSeoMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/research",
  });
}

/**
 * Research Page
 *
 * First stage of the PURITY transformation methodology.
 * Shows color analysis, silhouette strategy, and wardrobe review services.
 */
export default async function ResearchPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "research" });
  const tPages = await getTranslations({ locale, namespace: "pages" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  // Fetch research-category services
  const servicesResult = await getServices(locale as Locale);
  const { normalizeServices } = await import("@/lib/utils/safeData");
  const normalizedServices = normalizeServices(servicesResult.docs || []);

  // Filter for research-related services (Personal Lookbook, Wardrobe Audit)
  const researchServices = normalizedServices.filter(
    (service: Service) => service.category === "research"
  );

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section */}
      <HeroSection
        title={tPages("research.title")}
        subtitle={tPages("research.subtitle")}
        backgroundImage="https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=1920&h=1080&fit=crop&q=85"
      />

      {/* 2. WHY SECTION - White background */}
      <Section spacing="lg">
        <Container size="md">
          <FadeInStaggerContainer className="mx-auto max-w-3xl text-center">
            <FadeInStagger>
              <div className="mb-12">
                <H2 className="mb-4">{t("intro.title")}</H2>
                <Lead>{t("intro.subtitle")}</Lead>
              </div>
            </FadeInStagger>
            <FadeInStagger className="space-y-6">
              <Body className="text-lg leading-relaxed">
                {t("intro.paragraph1")}
              </Body>
              <Body className="text-lg leading-relaxed">
                {t("intro.paragraph2")}
              </Body>
            </FadeInStagger>
          </FadeInStaggerContainer>
        </Container>
      </Section>

      {/* 3. RESEARCH PROCESS - Gray background */}
      <Section spacing="lg" background="gray">
        <Container size="md">
          <div className="mb-12 text-center">
            <H2 className="mb-4">{t("process.title")}</H2>
            <Lead>{t("process.subtitle")}</Lead>
          </div>

          <FadeInStaggerContainer className="grid gap-8 md:grid-cols-3">
            {[1, 2, 3].map((step) => (
              <FadeInStagger key={step}>
                <div className="text-center">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-border text-lg font-light">
                    {String(step).padStart(2, "0")}
                  </div>
                  <H3 className="mb-2">{t(`process.step${step}.title`)}</H3>
                  <Body>{t(`process.step${step}.description`)}</Body>
                </div>
              </FadeInStagger>
            ))}
          </FadeInStaggerContainer>
        </Container>
      </Section>

      {/* 4. RESEARCH SERVICES - White background */}
      <Section spacing="lg">
        <Container>
          <div className="mb-12 text-center">
            <H2 className="mb-4">{t("services.title")}</H2>
            <Lead>{t("services.subtitle")}</Lead>
          </div>

          {researchServices.length > 0 ? (
            <FadeInStaggerContainer>
              <Grid cols={1} md={2} gap="md">
                {researchServices.map((service: Service) => {
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
              <Body className="mt-2">{tCommon("checkBackSoon")}</Body>
            </div>
          )}
        </Container>
      </Section>

      {/* 5. CTA SECTION - Gray background */}
      <CTASection
        title={t("cta.title")}
        description={t("cta.description")}
        ctaText={t("cta.button")}
        ctaLink="/realisation"
        variant="muted"
      />
    </div>
  );
}
