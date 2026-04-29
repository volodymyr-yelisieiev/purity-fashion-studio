import { Link } from '@tanstack/react-router'
import * as React from 'react'
import { BrandLogo } from '~/components/brand/BrandLogo'
import { buildLocalePath } from '~/lib/i18n'
import { optimizedImageSrc } from '~/lib/media-refs'
import { homeLayerMedia } from '~/lib/media-plan'
import { usePrefersReducedMotion } from '~/lib/motion'
import type { HomePageData, Locale, UiCopy } from '~/lib/types'

const HOME_SLOGANS: Record<Locale, [string, string, string]> = {
  uk: ['Відчуй', 'Уяви', 'Створи'],
  en: ['Feel', 'Imagine', 'Create'],
  ru: ['Ощути', 'Представь', 'Создай'],
}

const HOME_VERTICAL_LABEL: Record<Locale, string> = {
  uk: 'Персональний дизайнер гардероба',
  en: 'Personal wardrobe designer',
  ru: 'Персональный дизайнер гардероба',
}

const HOME_SCROLL_LABEL: Record<Locale, string> = {
  uk: 'Гортати',
  en: 'Scroll',
  ru: 'Листать',
}

function clamp01(value: number) {
  return Math.min(Math.max(value, 0), 1)
}

function stage(progress: number, start: number, end: number) {
  return clamp01((progress - start) / (end - start))
}

function setHeroState(root: HTMLElement, progress: number) {
  const line = stage(progress, 0.12, 0.38)
  const material = stage(progress, 0.32, 0.58)
  const silhouette = stage(progress, 0.52, 0.78)
  const copy = stage(progress, 0.7, 0.96)
  const logoFade = 1 - stage(progress, 0.02, 0.28)

  root.style.setProperty('--hero-p', progress.toFixed(3))
  root.style.setProperty('--hero-logo-opacity', logoFade.toFixed(3))
  root.style.setProperty('--hero-logo-scale', (1 - progress * 0.24).toFixed(3))
  root.style.setProperty('--hero-bg-opacity', stage(progress, 0.18, 0.45).toFixed(3))
  root.style.setProperty('--hero-line-progress', line.toFixed(3))
  root.style.setProperty('--hero-line-offset', `${1600 - 1600 * line}px`)
  root.style.setProperty('--hero-paper-opacity', stage(progress, 0.24, 0.48).toFixed(3))
  root.style.setProperty('--hero-material-opacity', material.toFixed(3))
  root.style.setProperty('--hero-material-y', `${(1 - material) * 48}px`)
  root.style.setProperty('--hero-silhouette-opacity', silhouette.toFixed(3))
  root.style.setProperty('--hero-silhouette-y', `${(1 - silhouette) * 34}px`)
  root.style.setProperty('--hero-copy-opacity', copy.toFixed(3))
  root.style.setProperty('--hero-copy-y', `${(1 - copy) * 24}px`)
}

export function LayeredHomeHero({
  locale,
  ui,
  home,
}: {
  locale: Locale
  ui: UiCopy
  home: HomePageData
}) {
  const rootRef = React.useRef<HTMLElement | null>(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const slogan = HOME_SLOGANS[locale]

  React.useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || typeof window === 'undefined') {
      return
    }

    const mediaQuery = window.matchMedia('(max-width: 767px)')
    let frame = 0

    const sync = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        if (prefersReducedMotion || mediaQuery.matches) {
          setHeroState(root, 1)
          return
        }

        const rect = root.getBoundingClientRect()
        const total = Math.max(root.offsetHeight - window.innerHeight, 1)
        const progress = clamp01(-rect.top / total)
        setHeroState(root, progress)
      })
    }

    sync()
    window.addEventListener('scroll', sync, { passive: true })
    window.addEventListener('resize', sync)
    mediaQuery.addEventListener('change', sync)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', sync)
      window.removeEventListener('resize', sync)
      mediaQuery.removeEventListener('change', sync)
    }
  }, [prefersReducedMotion])

  return (
    <section ref={rootRef} className="layered-home-hero" aria-labelledby="home-hero-title">
      <div className="layered-home-hero-sticky">
        <div className="layered-home-logo-stage" aria-hidden="true">
          <BrandLogo variant="extended" className="layered-home-logo" alt="" />
        </div>

        <img
          src={optimizedImageSrc(homeLayerMedia.bgStudio.src)}
          alt=""
          role="presentation"
          className="layered-home-bg"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <img
          src={optimizedImageSrc(homeLayerMedia.patternPaper.src)}
          alt=""
          role="presentation"
          className="layered-home-paper"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />

        <svg className="layered-home-pattern-line" viewBox="0 0 1440 900" aria-hidden="true">
          <path d="M 44 788 C 266 672 348 558 522 556 C 722 554 746 244 970 266 C 1160 284 1132 582 1392 488" />
          <path d="M 278 868 C 438 718 594 720 746 614 C 884 516 894 356 1078 330" />
        </svg>

        <img
          src={optimizedImageSrc(homeLayerMedia.silkFold.src)}
          alt=""
          role="presentation"
          className="layered-home-material"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <img
          src={optimizedImageSrc(homeLayerMedia.mannequinDrape.src)}
          alt=""
          role="presentation"
          className="layered-home-silhouette"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />

        <div className="layered-home-rail">
          <span>{HOME_VERTICAL_LABEL[locale]}</span>
        </div>
        <span className="layered-home-scroll">{HOME_SCROLL_LABEL[locale]}</span>

        <div className="layered-home-copy">
          <p className="eyebrow">{home.heroKicker.replaceAll('@', '')}</p>
          <h1 id="home-hero-title" className="layered-home-title">
            {slogan.map((word) => (
              <span key={word}>{word}</span>
            ))}
          </h1>
          <p className="layered-home-lead">{home.heroDescription}</p>
          <div className="layered-home-actions">
            <Link to={buildLocalePath(locale, '/book')} className="button-primary">
              {home.heroPrimaryCta}
            </Link>
            <Link to={buildLocalePath(locale, '/research')} className="button-secondary">
              {home.heroSecondaryCta || ui.nav.research}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
