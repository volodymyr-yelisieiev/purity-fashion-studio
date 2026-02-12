import {
  getPayload,
  getPageHeroMedia,
  getServices,
  type Locale,
} from "@/lib/payload";
import { generateSeoMetadata } from "@/lib/seo";
import { normalizeServices } from "@/lib/utils/safeData";
import {
  H2,
  Lead,
  Body,
  EmptyState,
  Card,
  CardImage,
  CardBody,
  CardPrice,
} from "@/components/ui";
import { Section, Container, Grid } from "@/components/layout";
import { EditorialHero } from "@/components/blocks/EditorialHero";
import {
  FadeInStagger,
  FadeInStaggerContainer,
} from "@/components/animations/FadeInStagger";
import { Link } from "@/i18n/navigation";
import { hasContent, getMediaUrl } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import type { Service, Media } from "@/payload-types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "createPage" });

  return generateSeoMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/create",
  });
}

/**
 * Create Page
 *
 * Third stage of the PURITY methodology.
 * Shows courses, retreats, photo meditation, and transformation portfolio.
 */
export default async function CreatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "createPage" });
  const tPages = await getTranslations({ locale, namespace: "pages" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const heroMedia = await getPageHeroMedia("create");

  const payload = await getPayload();

  // Fetch create-category services (Photo Meditation, Retreats, etc.)
  const servicesResult = await getServices(locale as Locale);
  const normalizedServices = normalizeServices(servicesResult?.docs || []);
  const createServices = normalizedServices.filter(
    (service: Service) => service.category === "create",
  );

  // Fetch courses for create section
  const { docs: courses } = await payload.find({
    collection: "courses",
    locale: locale as "en" | "uk" | "ru",
    fallbackLocale: false,
    where: { status: { equals: "published" } },
    sort: "-featured,-createdAt",
    limit: 3,
  });

  // Fetch transformation portfolio items (show featured portfolio as examples)
  const { docs: transformations } = await payload.find({
    collection: "portfolio",
    locale: locale as "en" | "uk" | "ru",
    fallbackLocale: false,
    where: {
      status: { equals: "published" },
    },
    sort: "-featured,-createdAt",
    limit: 6,
  });

  // Filter out items without content in current locale
  const filteredTransformations = transformations.filter((item) =>
    hasContent(item.title),
  );

  return (
    <div className="flex flex-col w-full" data-hero-fullbleed>
      {/* Hero Section */}
      <EditorialHero
        title={tPages("create.title")}
        subtitle={tPages("create.subtitle")}
        media={{
          url: heroMedia.url || "",
          alt: tPages("create.title"),
        }}
        theme="light"
      />

      {/* Introduction Section */}
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

      {/* Programs/Services Grid */}
      <Section spacing="lg" background="gray">
        <Container>
          <div className="mx-auto max-w-2xl mb-12 text-center">
            <H2 className="mb-4">{t("programs.title")}</H2>
            <Lead>{t("programs.subtitle")}</Lead>
          </div>

          {createServices.length > 0 || courses.length > 0 ? (
            <FadeInStaggerContainer>
              <Grid cols={1} md={3} gap="md">
                {/* Services */}
                {createServices.map((service: Service) => {
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

                {/* Courses */}
                {courses.map((course) => {
                  const coverImage = course.featuredImage as Media | undefined;
                  return (
                    <FadeInStagger key={course.id}>
                      <Card link={{ href: `/school/${course.slug}` }} hover>
                        <CardImage
                          src={getMediaUrl(coverImage?.url)}
                          alt={coverImage?.alt || course.title}
                          aspect="video"
                        />
                        <CardBody
                          title={course.title}
                          description={course.excerpt || ""}
                          category={
                            course.category?.replace("-", " ") || "Course"
                          }
                        >
                          <CardPrice
                            eur={course.pricing?.eur || undefined}
                            uah={course.pricing?.uah || undefined}
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

      {/* Transformation Portfolio */}
      <Section spacing="lg">
        <Container>
          <div className="mx-auto max-w-2xl mb-12 text-center">
            <H2 className="mb-4">{t("portfolio.title")}</H2>
            <Lead>{t("portfolio.subtitle")}</Lead>
          </div>

          {filteredTransformations.length === 0 ? (
            <EmptyState
              title={t("portfolio.emptyTitle")}
              description={t("portfolio.emptyDescription")}
            />
          ) : (
            <>
              <FadeInStaggerContainer>
                <Grid cols={1} md={3} gap="md">
                  {filteredTransformations.map((item) => {
                    const previewImage = item.mainImage as Media | undefined;

                    return (
                      <FadeInStagger key={item.id}>
                        <Card link={{ href: `/portfolio/${item.slug}` }} hover>
                          <CardImage
                            src={getMediaUrl(previewImage?.url)}
                            alt={previewImage?.alt || item.title}
                            aspect="video"
                          />
                          <CardBody
                            title={item.title}
                            description={item.excerpt || ""}
                            category={item.category || ""}
                          />
                        </Card>
                      </FadeInStagger>
                    );
                  })}
                </Grid>
              </FadeInStaggerContainer>

              <div className="mt-12 text-center">
                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground border border-foreground px-6 py-3 hover:bg-foreground hover:text-background transition-colors"
                >
                  {tCommon("viewAll")}
                </Link>
              </div>
            </>
          )}
        </Container>
      </Section>
    </div>
  );
}
