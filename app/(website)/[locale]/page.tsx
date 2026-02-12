import { getTranslations } from "next-intl/server";
import { generateSeoMetadata } from "@/lib/seo";
import { getHomepageMedia } from "@/lib/payload";
import type { Metadata } from "next";
import { HomePageEditorial } from "./HomePageEditorial";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  return generateSeoMetadata({
    title: `PURITY Fashion Studio | ${t("hero.title")}`,
    description: t("hero.subtitle"),
    path: "/",
    locale,
  });
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const media = await getHomepageMedia();

  return (
    <HomePageEditorial
      headline={t("hero.title")}
      subheadline={t("hero.subtitle")}
      media={media}
      stages={{
        research: {
          localizedTitle: t("stages.research.localizedTitle"),
          subtitle: t("stages.research.subtitle"),
          description: t("stages.research.description"),
        },
        imagine: {
          localizedTitle: t("stages.imagine.localizedTitle"),
          subtitle: t("stages.imagine.subtitle"),
          description: t("stages.imagine.description"),
        },
        create: {
          localizedTitle: t("stages.create.localizedTitle"),
          subtitle: t("stages.create.subtitle"),
          description: t("stages.create.description"),
        },
      }}
      ctaTitle={t("cta.title")}
      ctaDescription={t("cta.description")}
      ctaText={tCommon("bookConsultation")}
    />
  );
}
