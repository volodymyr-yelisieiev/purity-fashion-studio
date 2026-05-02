/// <reference types="vite/client" />
import type { QueryClient } from '@tanstack/react-query'
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useBlocker,
  useRouter,
  useRouterState,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import * as React from 'react'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import { NotFound } from '~/components/NotFound'
import { analytics } from '~/lib/analytics'
import { publicEnv } from '~/lib/env'
import { segmentLocale } from '~/lib/i18n'
import { MOTION, usePrefersReducedMotion } from '~/lib/motion'
import { buildDefaultSeoHead } from '~/lib/seo'
import appCss from '~/styles/app.css?url'

gsap.registerPlugin(ScrollTrigger)

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  head: () => {
    const seo = buildDefaultSeoHead()

    return {
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      ...seo.meta,
    ],
    links: [
      ...seo.links,
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
    ],
  }
  },
  errorComponent: (props) => (
    <RootDocument>
      <DefaultCatchBoundary {...props} />
    </RootDocument>
  ),
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const lang = segmentLocale(pathname)

  useLenis(pathname)

  React.useEffect(() => {
    analytics.track('page_view', {
      path: pathname,
      locale: lang,
    })
  }, [lang, pathname])

  return (
    <html lang={lang} className="bg-white">
      <head>
        <HeadContent />
      </head>
      <body className="app-body">
        {children}
        <RouteCurtain />
        {publicEnv.showRouterDevtools ? <TanStackRouterDevtools position="bottom-right" /> : null}
        <Scripts />
      </body>
    </html>
  )
}

function useLenis(pathname: string) {
  const lenisRef = React.useRef<Lenis | null>(null)

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches) {
      return
    }

    const lenis = new Lenis({
      lerp: 0.12,
      duration: 0.78,
      smoothWheel: true,
      autoResize: true,
    })
    lenisRef.current = lenis

    const update = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)
    lenis.on('scroll', ScrollTrigger.update)

    return () => {
      lenis.off('scroll', ScrollTrigger.update)
      gsap.ticker.remove(update)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    lenisRef.current?.scrollTo(0, { immediate: true, force: true })
  }, [pathname])
}

function RouteCurtain() {
  const router = useRouter()
  const prefersReducedMotion = usePrefersReducedMotion()
  const curtainRef = React.useRef<HTMLDivElement | null>(null)
  const logoRef = React.useRef<HTMLImageElement | null>(null)
  const timelineRef = React.useRef<gsap.core.Timeline | null>(null)
  const phaseRef = React.useRef<'idle' | 'covering' | 'waiting' | 'revealing'>('idle')
  const [phase, setPhaseState] = React.useState<'idle' | 'covering' | 'waiting' | 'revealing'>('idle')
  const pendingPathRef = React.useRef<string | null>(null)

  const blocker = useBlocker({
    shouldBlockFn: ({ current, next }) => current.pathname !== next.pathname,
    enableBeforeUnload: false,
    withResolver: true,
    disabled: phase !== 'idle',
  })

  const setPhase = React.useCallback((nextPhase: 'idle' | 'covering' | 'waiting' | 'revealing') => {
    phaseRef.current = nextPhase
    setPhaseState((currentPhase) => (currentPhase === nextPhase ? currentPhase : nextPhase))
  }, [])

  const resetCurtain = React.useCallback(() => {
    const curtain = curtainRef.current
    const logo = logoRef.current
    if (!curtain || !logo) {
      return
    }

    timelineRef.current?.kill()
    timelineRef.current = null
    pendingPathRef.current = null
    setPhase('idle')
    gsap.set(curtain, { display: 'none', y: 0, yPercent: -110, autoAlpha: 0, pointerEvents: 'none' })
    gsap.set(logo, { autoAlpha: 0, y: -18, scale: 0.94 })
  }, [setPhase])

  const revealCurtain = React.useCallback(() => {
    const curtain = curtainRef.current
    const logo = logoRef.current
    if (!curtain || !logo || phaseRef.current !== 'waiting') {
      return
    }

    timelineRef.current?.kill()
    timelineRef.current = null
    pendingPathRef.current = null
    setPhase('revealing')

    if (prefersReducedMotion) {
      resetCurtain()
      return
    }

    const timeline = gsap.timeline({
      onComplete: () => {
        resetCurtain()
      },
    })
    timelineRef.current = timeline
    timeline.to(logo, {
      autoAlpha: 0,
      y: 16,
      scale: 0.98,
      duration: MOTION.fast,
      ease: 'power2.out',
    })
    timeline.to(
      curtain,
      {
        y: 0,
        yPercent: -110,
        duration: MOTION.curtainExit,
        ease: MOTION.ease,
      },
      0,
    )
    timeline.to(
      curtain,
      {
        autoAlpha: 0,
        duration: MOTION.fast,
        ease: 'power2.out',
      },
      `-=${MOTION.fast}`,
    )
  }, [prefersReducedMotion, resetCurtain, setPhase])

  React.useLayoutEffect(() => {
    resetCurtain()
  }, [resetCurtain])

  React.useEffect(() => {
    return router.subscribe('onRendered', () => {
      if (phaseRef.current !== 'waiting') {
        return
      }

      const resolvedPath = router.state.resolvedLocation?.pathname ?? router.state.location.pathname
      if (pendingPathRef.current && resolvedPath !== pendingPathRef.current) {
        pendingPathRef.current = resolvedPath
      }

      revealCurtain()
    })
  }, [revealCurtain, router])

  React.useEffect(() => {
    if (blocker.status !== 'blocked' || phaseRef.current !== 'idle') {
      return
    }

    const curtain = curtainRef.current
    const logo = logoRef.current
    if (!curtain || !logo) {
      blocker.reset()
      return
    }

    timelineRef.current?.kill()
    timelineRef.current = null
    pendingPathRef.current = blocker.next.pathname

    const proceedNavigation = () => {
      setPhase('waiting')
      blocker.proceed()
    }

    if (prefersReducedMotion) {
      gsap.set(curtain, { display: 'grid', y: 0, yPercent: 0, autoAlpha: 1, pointerEvents: 'auto' })
      gsap.set(logo, { autoAlpha: 1, y: 0, scale: 1 })
      proceedNavigation()
      return
    }

    setPhase('covering')

    const timeline = gsap.timeline({
      onComplete: () => {
        proceedNavigation()
      },
    })
    timelineRef.current = timeline
    timeline.set(curtain, { display: 'grid', y: 0, yPercent: -110, autoAlpha: 1, pointerEvents: 'auto' })
    timeline.set(logo, { autoAlpha: 0, y: -18, scale: 0.94 })
    timeline.to(curtain, {
      y: 0,
      yPercent: 0,
      duration: MOTION.curtainEnter,
      ease: MOTION.ease,
    })
    timeline.to(
      logo,
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: MOTION.base,
        ease: MOTION.ease,
      },
      '-=0.18',
    )
  }, [blocker, prefersReducedMotion, setPhase])

  React.useEffect(() => {
    return () => {
      resetCurtain()
    }
  }, [resetCurtain])

  return (
    <div ref={curtainRef} className="route-curtain" aria-hidden="true">
      <img
        ref={logoRef}
        src="/extended_black.svg"
        alt=""
        role="presentation"
        aria-hidden="true"
        className="route-curtain-logo"
      />
    </div>
  )
}
