import {
  getAvailableLocales,
  getPayload,
  getCourseBySlug,
  type Locale,
} from "@/lib/payload";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import type { Media as MediaType } from "@/payload-types";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/seo";
import { logger } from "@/lib/logger";
import { LanguageFallback, Button, H2, H3, Body } from "@/components/ui";
import { Section, Container, Grid } from "@/components/layout";
import { draftMode } from "next/headers";
import { HeroSection } from "@/components/sections";
import {
  FadeInStagger,
  FadeInStaggerContainer,
} from "@/components/animations/FadeInStagger";

interface CourseDetailPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

export async function generateStaticParams() {
  const payload = await getPayload();

  let courses;
  try {
    courses = await payload.find({
      collection: "courses",
      limit: 100,
      where: {
        status: { equals: "published" },
      },
    });
  } catch (err) {
    logger.error("generateStaticParams: failed to fetch courses —", err);
    return [];
  }

  const locales = ["en", "uk", "ru"];

  return courses.docs
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
}: CourseDetailPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const { isEnabled: isDraft } = await draftMode();
  const t = await getTranslations({ locale, namespace: "school" });
  const course = await getCourseBySlug(slug, locale as Locale, isDraft);

  if (!course) {
    const availableLocales = await getAvailableLocales(
      "courses",
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
    title: course.meta?.title || `${course.title} | PURITY Fashion Studio`,
    description: course.meta?.description || course.excerpt || "",
    path: `/school/${slug}`,
    image:
      typeof course.meta?.image === "object"
        ? course.meta?.image?.url || undefined
        : undefined,
    locale,
  });
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const { slug, locale } = await params;
  const { isEnabled: isDraft } = await draftMode();
  const t = await getTranslations({ locale, namespace: "school" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const course = await getCourseBySlug(slug, locale as Locale, isDraft);

  if (!course) {
    const availableLocales = await getAvailableLocales(
      "courses",
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
          basePath="/school"
          backLink={{ href: "/school", label: t("back") }}
        />
      );
    }
    notFound();
  }

  const hasContent = (value?: unknown) => {
    if (!value) return false;
    if (typeof value === "string") return value.trim().length > 0;
    return Boolean(value);
  };

  if (!hasContent(course.title) || !hasContent(course.excerpt)) {
    const availableLocales = await getAvailableLocales(
      "courses",
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
          basePath="/school"
          backLink={{ href: "/school", label: t("back") }}
        />
      );
    }
    notFound();
  }

  const featuredImage = course.featuredImage as MediaType | undefined;
  const duration = course.duration as
    | { value: number; unit: string }
    | undefined;
  const curriculum = (course.curriculum || []) as Array<{
    module: string;
    topics?: Array<{ topic: string }>;
  }>;
  const instructor = course.instructor as
    | { name: string; title?: string; bio?: string; photo?: MediaType }
    | undefined;

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <HeroSection
        title={course.title}
        subtitle={course.excerpt || ""}
        backgroundImage={featuredImage?.url || ""}
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
                {course.description && typeof course.description === "string"
                  ? course.description
                  : course.excerpt}
              </Body>
            </FadeInStagger>
          </FadeInStaggerContainer>
        </Container>
      </Section>

      {/* Course Details - Gray */}
      <Section spacing="lg" background="gray">
        <Container size="sm">
          <Grid cols={3} gap="lg">
            {/* Duration */}
            <FadeInStaggerContainer>
              <FadeInStagger>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 block">
                  {t("duration")}
                </span>
                <Body className="text-lg font-light">
                  {duration?.value} {duration?.unit}
                </Body>
              </FadeInStagger>
            </FadeInStaggerContainer>

            {/* Level */}
            <FadeInStaggerContainer>
              <FadeInStagger>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 block">
                  {t("level")}
                </span>
                <Body className="text-lg font-light">
                  {t(`levels.${course.level || "beginner"}`)}
                </Body>
              </FadeInStagger>
            </FadeInStaggerContainer>

            {/* Format */}
            <FadeInStaggerContainer>
              <FadeInStagger>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 block">
                  {t("format")}
                </span>
                <Body className="text-lg font-light">
                  {t(`formats.${course.format || "online"}`)}
                </Body>
              </FadeInStagger>
            </FadeInStaggerContainer>
          </Grid>
        </Container>
      </Section>

      {/* Prerequisites & Materials - White */}
      {(course.prerequisites || course.materials) && (
        <Section spacing="lg">
          <Container size="sm">
            <Grid cols={2} gap="lg">
              {course.prerequisites && (
                <FadeInStaggerContainer>
                  <FadeInStagger>
                    <H3 className="mb-6">{t("prerequisites")}</H3>
                    <Body className="text-lg font-light leading-relaxed text-muted-foreground">
                      {course.prerequisites}
                    </Body>
                  </FadeInStagger>
                </FadeInStaggerContainer>
              )}
              {course.materials && (
                <FadeInStaggerContainer>
                  <FadeInStagger>
                    <H3 className="mb-6">{t("materials")}</H3>
                    <Body className="text-lg font-light leading-relaxed text-muted-foreground">
                      {course.materials}
                    </Body>
                  </FadeInStagger>
                </FadeInStaggerContainer>
              )}
            </Grid>
          </Container>
        </Section>
      )}

      {/* Curriculum - Gray */}
      {curriculum.length > 0 && (
        <Section spacing="lg" background="gray">
          <Container size="sm">
            <FadeInStaggerContainer>
              <FadeInStagger>
                <H2 className="mb-16 text-center">{t("curriculum")}</H2>
              </FadeInStagger>
              <div className="space-y-12">
                {curriculum.map((module, index) => (
                  <FadeInStagger key={index}>
                    <div className="border-b border-border pb-8">
                      <H3 className="mb-4">
                        <span className="text-muted-foreground mr-4">
                          0{index + 1}
                        </span>
                        {module.module}
                      </H3>
                      {module.topics && module.topics.length > 0 && (
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {module.topics.map((topic, tIndex) => (
                            <li
                              key={tIndex}
                              className="text-muted-foreground font-light flex items-center gap-2"
                            >
                              <span className="w-1 h-1 bg-background-foreground/30" />
                              <Body className="text-sm">{topic.topic}</Body>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </FadeInStagger>
                ))}
              </div>
            </FadeInStaggerContainer>
          </Container>
        </Section>
      )}

      {/* Instructor - White */}
      {instructor && (
        <Section spacing="lg">
          <Container size="sm">
            <FadeInStaggerContainer>
              <div className="flex flex-col md:flex-row items-center gap-12">
                {instructor.photo && typeof instructor.photo === "object" && (
                  <FadeInStagger>
                    <div className="w-48 h-48 relative overflow-hidden grayscale">
                      <Image
                        src={instructor.photo.url || ""}
                        alt={instructor.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </FadeInStagger>
                )}
                <FadeInStagger>
                  <div className="text-center md:text-left">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">
                      {t("instructor")}
                    </span>
                    <H2 className="mb-4">{instructor.name}</H2>
                    <Body className="text-lg font-light text-muted-foreground leading-relaxed">
                      {instructor.bio}
                    </Body>
                  </div>
                </FadeInStagger>
              </div>
            </FadeInStaggerContainer>
          </Container>
        </Section>
      )}

      {/* CTA - Gray */}
      <Section spacing="xl" background="gray">
        <Container className="text-center">
          <FadeInStaggerContainer>
            <FadeInStagger>
              <H2 className="mb-8">{t("readyToStart")}</H2>
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
