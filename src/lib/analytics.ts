import { publicEnv } from './env'

export type AnalyticsEventName =
  | 'page_view'
  | 'booking_lead_submit_started'
  | 'booking_lead_submit_succeeded'
  | 'booking_lead_submit_failed'
  | 'booking_duplicate_submit_blocked'
  | 'booking_retry_requested'
  | 'contact_submit_started'
  | 'contact_submit_succeeded'
  | 'contact_submit_failed'
  | 'contact_duplicate_submit_blocked'
  | 'contact_retry_requested'

export interface AnalyticsEvent {
  name: AnalyticsEventName
  payload: Record<string, unknown>
}

export function createAnalytics({
  enabled,
  mode,
  dispatch,
}: {
  enabled: boolean
  mode: 'off' | 'console'
  dispatch?: (event: AnalyticsEvent) => void
}) {
  const emit = dispatch ?? defaultDispatch(mode)

  return {
    track(name: AnalyticsEventName, payload: Record<string, unknown>) {
      if (!enabled) {
        return
      }

      emit({ name, payload })
    },
  }
}

function defaultDispatch(mode: 'off' | 'console') {
  return (event: AnalyticsEvent) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent<AnalyticsEvent>('purity:analytics', { detail: event }))
    }

    if (mode === 'console') {
      console.info('[analytics]', event.name, event.payload)
    }
  }
}

export const analytics = createAnalytics({
  enabled: publicEnv.analyticsMode !== 'off',
  mode: publicEnv.analyticsMode,
})
