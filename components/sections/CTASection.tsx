/**
 * CTA Section
 *
 * Large centered call-to-action section with clean design.
 *
 * @example
 * <CTASection
 *   title="Ready for transformation?"
 *   description="Start your journey today"
 *   ctaText="Book a Consultation"
 *   ctaLink="/contact"
 * />
 */

import { Link } from "@/i18n/navigation";
import { Button, H2, Lead } from "@/components/ui";
import { Container, Section } from "@/components/layout";
import {
  FadeInStagger,
  FadeInStaggerContainer,
} from "@/components/animations/FadeInStagger";

interface CTASectionProps {
  /** Main heading */
  title: string;
  /** Description text */
  description?: string;
  /** Button text */
  ctaText: string;
  /** Button link */
  ctaLink: string;
  /** Background variant */
  variant?: "default" | "muted";
  className?: string;
}

export function CTASection({
  title,
  description,
  ctaText,
  ctaLink,
  variant = "default",
  className,
}: CTASectionProps) {
  return (
    <Section
      spacing="lg"
      background={variant === "muted" ? "gray" : "white"}
      className={className}
    >
      <Container size="sm">
        <div className="mx-auto max-w-2xl text-center">
          <FadeInStaggerContainer>
            <FadeInStagger>
              <H2>{title}</H2>
            </FadeInStagger>
            {description && (
              <FadeInStagger>
                <Lead className="mt-4">{description}</Lead>
              </FadeInStagger>
            )}
            <FadeInStagger>
              <Button asChild variant="primary" size="lg" className="mt-8">
                <Link href={ctaLink}>{ctaText}</Link>
              </Button>
            </FadeInStagger>
          </FadeInStaggerContainer>
        </div>
      </Container>
    </Section>
  );
}
