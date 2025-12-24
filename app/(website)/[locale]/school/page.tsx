import { getPayload } from "@/lib/payload";
import { HeroSection } from "@/components/sections";
import {
  EmptyState,
  Lead,
  Card,
  CardImage,
  CardBody,
  CardPrice,
} from "@/components/ui";
import { Section, Container, Grid } from "@/components/layout";
import {
  FadeInStagger,
  FadeInStaggerContainer,
} from "@/components/animations/FadeInStagger";
import { getTranslations } from "next-intl/server";
import { hasContent } from "@/lib/utils";
import type { Media } from "@/payload-types";

export default async function SchoolPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "school" });
  const tPages = await getTranslations({ locale, namespace: "pages" });

  const payload = await getPayload();
  const { docs: courses } = await payload.find({
    collection: "courses",
    locale: locale as "en" | "uk" | "ru",
    fallbackLocale: false,
    where: { status: { equals: "published" } },
    sort: "-featured,-createdAt",
    limit: 100,
  });

  // Filter out items without content in current locale
  const filteredCourses = courses.filter((course) => hasContent(course.title));

  return (
    <>
      <HeroSection
        title={tPages("school.title")}
        subtitle={tPages("school.subtitle")}
        backgroundImage="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1920&h=1080&fit=crop&q=85"
      />

      {/* Intro Section */}
      <Section spacing="md">
        <Container size="sm" className="text-center">
          <FadeInStaggerContainer>
            <FadeInStagger>
              <Lead className="text-muted-foreground">
                {t("intro") ||
                  "Our courses and programs are designed to help you develop a deep understanding of personal style, color theory, and wardrobe building."}
              </Lead>
            </FadeInStagger>
          </FadeInStaggerContainer>
        </Container>
      </Section>

      {/* Courses Grid */}
      <Section spacing="lg" background="gray">
        <Container>
          {filteredCourses.length === 0 ? (
            <EmptyState
              title={t("empty.title")}
              description={t("empty.description")}
              action={{
                label: t("empty.backHome"),
                href: "/",
              }}
            />
          ) : (
            <Grid cols={3} gap="lg">
              {filteredCourses.map((course) => {
                const coverImage = course.featuredImage as Media | undefined;

                return (
                  <FadeInStagger key={course.id}>
                    <Card
                      hover
                      link={{
                        href: `/school/${course.slug}`,
                      }}
                    >
                      <CardImage
                        src={coverImage?.url || ""}
                        alt={coverImage?.alt || course.title}
                        aspect="video"
                      />
                      <CardBody
                        category={
                          course.category?.replace("-", " ") || "Course"
                        }
                        title={course.title}
                        description={course.excerpt || ""}
                      >
                        <CardPrice
                          uah={course.pricing?.uah || undefined}
                          eur={course.pricing?.eur || undefined}
                        />
                      </CardBody>
                    </Card>
                  </FadeInStagger>
                );
              })}
            </Grid>
          )}
        </Container>
      </Section>
    </>
  );
}
