import { getTranslations } from "next-intl/server";
import { getServices, getPageHeroMedia, type Locale } from "@/lib/payload";
import { generateSeoMetadata } from "@/lib/seo";
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
  const heroMedia = await getPageHeroMedia("research");

  // Fetch research-category services
  const servicesResult = await getServices(locale as Locale);
  const normalizedServices = normalizeServices(servicesResult.docs || []);

  // Filter for research-related services (Personal Lookbook, Wardrobe Audit)
  const researchServices = normalizedServices.filter(
    (service: Service) => service.category === "research",
  );

  return (
    <div className="flex flex-col w-full" data-hero-fullbleed>
      {/* 1. Hero Section */}
      <EditorialHero
        title={tPages("research.title")}
        subtitle={tPages("research.subtitle")}
        media={{
          url: heroMedia.url || "",
          alt: tPages("research.title"),
        }}
        theme="light"
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
              <Body className="mx-auto max-w-3xl text-center text-lg leading-relaxed">
                {t("intro.paragraph1")}
              </Body>
              <Body className="mx-auto max-w-3xl text-center text-lg leading-relaxed">
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
          <div className="mx-auto max-w-2xl mb-12 text-center">
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
        ctaLink="/imagine"
        variant="muted"
      />
    </div>
  );
}
