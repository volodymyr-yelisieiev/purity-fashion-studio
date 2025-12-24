import { Link } from '@/i18n/navigation'
import { H1, Lead, Container, Button } from '@/components/ui'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { FadeInStagger, FadeInStaggerContainer } from '@/components/animations/FadeInStagger'

interface HeroSectionProps {
  title: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
  backgroundImage?: string
  className?: string
}

export function HeroSection({
  title,
  subtitle,
  ctaText,
  ctaLink,
  backgroundImage,
  className,
}: HeroSectionProps) {
  return (
    <section className={cn("relative h-screen flex items-center", className)}>
      {backgroundImage && (
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={backgroundImage}
            alt={title}
            fill
            className="object-cover blur-sm scale-105"
            quality={85}
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}
      <Container size="md" className="relative z-10 py-24 text-center">
        <FadeInStaggerContainer>
          <FadeInStagger>
            <H1 className={cn(backgroundImage && "text-white")}>{title}</H1>
          </FadeInStagger>
          {subtitle && (
            <FadeInStagger>
              <Lead className={cn("mt-6", backgroundImage && "text-white/90")}>{subtitle}</Lead>
            </FadeInStagger>
          )}
          {ctaText && ctaLink && (
            <FadeInStagger>
              <Button asChild variant={backgroundImage ? "secondary" : "outline"} size="lg" className="mt-10">
                <Link href={ctaLink}>{ctaText}</Link>
              </Button>
            </FadeInStagger>
          )}
        </FadeInStaggerContainer>
      </Container>
    </section>
  )
}
