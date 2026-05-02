import { Link } from '@tanstack/react-router'
import { BrandLogo } from '~/components/brand/BrandLogo'
import { buildLocalePath } from '~/lib/i18n'
import { optimizedImageSrc } from '~/lib/media-refs'
import { homeLayerMedia } from '~/lib/media-plan'
import type { HomePageData, Locale, UiCopy } from '~/lib/types'

const HOME_ASSEMBLY_COPY: Record<Locale, { kicker: string; title: string; slogan: string }> = {
  uk: {
    kicker: 'Research / Realisation / Transformation',
    title: 'PURITY — персональний дизайнер гардероба',
    slogan: 'Не підібрано. Вирішено.',
  },
  en: {
    kicker: 'Research / Realisation / Transformation',
    title: 'PURITY — personal wardrobe designer',
    slogan: 'Not styled. Resolved.',
  },
  ru: {
    kicker: 'Research / Realisation / Transformation',
    title: 'PURITY — персональный дизайнер гардероба',
    slogan: 'Не подобрано. Решено.',
  },
}

const HOME_ASSEMBLY_STAGES: Record<Locale, Array<{ number: string; title: string; label: string }>> = {
  uk: [
    { number: '01', title: 'Research', label: 'розбір' },
    { number: '02', title: 'Realisation', label: 'збірка' },
    { number: '03', title: 'Transformation', label: 'образ' },
  ],
  en: [
    { number: '01', title: 'Research', label: 'dissection' },
    { number: '02', title: 'Realisation', label: 'construction' },
    { number: '03', title: 'Transformation', label: 'image' },
  ],
  ru: [
    { number: '01', title: 'Research', label: 'разбор' },
    { number: '02', title: 'Realisation', label: 'сборка' },
    { number: '03', title: 'Transformation', label: 'образ' },
  ],
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
  const copy = HOME_ASSEMBLY_COPY[locale]
  const stages = HOME_ASSEMBLY_STAGES[locale]
  const heroStages = [
    homeLayerMedia.mannequinBase,
    homeLayerMedia.constructionOverlay,
    homeLayerMedia.drapeOverlay,
  ] as const

  return (
    <section className="layered-home-hero" aria-labelledby="home-hero-title">
      <div className="layered-home-hero-sticky">
        <figure className="layered-home-sequence" aria-hidden="true">
          {heroStages.map((stageMedia, index) => (
            <img
              key={stageMedia.src}
              src={optimizedImageSrc(stageMedia.src)}
              alt=""
              role="presentation"
              className={`layered-home-stage layered-home-stage-${index + 1}`}
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          ))}
        </figure>

        <ol className="layered-home-stage-list" aria-label={copy.kicker}>
          {stages.map((stage, index) => (
            <li key={stage.title} className={`layered-home-stage-label layered-home-stage-label-${index + 1}`}>
              <span>{stage.number}</span>
              <strong>{stage.title}</strong>
              <small>{stage.label}</small>
            </li>
          ))}
        </ol>

        <div className="layered-home-copy">
          <p className="eyebrow">{copy.kicker}</p>
          <h1 id="home-hero-title" className="sr-only">{copy.title}</h1>
          <BrandLogo variant="extended" className="layered-home-brand-logo" alt={ui.brand} />
          <p className="layered-home-statement">{copy.slogan}</p>
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
