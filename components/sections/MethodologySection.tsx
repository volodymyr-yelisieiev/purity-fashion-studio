import { H2, H3, Paragraph, Lead, Section, Container } from '@/components/ui'
import { FadeInStagger, FadeInStaggerContainer } from '@/components/animations/FadeInStagger'

interface MethodologyStep {
  number: string
  title: string
  description: string
}

interface MethodologySectionProps {
  title?: string
  subtitle?: string
  steps: MethodologyStep[]
}

export function MethodologySection({
  title = 'Our Methodology',
  subtitle,
  steps,
}: MethodologySectionProps) {
  return (
    <Section spacing="md" variant="muted">
      <Container size="md">
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
          <div className="space-y-12">
            {steps.map((step, index) => (
              <FadeInStagger key={index}>
                <div
                  className="flex flex-col md:flex-row gap-4 md:gap-8 border-b border-border pb-12 last:border-0"
                >
                  <span className="font-serif text-3xl md:text-4xl font-light text-muted-foreground/30">
                    {step.number}
                  </span>
                  <div>
                    <H3>{step.title}</H3>
                    <Paragraph className="mt-3">{step.description}</Paragraph>
                  </div>
                </div>
              </FadeInStagger>
            ))}
          </div>
        </FadeInStaggerContainer>
      </Container>
    </Section>
  )
}
