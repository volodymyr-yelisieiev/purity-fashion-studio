import { getTranslations } from "next-intl/server";
import type { Post as PostType, Media } from "@/payload-types";
import { getPosts, getPageHeroMedia } from "@/lib/payload";
import type { Locale } from "@/lib/payload";
import { hasContent } from "@/lib/utils";
import { EditorialHero } from "@/components/blocks/EditorialHero";
import {
  EmptyState,
  Lead,
  Card,
  CardImage,
  CardBody,
  Small,
} from "@/components/ui";
import { Section, Container, Grid, ExpandableGrid } from "@/components/layout";
import {
  FadeInStagger,
  FadeInStaggerContainer,
} from "@/components/animations/FadeInStagger";
import { generateSeoMetadata } from "@/lib/seo";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });

  return generateSeoMetadata({
    title: `${t("title")} | PURITY Fashion Studio`,
    description: t("subtitle"),
    path: "/blog",
    locale,
  });
}

function formatDate(dateString: string, locale: string): string {
  return new Date(dateString).toLocaleDateString(
    locale === "uk" ? "uk-UA" : locale === "ru" ? "ru-RU" : "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );
}

export default async function BlogPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const heroMedia = await getPageHeroMedia("blog");
  const postsResult = await getPosts(locale as Locale);

  const filteredDocs = postsResult.docs.filter((doc) => hasContent(doc.title));

  if (filteredDocs.length === 0) {
    return (
      <>
        <EditorialHero
          title={t("title")}
          subtitle={t("subtitle")}
          media={{
            url: heroMedia.url || "",
            alt: t("title"),
          }}
          theme="light"
        />
        <EmptyState
          title={t("noPosts")}
          description={t("noPostsDescription")}
          action={{ label: tCommon("backToHome"), href: "/" }}
        />
      </>
    );
  }

  return (
    <>
      <EditorialHero
        title={t("title")}
        subtitle={t("subtitle")}
        media={{
          url: heroMedia.url || "",
          alt: t("title"),
        }}
        theme="light"
      />

      {/* Intro */}
      <Section spacing="md">
        <Container size="sm" className="text-center">
          <FadeInStaggerContainer>
            <FadeInStagger>
              <Lead className="text-muted-foreground">{t("subtitle")}</Lead>
            </FadeInStagger>
          </FadeInStaggerContainer>
        </Container>
      </Section>

      {/* Post Grid */}
      <Section spacing="lg" background="gray">
        <Container>
          <ExpandableGrid>
            <Grid cols={2} gap="lg">
              {filteredDocs.map((item) => {
                const post = item as PostType;
                const heroImage =
                  typeof post.heroImage === "object"
                    ? (post.heroImage as Media | null)
                    : null;

                return (
                  <FadeInStagger key={post.id}>
                    <Card
                      hover
                      link={{
                        href: `/blog/${post.slug}`,
                      }}
                    >
                      <CardImage
                        src={heroImage?.url || ""}
                        alt={heroImage?.alt || post.title}
                        aspect="video"
                      />
                      <CardBody
                        category={
                          post.category
                            ? t(`categories.${post.category}`)
                            : undefined
                        }
                        title={post.title}
                        description={post.excerpt || ""}
                      />
                      <div className="pt-2 flex items-center justify-between">
                        <Small className="text-muted-foreground">
                          {t("by")} {post.author}
                        </Small>
                        <Small className="text-muted-foreground">
                          {formatDate(post.publishedAt, locale)}
                        </Small>
                      </div>
                    </Card>
                  </FadeInStagger>
                );
              })}
            </Grid>
          </ExpandableGrid>
        </Container>
      </Section>
    </>
  );
}
