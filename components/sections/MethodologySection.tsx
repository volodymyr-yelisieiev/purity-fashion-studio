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
    <section className="bg-neutral-50 px-6 py-24 dark:bg-neutral-900">
      <div className="mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <h2 className="font-display text-heading-lg font-light tracking-tight text-foreground">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-4 text-body-lg text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className="space-y-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex gap-8 border-b border-border pb-12 last:border-0"
            >
              <span className="font-display text-display-sm font-light text-muted-foreground/30">
                {step.number}
              </span>
              <div>
                <h3 className="font-display text-heading-md font-light text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 text-body-md text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
