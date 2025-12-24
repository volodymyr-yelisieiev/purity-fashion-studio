import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { generateSeoMetadata } from "@/lib/seo";
import { logger } from "@/lib/logger";
import type { Metadata } from "next";
import {
  getAvailableLocales,
  getPayload,
  getServiceBySlug,
  type Locale,
} from "@/lib/payload";
import { draftMode } from "next/headers";
import { LanguageFallback, Button, H2, H3, Body } from "@/components/ui";
import { Section, Container, Grid } from "@/components/layout";
import { HeroSection } from "@/components/sections";
import {
  FadeInStagger,
  FadeInStaggerContainer,
} from "@/components/animations/FadeInStagger";
import { formatPrice } from "@/lib/utils";
import type { Service } from "@/payload-types";

interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateStaticParams() {
  const payload = await getPayload();

  let services;
  try {
    services = await payload.find({
      collection: "services",
      limit: 100,
      where: {
        status: { equals: "published" },
      },
    });
  } catch (err) {
    logger.error("generateStaticParams: failed to fetch services —", err);
    return [];
  }

  const locales = ["en", "uk", "ru"];

  return services.docs
    .filter((service) => service.slug)
    .flatMap((service) =>
      locales.map((locale) => ({
        locale,
        slug: service.slug,
      }))
    );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const { isEnabled: isDraft } = await draftMode();
  const t = await getTranslations({ locale, namespace: "services" });
  const service = await getServiceBySlug(slug, locale as Locale, isDraft);

  if (!service) {
    const availableLocales = await getAvailableLocales(
      "services",
      slug,
      isDraft
    );
    const title =
      availableLocales.length > 0 ? t("notAvailable") : t("serviceNotFound");
    return generateSeoMetadata({
      title: `${title} | PURITY Fashion Studio`,
      description: t("serviceNotFoundDescription"),
      locale,
    });
  }

  return generateSeoMetadata({
    title: service.meta?.title || `${service.title} | PURITY Fashion Studio`,
    description:
      service.meta?.description || service.excerpt || service.description || "",
    path: `/services/${slug}`,
    image:
      typeof service.meta?.image === "object"
        ? service.meta?.image?.url || undefined
        : undefined,
    locale,
  });
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug, locale } = await params;
  const { isEnabled: isDraft } = await draftMode();
  const t = await getTranslations({ locale, namespace: "services" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  let service = await getServiceBySlug(slug, locale as Locale, isDraft);

  if (!service) {
    const availableLocales = await getAvailableLocales(
      "services",
      slug,
      isDraft
    );
    if (availableLocales.length > 0) {
      return (
        <LanguageFallback
          title={t("notAvailable")}
          description={tCommon("viewInAvailableLanguages")}
          availableLocales={availableLocales}
          currentSlug={slug}
          basePath="/services"
          backLink={{ href: "/services", label: t("backToServices") }}
        />
      );
    }
    notFound();
  }

  const { normalizeService } = await import("@/lib/utils/safeData");
  service = normalizeService(service as Partial<Service>);

  // Format prices
  const priceUAH = service.pricing?.uah;
  const priceEUR = service.pricing?.eur;
  const priceNote = service.pricing?.priceNote;

  const prices = [];
  if (priceUAH) prices.push(formatPrice(priceUAH, "UAH"));
  if (priceEUR) prices.push(formatPrice(priceEUR, "EUR"));

  const priceDisplay =
    prices.length > 0 ? prices.join(" / ") : t("priceOnRequest");

  return (
    <main className="min-h-screen bg-background">
      {/* Hero - Full Width */}
      <HeroSection
        title={service.title}
        subtitle={service.excerpt || ""}
        backgroundImage={
          typeof service.heroImage === "object"
            ? service.heroImage?.url || ""
            : ""
        }
      />

      {/* Overview Section - White BG - CENTERED */}
      <Section spacing="lg">
        <Container size="sm">
          <FadeInStaggerContainer>
            <FadeInStagger>
              <H2 className="mb-8">{tCommon("overview")}</H2>
            </FadeInStagger>
            <FadeInStagger>
              <Body className="text-xl font-light leading-relaxed whitespace-pre-wrap">
                {service.description}
              </Body>
            </FadeInStagger>
          </FadeInStaggerContainer>
        </Container>
      </Section>

      {/* Details Grid - Gray BG - CENTERED */}
      <Section spacing="lg" background="gray">
        <Container size="sm">
          <Grid cols={2} gap="lg">
            {/* Duration */}
            {service.duration && (
              <FadeInStaggerContainer>
                <FadeInStagger>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 block">
                    {t("duration")}
                  </span>
                  <Body className="text-lg md:text-xl font-light">
                    {service.duration}
                  </Body>
                </FadeInStagger>
              </FadeInStaggerContainer>
            )}

            {/* Format */}
            {service.format && (
              <FadeInStaggerContainer>
                <FadeInStagger>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 block">
                    {t("format")}
                  </span>
                  <Body className="text-lg md:text-xl font-light">
                    {t(`formats.${service.format}`)}
                  </Body>
                </FadeInStagger>
              </FadeInStaggerContainer>
            )}

            {/* Price */}
            {(priceUAH || priceEUR) && (
              <FadeInStaggerContainer>
                <FadeInStagger>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 block">
                    {t("price")}
                  </span>
                  <Body className="text-lg md:text-xl font-light">
                    {priceDisplay}
                  </Body>
                  {priceNote && (
                    <Body className="text-sm text-muted-foreground italic mt-1">
                      {priceNote}
                    </Body>
                  )}
                </FadeInStagger>
              </FadeInStaggerContainer>
            )}

            {/* Category */}
            {service.category && (
              <FadeInStaggerContainer>
                <FadeInStagger>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 block">
                    {t("category")}
                  </span>
                  <Body className="text-lg md:text-xl font-light capitalize">
                    {t(`categories.${service.category}`)}
                  </Body>
                </FadeInStagger>
              </FadeInStaggerContainer>
            )}
          </Grid>
        </Container>
      </Section>

      {/* What's Included - White BG - CENTERED */}
      {service.includes && service.includes.length > 0 && (
        <Section spacing="lg">
          <Container size="sm">
            <FadeInStaggerContainer>
              <FadeInStagger>
                <H2 className="mb-12">{tCommon("whatsIncluded")}</H2>
              </FadeInStagger>
              <Grid cols={2} gap="md">
                {service.includes.map((item, i) => (
                  <FadeInStagger key={i}>
                    <div className="flex items-start gap-4">
                      <svg
                        className="w-5 h-5 md:w-6 md:h-6 text-foreground shrink-0 mt-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <Body className="text-base md:text-lg font-light">
                        {item.item}
                      </Body>
                    </div>
                  </FadeInStagger>
                ))}
              </Grid>
            </FadeInStaggerContainer>
          </Container>
        </Section>
      )}

      {/* Process/Steps - Gray BG - CENTERED */}
      {service.steps && service.steps.length > 0 && (
        <Section spacing="lg" background="gray">
          <Container size="sm">
            <FadeInStaggerContainer>
              <FadeInStagger>
                <H2 className="mb-16">{tCommon("process")}</H2>
              </FadeInStagger>
              <div className="space-y-12 md:space-y-16">
                {service.steps.map((step, i) => (
                  <FadeInStagger key={i}>
                    <div className="flex gap-6 md:gap-12">
                      <div className="text-3xl md:text-4xl font-serif font-light text-muted shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <div>
                        <H3 className="mb-4">{step.title}</H3>
                        <Body className="text-base md:text-lg text-muted-foreground leading-relaxed">
                          {step.description}
                        </Body>
                      </div>
                    </div>
                  </FadeInStagger>
                ))}
              </div>
            </FadeInStaggerContainer>
          </Container>
        </Section>
      )}

      {/* CTA - White BG - CENTERED */}
      <Section spacing="xl">
        <Container size="sm" className="text-center">
          <FadeInStaggerContainer>
            <FadeInStagger>
              <H2 className="mb-6">{tCommon("readyToStart")}</H2>
            </FadeInStagger>
            <FadeInStagger>
              <Body className="text-base md:text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
                {t("bookConsultationDesc") ||
                  "Book a consultation to learn more about this service and how we can help you."}
              </Body>
            </FadeInStagger>
            <FadeInStagger>
              <Button asChild variant="primary" size="lg">
                <Link href="/contact">{tCommon("bookConsultation")}</Link>
              </Button>
            </FadeInStagger>
          </FadeInStaggerContainer>
        </Container>
      </Section>
    </main>
  );
}
