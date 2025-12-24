import { getTranslations } from "next-intl/server";
import { generateSeoMetadata } from "@/lib/seo";
import { H2 } from "@/components/ui";
import { Container, Section } from "@/components/layout";
import {
  FadeInStagger,
  FadeInStaggerContainer,
} from "@/components/animations/FadeInStagger";
import { HeroSection } from "@/components/sections";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfo } from "@/components/contact/ContactInfo";
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
    title: `${tPages("contact.title")} | PURITY Fashion Studio`,
    description: tPages("contact.subtitle"),
    path: "/contact",
    locale,
  });
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  const tPages = await getTranslations({ locale, namespace: "pages" });

  return (
    <main>
      <HeroSection
        title={tPages("contact.title")}
        subtitle={tPages("contact.subtitle")}
        backgroundImage="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1920&h=1080&fit=crop&q=85"
      />

      <Section>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            {/* Left column - Contact Info */}
            <FadeInStaggerContainer>
              <FadeInStagger>
                <H2 className="mb-8">{t("info.title")}</H2>
              </FadeInStagger>
              <FadeInStagger>
                <ContactInfo />
              </FadeInStagger>
            </FadeInStaggerContainer>

            {/* Right column - Contact Form */}
            <FadeInStaggerContainer>
              <FadeInStagger>
                <H2 className="mb-8">{t("form.title")}</H2>
              </FadeInStagger>
              <FadeInStagger>
                <ContactForm />
              </FadeInStagger>
            </FadeInStaggerContainer>
          </div>
        </Container>
      </Section>
    </main>
  );
}
