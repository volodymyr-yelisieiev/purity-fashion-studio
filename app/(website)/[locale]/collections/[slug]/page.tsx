import {
  getAvailableLocales,
  getPayload,
  getCollectionBySlug,
  type Locale,
} from "@/lib/payload";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import type { Media as MediaType, Product } from "@/payload-types";
import { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";
import { draftMode } from "next/headers";
import { logger } from "@/lib/logger";
import {
  LanguageFallback,
  Button,
  Card,
  CardImage,
  CardBody,
  CardPrice,
  H2,
  Body,
} from "@/components/ui";
import { Section, Container, Grid } from "@/components/layout";
import { HeroSection } from "@/components/sections";
import {
  FadeInStagger,
  FadeInStaggerContainer,
} from "@/components/animations/FadeInStagger";

interface CollectionDetailPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

export async function generateStaticParams() {
  const payload = await getPayload();

  let collections;
  try {
    collections = await payload.find({
      collection: "lookbooks",
      limit: 100,
    });
  } catch (err) {
    // If the schema is out-of-sync (missing columns) or DB is unavailable,
    // don't fail the entire build. Return no params so pages can still build.
    // The `prebuild` migration (added to package.json) should ensure schema is applied on CI.
    logger.error("generateStaticParams: failed to fetch lookbooks —", err);
    return [];
  }

  const locales = ["en", "uk", "ru"];

  return collections.docs
    .filter((item) => item.slug)
    .flatMap((item) =>
      locales.map((locale) => ({
        locale,
        slug: item.slug,
      }))
    );
}

export async function generateMetadata({
  params,
}: CollectionDetailPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const { isEnabled: isDraft } = await draftMode();
  const t = await getTranslations({ locale, namespace: "collections" });
  const collection = await getCollectionBySlug(slug, locale as Locale, isDraft);

  if (!collection) {
    const availableLocales = await getAvailableLocales(
      "lookbooks",
      slug,
      isDraft
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
      collection.meta?.title || `${collection.name} | PURITY Fashion Studio`,
    description: collection.meta?.description || collection.description || "",
    path: `/collections/${slug}`,
    image:
      typeof collection.meta?.image === "object"
        ? collection.meta?.image?.url || undefined
        : undefined,
    locale,
  });
}

export default async function CollectionDetailPage({
  params,
}: CollectionDetailPageProps) {
  const { slug, locale } = await params;
  const { isEnabled: isDraft } = await draftMode();
  const t = await getTranslations({ locale, namespace: "collections" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const collection = await getCollectionBySlug(slug, locale as Locale, isDraft);

  if (!collection) {
    const availableLocales = await getAvailableLocales(
      "lookbooks",
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
          basePath="/collections"
          backLink={{ href: "/collections", label: t("back") }}
        />
      );
    }
    notFound();
  }

  const hasContent = (value?: string | null) =>
    Boolean(value && value.toString().trim().length > 0);
  const primaryDescription = collection.description;

  if (!hasContent(collection.name) || !hasContent(primaryDescription)) {
    const availableLocales = await getAvailableLocales(
      "lookbooks",
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
          basePath="/collections"
          backLink={{ href: "/collections", label: t("back") }}
        />
      );
    }
    notFound();
  }

  // Use coverImage or first image from images array
  const coverImg = collection.coverImage as MediaType | null;
  const firstImage = collection.images?.[0];
  const fallbackImage = (
    typeof firstImage?.image === "object" ? firstImage.image : null
  ) as MediaType | null;
  const coverImage = coverImg || fallbackImage;
  const products = (collection.linkedProducts || []).filter(
    (p) => typeof p === "object"
  ) as Product[];

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <HeroSection
        title={collection.name}
        subtitle={collection.season ? t(`seasons.${collection.season}`) : ""}
        backgroundImage={coverImage?.url || ""}
      />

      {/* Overview - White */}
      <Section spacing="lg">
        <Container size="sm">
          <FadeInStaggerContainer>
            <FadeInStagger>
              <H2 className="mb-8">{tCommon("overview")}</H2>
            </FadeInStagger>
            <FadeInStagger>
              <Body className="text-xl font-light leading-relaxed text-foreground">
                {collection.description}
              </Body>
            </FadeInStagger>
          </FadeInStaggerContainer>
        </Container>
      </Section>

      {/* Details - Gray */}
      <Section spacing="lg">
        <Container size="sm">
          <Grid cols={3} gap="lg">
            {/* Materials */}
            <FadeInStaggerContainer>
              <FadeInStagger>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 block">
                  {t("materials")}
                </span>
                <Body className="text-lg font-light">
                  {collection.materials}
                </Body>
              </FadeInStagger>
            </FadeInStaggerContainer>

            {/* Sizes */}
            <FadeInStaggerContainer>
              <FadeInStagger>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 block">
                  {t("sizes")}
                </span>
                <Body className="text-lg font-light">{collection.sizes}</Body>
              </FadeInStagger>
            </FadeInStaggerContainer>

            {/* Care */}
            <FadeInStaggerContainer>
              <FadeInStagger>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 block">
                  {t("care")}
                </span>
                <Body className="text-lg font-light">
                  {collection.careInstructions}
                </Body>
              </FadeInStagger>
            </FadeInStaggerContainer>
          </Grid>
        </Container>
      </Section>

      {/* Lookbook Gallery - White */}
      {collection.images && collection.images.length > 0 && (
        <Section spacing="lg">
          <Container>
            <FadeInStaggerContainer>
              <FadeInStagger>
                <H2 className="mb-16 text-center">{t("lookbook")}</H2>
              </FadeInStagger>
              <Grid cols={2} gap="lg" className="max-w-6xl mx-auto">
                {collection.images.map((item, index) => {
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
                            `${collection.name} look ${index + 1}`
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

      {/* Products - Gray */}
      {products.length > 0 && (
        <Section spacing="lg" background="gray">
          <Container>
            <FadeInStaggerContainer>
              <FadeInStagger>
                <H2 className="mb-16 text-center">{t("featuredProducts")}</H2>
              </FadeInStagger>
              <Grid cols={4} gap="md">
                {products.map((product) => {
                  const productImageData = product.images?.[0];
                  const productImage = (
                    typeof productImageData?.image === "object"
                      ? productImageData.image
                      : null
                  ) as MediaType | null;

                  return (
                    <FadeInStagger key={product.id}>
                      <Card
                        hover
                        link={{
                          href: `/products/${product.slug}`,
                        }}
                      >
                        <CardImage
                          src={productImage?.url || ""}
                          alt={productImage?.alt || product.name}
                          aspect="portrait"
                        />
                        <CardBody title={product.name}>
                          <CardPrice
                            uah={product.pricing?.uah}
                            eur={product.pricing?.eur}
                          />
                        </CardBody>
                      </Card>
                    </FadeInStagger>
                  );
                })}
              </Grid>
            </FadeInStaggerContainer>
          </Container>
        </Section>
      )}

      {/* CTA - White */}
      <Section spacing="xl">
        <Container className="text-center">
          <FadeInStaggerContainer>
            <FadeInStagger>
              <H2 className="mb-8">{t("interestedInCollection")}</H2>
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
