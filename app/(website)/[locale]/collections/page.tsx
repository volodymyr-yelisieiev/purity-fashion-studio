import { getTranslations } from "next-intl/server";
import type { Lookbook as CollectionType, Media } from "@/payload-types";
import { getPayload, getPageHeroMedia } from "@/lib/payload";
import { hasContent, getMediaUrl } from "@/lib/utils";
import { EditorialHero } from "@/components/blocks/EditorialHero";
import { EmptyState, Lead, Card, CardImage, CardBody } from "@/components/ui";
import { Section, Container, Grid } from "@/components/layout";
import {
  FadeInStagger,
  FadeInStaggerContainer,
} from "@/components/animations/FadeInStagger";

export default async function CollectionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tPages = await getTranslations({ locale, namespace: "pages" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const heroMedia = await getPageHeroMedia("collections");

  const payload = await getPayload();
  const collections = await payload.find({
    collection: "lookbooks",
    locale: locale as "en" | "ru" | "uk",
    fallbackLocale: false,
    limit: 50,
    sort: "-featured,-createdAt",
    where: {
      status: { equals: "published" },
    },
  });

  // Filter out items without content in current locale
  const filteredDocs = collections.docs.filter((doc) => hasContent(doc.name));

  if (filteredDocs.length === 0) {
    return (
      <>
        <EditorialHero
          title={tPages("collections.title")}
          subtitle={tPages("collections.subtitle")}
          media={{
            url: heroMedia.url || "",
            alt: tPages("collections.title"),
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
        title={tPages("collections.title")}
        subtitle={tPages("collections.subtitle")}
        media={{
          url: heroMedia.url || "",
          alt: tPages("collections.title"),
        }}
        theme="light"
      />

      {/* Intro Section */}
      <Section spacing="md">
        <Container size="sm" className="text-center">
          <FadeInStaggerContainer>
            <FadeInStagger>
              <Lead className="text-muted-foreground">
                {tCommon("collectionsIntro") ||
                  "Each collection represents a unique vision of elegance, crafted with attention to detail and timeless design."}
              </Lead>
            </FadeInStagger>
          </FadeInStaggerContainer>
        </Container>
      </Section>

      {/* Collections Grid */}
      <Section spacing="md" background="gray">
        <Container>
          <Grid cols={1} md={2} gap="md">
            {filteredDocs.map((item) => {
              const collection = item as CollectionType;
              const coverImage =
                typeof collection.coverImage === "object"
                  ? (collection.coverImage as Media | null)
                  : null;
              return (
                <Card
                  key={collection.id}
                  link={{ href: `/collections/${collection.slug}` }}
                  hover
                >
                  <CardImage
                    src={getMediaUrl(coverImage?.url)}
                    alt={coverImage?.alt || collection.name}
                    aspect="video"
                  />
                  <CardBody
                    title={collection.name}
                    description={collection.description || ""}
                    category={collection.season || ""}
                  />
                </Card>
              );
            })}
          </Grid>
        </Container>
      </Section>
    </>
  );
}
