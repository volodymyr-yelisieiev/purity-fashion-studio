import {
  getAvailableLocales,
  getPayload,
  getPostBySlug,
  type Locale,
} from "@/lib/payload";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import type { Media as MediaType } from "@/payload-types";
import { draftMode } from "next/headers";
import type { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";
import { logger } from "@/lib/logger";
import { LanguageFallback, Button, H2, Body, Small } from "@/components/ui";
import { Section, Container, BlockRenderer } from "@/components/layout";
import { EditorialHero } from "@/components/blocks/EditorialHero";
import {
  FadeInStagger,
  FadeInStaggerContainer,
} from "@/components/animations/FadeInStagger";

interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

function formatDate(dateString: string, locale: string): string {
  return new Date(dateString).toLocaleDateString(
    locale === "uk" ? "uk-UA" : locale === "ru" ? "ru-RU" : "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );
}

export async function generateStaticParams() {
  const payload = await getPayload();
  let posts;
  try {
    posts = await payload.find({ collection: "posts", limit: 100 });
  } catch (err) {
    logger.error("generateStaticParams: failed to fetch posts —", err);
    return [];
  }
  const locales = ["en", "uk", "ru"];
  return posts.docs
    .filter((item) => item.slug)
    .flatMap((item) => locales.map((locale) => ({ locale, slug: item.slug })));
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const { isEnabled: isDraft } = await draftMode();
  const t = await getTranslations({ locale, namespace: "blog" });
  const post = await getPostBySlug(slug, locale as Locale, isDraft);

  if (!post) {
    const availableLocales = await getAvailableLocales("posts", slug, isDraft);
    const title =
      availableLocales.length > 0 ? t("notAvailable") : t("notFound");
    return generateSeoMetadata({
      title: `${title} | PURITY Fashion Studio`,
      description: t("notFoundDescription"),
      locale,
    });
  }

  const heroImage =
    typeof post.heroImage === "object" ? (post.heroImage as MediaType) : null;

  return generateSeoMetadata({
    title: post.seo?.metaTitle || `${post.title} | PURITY Fashion Studio`,
    description: post.seo?.metaDescription || post.excerpt || "",
    path: `/blog/${slug}`,
    image: heroImage?.url || undefined,
    locale,
  });
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug, locale } = await params;
  const { isEnabled: isDraft } = await draftMode();
  const t = await getTranslations({ locale, namespace: "blog" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const post = await getPostBySlug(slug, locale as Locale, isDraft);

  if (!post) {
    const availableLocales = await getAvailableLocales("posts", slug, isDraft);
    if (availableLocales.length > 0) {
      return (
        <LanguageFallback
          title={t("notAvailable")}
          description={tCommon("viewInAvailableLanguages")}
          availableLocales={availableLocales}
          currentSlug={slug}
          basePath="/blog"
          backLink={{ href: "/blog", label: t("back") }}
        />
      );
    }
    notFound();
  }

  const heroImage = (
    typeof post.heroImage === "object" ? post.heroImage : null
  ) as MediaType | null;

  const hasLayout = post.layout && post.layout.length > 0;

  return (
    <main className="min-h-screen bg-background">
      {hasLayout ? (
        <BlockRenderer blocks={post.layout as any} />
      ) : (
        <>
          <EditorialHero
            title={post.title}
            subtitle={post.category ? t(`categories.${post.category}`) : ""}
            media={{
              url: heroImage?.url || "",
              alt: post.title,
            }}
            theme="light"
          />

          <Section spacing="lg">
            <Container size="sm">
              <FadeInStaggerContainer>
                <FadeInStagger>
                  <Body className="text-xl font-light leading-relaxed">
                    {post.excerpt}
                  </Body>
                </FadeInStagger>
              </FadeInStaggerContainer>
            </Container>
          </Section>
        </>
      )}

      {/* Author / Date / Category footer */}
      <Section spacing="lg" background="gray">
        <Container size="sm">
          <FadeInStaggerContainer>
            <FadeInStagger>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-8 border-t border-border">
                <div className="flex items-center gap-4">
                  {post.category && (
                    <span className="label uppercase tracking-widest text-muted-foreground">
                      {t(`categories.${post.category}`)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-6">
                  <Small className="text-muted-foreground">
                    {t("by")} {post.author}
                  </Small>
                  <Small className="text-muted-foreground">
                    {t("publishedOn")} {formatDate(post.publishedAt, locale)}
                  </Small>
                </div>
              </div>
            </FadeInStagger>
          </FadeInStaggerContainer>
        </Container>
      </Section>

      {/* CTA */}
      <Section spacing="xl">
        <Container className="text-center">
          <FadeInStaggerContainer>
            <FadeInStagger>
              <H2 className="mb-8">{tCommon("readyToStart")}</H2>
            </FadeInStagger>
            <FadeInStagger>
              <Button asChild variant="primary" size="lg">
                <Link href="/contact">{tCommon("contactUs")}</Link>
              </Button>
            </FadeInStagger>
          </FadeInStaggerContainer>
        </Container>
      </Section>
    </main>
  );
}
