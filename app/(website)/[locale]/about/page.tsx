import { getTranslations } from "next-intl/server";
import { HeroSection, MethodologySection } from "@/components/sections";
import { generateSeoMetadata } from "@/lib/seo";
import { H2, H3, Lead, Body } from "@/components/ui";
import { Section, Container, Grid } from "@/components/layout";
import {
  FadeInStagger,
  FadeInStaggerContainer,
} from "@/components/animations/FadeInStagger";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const tPages = await getTranslations({ locale, namespace: "pages" });

  return generateSeoMetadata({
    title: `${tPages("about.title")} | PURITY Fashion Studio`,
    description: tPages("about.subtitle"),
    path: "/about",
    locale,
  });
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  const tPages = await getTranslations({ locale, namespace: "pages" });

  const methodologySteps = [
    {
      number: "01",
      title: t("methodology.step1.title"),
      description: t("methodology.step1.description"),
    },
    {
      number: "02",
      title: t("methodology.step2.title"),
      description: t("methodology.step2.description"),
    },
    {
      number: "03",
      title: t("methodology.step3.title"),
      description: t("methodology.step3.description"),
    },
    {
      number: "04",
      title: t("methodology.step4.title"),
      description: t("methodology.step4.description"),
    },
  ];

  return (
    <main>
      <HeroSection
        title={tPages("about.title")}
        subtitle={tPages("about.subtitle")}
        backgroundImage="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop&q=85"
      />

      <Section spacing="md">
        <Container size="md">
          <FadeInStaggerContainer>
            <FadeInStagger>
              <H2 className="mb-8">{t("philosophy.title")}</H2>
            </FadeInStagger>
            <div className="space-y-6">
              <FadeInStagger>
                <Lead className="mx-0">{t("philosophy.paragraph1")}</Lead>
              </FadeInStagger>
              <FadeInStagger>
                <Lead className="mx-0">{t("philosophy.paragraph2")}</Lead>
              </FadeInStagger>
            </div>
          </FadeInStaggerContainer>
        </Container>
      </Section>

      <MethodologySection
        title={t("methodology.title")}
        subtitle={t("methodology.subtitle")}
        steps={methodologySteps}
        background="gray"
      />

      <Section spacing="md">
        <Container size="md" className="text-center">
          <FadeInStaggerContainer>
            <FadeInStagger>
              <H2 className="mb-12">{t("values.title")}</H2>
            </FadeInStagger>
            <Grid cols={3} gap="lg">
              <FadeInStagger>
                <div>
                  <H3 className="mb-4 text-xl md:text-2xl">
                    {t("values.quality.title")}
                  </H3>
                  <Body>{t("values.quality.description")}</Body>
                </div>
              </FadeInStagger>
              <FadeInStagger>
                <div>
                  <H3 className="mb-4 text-xl md:text-2xl">
                    {t("values.individuality.title")}
                  </H3>
                  <Body>{t("values.individuality.description")}</Body>
                </div>
              </FadeInStagger>
              <FadeInStagger>
                <div>
                  <H3 className="mb-4 text-xl md:text-2xl">
                    {t("values.sustainability.title")}
                  </H3>
                  <Body>{t("values.sustainability.description")}</Body>
                </div>
              </FadeInStagger>
            </Grid>
          </FadeInStaggerContainer>
        </Container>
      </Section>
    </main>
  );
}
