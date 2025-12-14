import { H2, H3, Paragraph, Lead } from '@/components/ui/typography'
import { Section, Container } from '@/components/ui/layout-components'

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
        <div className="mb-16 text-center">
          <H2>{title}</H2>
          {subtitle && (
            <Lead className="mt-4">{subtitle}</Lead>
          )}
        </div>
        <div className="space-y-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex gap-8 border-b border-border pb-12 last:border-0"
            >
              <span className="font-serif text-4xl font-light text-muted-foreground/30">
                {step.number}
              </span>
              <div>
                <H3 className="text-2xl md:text-2xl">{step.title}</H3>
                <Paragraph className="mt-3">{step.description}</Paragraph>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
