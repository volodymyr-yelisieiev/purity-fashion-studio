import { getTranslations } from "next-intl/server";
import type { Portfolio as PortfolioType, Media } from "@/payload-types";
import { getPayload, getPageHeroMedia } from "@/lib/payload";
import { hasContent } from "@/lib/utils";
import { EditorialHero } from "@/components/blocks/EditorialHero";
import { EmptyState, Lead, Card, CardImage, CardBody } from "@/components/ui";
import { Section, Container, Grid } from "@/components/layout";
import {
  FadeInStagger,
  FadeInStaggerContainer,
} from "@/components/animations/FadeInStagger";
import { generateSeoMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tPages = await getTranslations({ locale, namespace: "pages" });

  return generateSeoMetadata({
    title: `${tPages("portfolio.title")} | PURITY Fashion Studio`,
    description: tPages("portfolio.subtitle"),
    path: "/portfolio",
  });
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tPages = await getTranslations({ locale, namespace: "pages" });
  const tPortfolio = await getTranslations({ locale, namespace: "portfolio" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const heroMedia = await getPageHeroMedia("portfolio");

  const payload = await getPayload();
  const portfolioItems = await payload.find({
    collection: "portfolio",
    locale: locale as "en" | "ru" | "uk",
    fallbackLocale: false,
    limit: 50,
    sort: "-featured,-createdAt",
    where: {
      status: { equals: "published" },
    },
  });

  // Filter out items without content in current locale
  const filteredDocs = portfolioItems.docs.filter((doc) =>
    hasContent(doc.title),
  );

  if (filteredDocs.length === 0) {
    return (
      <>
        <EditorialHero
          title={tPages("portfolio.title")}
          subtitle={tPages("portfolio.subtitle")}
          media={{
            url: heroMedia.url || "",
            alt: tPages("portfolio.title"),
          }}
          theme="light"
        />
        <EmptyState
          title={tCommon("noContent")}
          description={tCommon("checkBackSoon")}
          action={{ label: tCommon("backToHome"), href: "/" }}
        />
      </>
    );
  }

  return (
    <>
      <EditorialHero
        title={tPages("portfolio.title")}
        subtitle={tPages("portfolio.subtitle")}
        media={{
          url: heroMedia.url || "",
          alt: tPages("portfolio.title"),
        }}
        theme="light"
      />

      {/* Intro Section */}
      <Section spacing="md">
        <Container size="sm" className="text-center">
          <FadeInStaggerContainer>
            <FadeInStagger>
              <Lead className="text-muted-foreground">
                {tCommon("portfolioIntro") ||
                  "Discover the transformations of our clients. Each story represents a unique journey to authentic personal style."}
              </Lead>
            </FadeInStagger>
          </FadeInStaggerContainer>
        </Container>
      </Section>

      {/* Portfolio Grid */}
      <Section spacing="lg" background="gray">
        <Container>
          <Grid cols={2} gap="lg">
            {filteredDocs.map((item) => {
              const portfolio = item as PortfolioType;
              const mainImage =
                typeof portfolio.mainImage === "object"
                  ? (portfolio.mainImage as Media | null)
                  : null;

              return (
                <FadeInStagger key={portfolio.id}>
                  <Card
                    hover
                    link={{
                      href: `/portfolio/${portfolio.slug}`,
                    }}
                  >
                    <CardImage
                      src={mainImage?.url || ""}
                      alt={mainImage?.alt || portfolio.title}
                      aspect="video"
                    />
                    <CardBody
                      category={
                        portfolio.category
                          ? tPortfolio(`categories.${portfolio.category}`)
                          : undefined
                      }
                      title={portfolio.title}
                      description={portfolio.excerpt || ""}
                    />
                  </Card>
                </FadeInStagger>
              );
            })}
          </Grid>
        </Container>
      </Section>
    </>
  );
}
