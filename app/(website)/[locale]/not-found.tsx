import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { Button, H1, Lead } from "@/components/ui";
import { Container, PageHeader } from "@/components/layout";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "notFound" });

  return {
    title: t("title"),
    description: t("description"),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "notFound" });

  return (
    <PageHeader fullHeight centered>
      <Container size="sm">
        <div className="mb-8 font-serif text-9xl font-light text-muted-foreground/30">
          404
        </div>
        <H1 className="mb-4">{t("title")}</H1>
        <Lead className="mb-8 max-w-md">{t("description")}</Lead>
        <Button asChild size="lg">
          <Link href="/">{t("backHome")}</Link>
        </Button>
      </Container>
    </PageHeader>
  );
}
