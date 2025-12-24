import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button, Card, CardImage, CardBody, CardPrice } from "@/components/ui";
import { Section, Container, Grid } from "@/components/layout";
import {
  FadeInStagger,
  FadeInStaggerContainer,
} from "@/components/animations/FadeInStagger";

interface Service {
  id: string;
  title: string;
  slug: string;
  description?: string;
  category: string;
  categoryLabel?: string;
  priceDisplay?: string | null;
  duration?: string | null;
  format?: string | null;
  image?: { url: string; alt?: string };
  pricing?: {
    eur?: number | null;
    uah?: number | null;
    priceNote?: string | null;
  };
}

interface ServicesPreviewProps {
  services: Service[];
  viewAllText?: string;
  viewAllLink?: string;
}

export function ServicesPreview({
  services,
  viewAllText,
  viewAllLink = "/services",
}: ServicesPreviewProps) {
  const t = useTranslations("common");

  return (
    <Section spacing="md">
      <Container>
        <FadeInStaggerContainer>
          <Grid cols={3} gap="md">
            {services.map((service) => (
              <FadeInStagger key={service.id}>
                <Card
                  hover
                  link={{ href: `/services/${service.slug}` }}
                  className="h-full flex flex-col"
                >
                  {service.image?.url && (
                    <CardImage
                      src={service.image.url}
                      alt={service.image.alt || service.title}
                      aspect="portrait"
                    />
                  )}
                  <CardBody
                    category={service.categoryLabel || service.category}
                    title={service.title}
                    description={service.description || undefined}
                    className="p-6"
                  >
                    <CardPrice
                      eur={service.pricing?.eur}
                      uah={service.pricing?.uah}
                      note={service.pricing?.priceNote}
                    />
                  </CardBody>
                </Card>
              </FadeInStagger>
            ))}
          </Grid>
          {viewAllLink && (
            <FadeInStagger>
              <div className="mt-16 text-center">
                <Button asChild variant="outline" size="lg">
                  <Link href={viewAllLink} prefetch={false}>
                    {viewAllText || t("viewAllServices")}
                  </Link>
                </Button>
              </div>
            </FadeInStagger>
          )}
        </FadeInStaggerContainer>
      </Container>
    </Section>
  );
}
