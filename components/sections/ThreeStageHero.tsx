'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { FadeInStagger, FadeInStaggerContainer } from '@/components/animations/FadeInStagger'
import { Container, Section, H1, H2, Lead, Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'

export interface HeroStage {
  key: 'research' | 'realisation' | 'transformation'
  title: string
  localizedTitle?: string
  subtitle: string
  description: string
  backgroundImage: string
  href: string
}

export interface ThreeStageHeroProps {
  headline: string
  subheadline?: string
  stages: HeroStage[]
  ctaText: string
  ctaLink: string
  finalCtaTitle?: string
  finalCtaDescription?: string
  className?: string
}

export function ThreeStageHero({
  headline,
  subheadline,
  stages,
  ctaText,
  ctaLink,
  finalCtaTitle,
  finalCtaDescription,
  className,
}: ThreeStageHeroProps) {
  const t = useTranslations('common')
  const section2Ref = useRef<HTMLElement>(null)
  const section3Ref = useRef<HTMLElement>(null)
  const section4Ref = useRef<HTMLElement>(null)
  
  const { scrollYProgress: progress2 } = useScroll({
    target: section2Ref,
    offset: ["start start", "end end"]
  })
  
  const { scrollYProgress: progress3 } = useScroll({
    target: section3Ref,
    offset: ["start start", "end end"]
  })
  
  const { scrollYProgress: progress4 } = useScroll({
    target: section4Ref,
    offset: ["start start", "end end"]
  })
  
  const opacity2 = useTransform(progress2, [0, 0.8], [0, 1])
  const opacity3 = useTransform(progress3, [0, 0.8], [0, 1])
  const opacity4 = useTransform(progress4, [0, 0.8], [0, 1])
  
  const y2 = useTransform(progress2, [0, 0.8], [100, 0])
  const y3 = useTransform(progress3, [0, 0.8], [100, 0])
  const y4 = useTransform(progress4, [0, 0.8], [100, 0])

  const scale2 = useTransform(progress2, [0, 0.8], [0.9, 1])
  const scale3 = useTransform(progress3, [0, 0.8], [0.9, 1])
  const scale4 = useTransform(progress4, [0, 0.8], [0.9, 1])
  
  return (
    <div className={cn('w-full', className)}>
      {/* Section 1 - Intro */}
      <section className="h-screen flex items-center justify-center bg-white relative">
        <Container className="text-center">
          <FadeInStaggerContainer>
            <FadeInStagger>
              <H1 className="mb-4 md:mb-6">
                {headline}
              </H1>
            </FadeInStagger>
            {subheadline && (
              <FadeInStagger>
                <Lead className="max-w-2xl mx-auto">
                  {subheadline}
                </Lead>
              </FadeInStagger>
            )}
          </FadeInStaggerContainer>
        </Container>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
          <ChevronDown className="w-6 h-6" />
        </div>
      </section>
      
      {/* Section 2 - RESEARCH */}
      <section ref={section2Ref} className="h-[150vh] relative">
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={stages[0].backgroundImage}
              alt={stages[0].title}
              fill
              className="object-cover scale-105 blur-sm"
              quality={85}
              priority
            />
          </div>
          <div className="absolute inset-0 bg-black/50" />
          
          <motion.div 
            className="relative z-10 container px-4 md:px-6 lg:px-8 text-center text-white"
            style={{ opacity: opacity2, y: y2, scale: scale2 }}
          >
            <H2 className="text-white mb-4">
              {stages[0].localizedTitle || stages[0].title}
            </H2>
            <p className="text-lg md:text-xl mb-2">{stages[0].subtitle}</p>
            <Lead className="text-white/90 max-w-2xl mx-auto mb-8">
              {stages[0].description}
            </Lead>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-black">
              <Link href={stages[0].href}>{t('learnMore')}</Link>
            </Button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white"
            style={{ opacity: opacity2 }}
          >
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </div>
      </section>
      
      {/* Section 3 - REALISATION */}
      <section ref={section3Ref} className="h-[150vh] relative">
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={stages[1].backgroundImage}
              alt={stages[1].title}
              fill
              className="object-cover scale-105 blur-sm"
              quality={85}
            />
          </div>
          <div className="absolute inset-0 bg-black/50" />
          
          <motion.div 
            className="relative z-10 container px-4 md:px-6 lg:px-8 text-center text-white"
            style={{ opacity: opacity3, y: y3, scale: scale3 }}
          >
            <H2 className="text-white mb-4">
              {stages[1].localizedTitle || stages[1].title}
            </H2>
            <p className="text-lg md:text-xl mb-2">{stages[1].subtitle}</p>
            <Lead className="text-white/90 max-w-2xl mx-auto mb-8">
              {stages[1].description}
            </Lead>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-black">
              <Link href={stages[1].href}>{t('learnMore')}</Link>
            </Button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white"
            style={{ opacity: opacity3 }}
          >
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </div>
      </section>
      
      {/* Section 4 - TRANSFORMATION */}
      <section ref={section4Ref} className="h-[150vh] relative">
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={stages[2].backgroundImage}
              alt={stages[2].title}
              fill
              className="object-cover scale-105 blur-sm"
              quality={85}
            />
          </div>
          <div className="absolute inset-0 bg-black/50" />
          
          <motion.div 
            className="relative z-10 container px-4 md:px-6 lg:px-8 text-center text-white"
            style={{ opacity: opacity4, y: y4, scale: scale4 }}
          >
            <H2 className="text-white mb-4">
              {stages[2].localizedTitle || stages[2].title}
            </H2>
            <p className="text-lg md:text-xl mb-2">{stages[2].subtitle}</p>
            <Lead className="text-white/90 max-w-2xl mx-auto mb-8">
              {stages[2].description}
            </Lead>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-black">
              <Link href={stages[2].href}>{t('learnMore')}</Link>
            </Button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white"
            style={{ opacity: opacity4 }}
          >
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </div>
      </section>
      
      {/* Section 5 - Final CTA */}
      <Section spacing="lg" variant="muted">
        <Container size="md">
          <div className="mx-auto max-w-2xl text-center">
            <FadeInStaggerContainer>
              <FadeInStagger>
                <H2 className="mb-4">
                  {finalCtaTitle || 'Ready for your transformation?'}
                </H2>
              </FadeInStagger>
              {finalCtaDescription && (
                <FadeInStagger>
                  <Lead className="mb-8">
                    {finalCtaDescription}
                  </Lead>
                </FadeInStagger>
              )}
              <FadeInStagger>
                <Button asChild variant="primary" size="lg">
                  <Link href={ctaLink}>{ctaText}</Link>
                </Button>
              </FadeInStagger>
            </FadeInStaggerContainer>
          </div>
        </Container>
      </Section>
    </div>
  )
}
