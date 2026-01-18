import {
  getAvailableLocales,
  getPayload,
  getPortfolioBySlug,
  type Locale,
} from "@/lib/payload";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import type { Media as MediaType, Service } from "@/payload-types";
import { draftMode } from "next/headers";
import { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";
import { logger } from "@/lib/logger";
import { LanguageFallback, Button, H2, Body, CardImage } from "@/components/ui";
import { Section, Container, Grid } from "@/components/layout";
import { HeroSection } from "@/components/sections";
import {
  FadeInStagger,
  FadeInStaggerContainer,
} from "@/components/animations/FadeInStagger";

interface PortfolioDetailPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

export async function generateStaticParams() {
  const payload = await getPayload();

  let portfolio;
  try {
    portfolio = await payload.find({
      collection: "portfolio",
      limit: 100,
    });
  } catch (err) {
    logger.error("generateStaticParams: failed to fetch portfolio —", err);
    return [];
  }

  const locales = ["en", "uk", "ru"];

  return portfolio.docs
    .filter((item) => item.slug)
    .flatMap((item) =>
      locales.map((locale) => ({
        locale,
        slug: item.slug,
      })),
    );
}

export async function generateMetadata({
  params,
}: PortfolioDetailPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const { isEnabled: isDraft } = await draftMode();
  const t = await getTranslations({ locale, namespace: "portfolio" });
  const portfolio = await getPortfolioBySlug(slug, locale as Locale, isDraft);

  if (!portfolio) {
    const availableLocales = await getAvailableLocales(
      "portfolio",
      slug,
      isDraft,
    );
    const title =
      availableLocales.length > 0 ? t("notAvailable") : t("notFound");
    return generateSeoMetadata({
      title: `${title} | PURITY Fashion Studio`,
      description: t("notFoundDescription"),
      locale,
    });
  }

  return generateSeoMetadata({
    title:
      portfolio.meta?.title || `${portfolio.title} | PURITY Fashion Studio`,
    description: portfolio.meta?.description || portfolio.description || "",
    path: `/portfolio/${slug}`,
    image:
      typeof portfolio.mainImage === "object"
        ? portfolio.mainImage?.url || undefined
        : undefined,
    locale,
  });
}

export default async function PortfolioDetailPage({
  params,
}: PortfolioDetailPageProps) {
  const { slug, locale } = await params;
  const { isEnabled: isDraft } = await draftMode();
  const t = await getTranslations({ locale, namespace: "portfolio" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const portfolio = await getPortfolioBySlug(slug, locale as Locale, isDraft);

  if (!portfolio) {
    const availableLocales = await getAvailableLocales(
      "portfolio",
      slug,
      isDraft,
    );
    if (availableLocales.length > 0) {
      return (
        <LanguageFallback
          title={t("notAvailable")}
          description={tCommon("viewInAvailableLanguages")}
          availableLocales={availableLocales}
          currentSlug={slug}
          basePath="/portfolio"
          backLink={{ href: "/portfolio", label: t("back") }}
        />
      );
    }
    notFound();
  }

  const mainImage = (
    typeof portfolio.mainImage === "object" ? portfolio.mainImage : null
  ) as MediaType | null;
  const servicesUsed = (portfolio.servicesUsed || []).filter(
    (s) => typeof s === "object",
  ) as Service[];

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <HeroSection
        title={portfolio.title}
        subtitle={
          portfolio.category ? t(`categories.${portfolio.category}`) : ""
        }
        backgroundImage={mainImage?.url || ""}
      />

      {/* Overview - White */}
      <Section spacing="lg">
        <Container size="sm">
          <FadeInStaggerContainer>
            <FadeInStagger>
              <H2 className="mb-8">{tCommon("overview")}</H2>
            </FadeInStagger>
            <FadeInStagger>
              <Body className="text-xl font-light leading-relaxed">
                {portfolio.description}
              </Body>
            </FadeInStagger>
          </FadeInStaggerContainer>
        </Container>
      </Section>

      {/* Gallery - Gray */}
      {portfolio.gallery && portfolio.gallery.length > 0 && (
        <Section spacing="lg">
          <Container>
            <FadeInStaggerContainer>
              <FadeInStagger>
                <H2 className="mb-16 text-center">{t("gallery")}</H2>
              </FadeInStagger>
              <Grid cols={2} gap="lg" className="max-w-6xl mx-auto">
                {portfolio.gallery.map((item, index) => {
                  const image =
                    typeof item.image === "object"
                      ? (item.image as MediaType)
                      : null;
                  if (!image?.url) return null;

                  return (
                    <FadeInStagger key={item.id || index}>
                      <div className="space-y-6">
                        <CardImage
                          src={image.url}
                          alt={
                            item.caption ||
                            `${portfolio.title} image ${index + 1}`
                          }
                          aspect="portrait"
                        />
                        {item.caption && (
                          <Body className="text-sm italic text-center">
                            {item.caption}
                          </Body>
                        )}
                      </div>
                    </FadeInStagger>
                  );
                })}
              </Grid>
            </FadeInStaggerContainer>
          </Container>
        </Section>
      )}

      {/* Services Used - White */}
      {servicesUsed.length > 0 && (
        <Section spacing="lg">
          <Container size="sm">
            <FadeInStaggerContainer>
              <FadeInStagger>
                <H2 className="mb-8">{t("servicesUsed")}</H2>
              </FadeInStagger>
              <FadeInStagger>
                <ul className="space-y-4">
                  {servicesUsed.map((service, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-foreground" />
                      <Link
                        href={`/services/${service.slug}`}
                        className="text-lg hover:opacity-70 transition-opacity"
                      >
                        {service.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </FadeInStagger>
            </FadeInStaggerContainer>
          </Container>
        </Section>
      )}

      {/* Testimonial - Gray */}
      {portfolio.testimonial?.quote && (
        <Section spacing="lg" background="gray">
          <Container size="sm" className="text-center">
            <FadeInStaggerContainer>
              <FadeInStagger>
                <H2 className="mb-12">{t("testimonial")}</H2>
              </FadeInStagger>
              <FadeInStagger>
                <blockquote className="text-2xl font-light italic leading-relaxed text-foreground mb-8">
                  &ldquo;{portfolio.testimonial.quote}&rdquo;
                </blockquote>
                {portfolio.testimonial.clientName && (
                  <cite className="text-sm uppercase tracking-widest text-muted-foreground not-italic">
                    — {portfolio.testimonial.clientName}
                  </cite>
                )}
              </FadeInStagger>
            </FadeInStaggerContainer>
          </Container>
        </Section>
      )}

      {/* CTA - White */}
      <Section spacing="xl">
        <Container className="text-center">
          <FadeInStaggerContainer>
            <FadeInStagger>
              <H2 className="mb-8">{t("readyForTransformation")}</H2>
            </FadeInStagger>
            <FadeInStagger>
              <Button asChild variant="primary" size="lg">
                <Link href="/contact">{t("startJourney")}</Link>
              </Button>
            </FadeInStagger>
          </FadeInStaggerContainer>
        </Container>
      </Section>
    </main>
  );
}
