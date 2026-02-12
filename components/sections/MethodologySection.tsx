import { H2, H3, Body, Lead } from "@/components/ui";
import { Section, Container } from "@/components/layout";
import {
  FadeInStagger,
  FadeInStaggerContainer,
} from "@/components/animations/FadeInStagger";

interface MethodologyStep {
  number: string;
  title: string;
  description: string;
}

interface MethodologySectionProps {
  title?: string;
  subtitle?: string;
  steps: MethodologyStep[];
  background?: "white" | "gray" | "black";
}

export function MethodologySection({
  title = "Our Methodology",
  subtitle,
  steps,
  background = "white",
}: MethodologySectionProps) {
  return (
    <Section spacing="md" background={background}>
      <Container size="sm">
        <FadeInStaggerContainer>
          <div className="mb-16 text-center">
            <FadeInStagger>
              <H2>{title}</H2>
            </FadeInStagger>
            {subtitle && (
              <FadeInStagger>
                <Lead className="mt-4">{subtitle}</Lead>
              </FadeInStagger>
            )}
          </div>
          <div className="relative mx-auto max-w-3xl">
            <div className="absolute left-5 top-6 bottom-6 w-px bg-border" />
            <div className="space-y-12">
              {steps.map((step, index) => (
                <FadeInStagger key={index}>
                  <div className="relative pl-14">
                    <div className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background font-serif text-sm font-light text-foreground">
                      {step.number}
                    </div>
                    <H3 className="text-left">{step.title}</H3>
                    <Body className="mt-3 text-left">{step.description}</Body>
                  </div>
                </FadeInStagger>
              ))}
            </div>
          </div>
        </FadeInStaggerContainer>
      </Container>
    </Section>
  );
}
