import * as React from 'react'

export const MOTION = {
  ease: 'power3.inOut',
  fast: 0.2,
  base: 0.36,
  slow: 0.56,
  stagger: 0.025,
  dockTravelViewport: 0.32,
  headerFade: 0.24,
  curtainEnter: 0.32,
  curtainHold: 0.18,
  curtainExit: 0.42,
} as const

export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false)

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      setPrefersReducedMotion(mediaQuery.matches)
    }

    update()
    mediaQuery.addEventListener('change', update)

    return () => {
      mediaQuery.removeEventListener('change', update)
    }
  }, [])

  return prefersReducedMotion
}
