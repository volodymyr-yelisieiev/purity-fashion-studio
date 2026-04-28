import { useRouterState } from '@tanstack/react-router'
import { getUiCopy } from '~/lib/content'
import { buildLocalePath, segmentLocale } from '~/lib/i18n'
import type { Locale } from '~/lib/types'

type ErrorStateCopy = {
  backLabel: string
  tryAgainLabel: string
  notFoundTitle: string
  notFoundBody: string
}

const errorStateCopy: Record<Locale, ErrorStateCopy> = {
  uk: {
    backLabel: 'Назад',
    tryAgainLabel: 'Спробувати ще раз',
    notFoundTitle: 'Цього маршруту немає всередині світу PURITY.',
    notFoundBody:
      'Сторінка могла змінити адресу, локаль може бути недійсною, або потрібний editorial-блок ще не опубліковано.',
  },
  en: {
    backLabel: 'Go back',
    tryAgainLabel: 'Try again',
    notFoundTitle: 'This route does not exist inside the PURITY world.',
    notFoundBody:
      'The page may have moved, the locale may be invalid, or the requested editorial block is not published yet.',
  },
  ru: {
    backLabel: 'Назад',
    tryAgainLabel: 'Попробовать снова',
    notFoundTitle: 'Этого маршрута нет внутри мира PURITY.',
    notFoundBody:
      'Страница могла изменить адрес, локаль может быть недействительной, или нужный editorial-блок ещё не опубликован.',
  },
}

export function useErrorStateContent() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  const locale = segmentLocale(pathname)

  return {
    locale,
    homePath: buildLocalePath(locale),
    ui: getUiCopy(locale),
    copy: errorStateCopy[locale],
  }
}
