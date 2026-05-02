import { Link } from '@tanstack/react-router'
import * as React from 'react'
import type { UiCopy } from '~/lib/types'
import { HeaderLink, LocaleSwitcher, type ShellColumn } from './Header'

export function NavSheet({
  open,
  setOpen,
  currentLocale,
  ui,
  bookingPath,
  bookingSearch,
  shellColumns,
  navSheetRef,
}: {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  currentLocale: 'uk' | 'en' | 'ru'
  ui: UiCopy
  bookingPath: string
  bookingSearch?: unknown
  shellColumns: ShellColumn[]
  navSheetRef: React.RefObject<HTMLDivElement | null>
}) {
  return (
    <div
      id="nav-sheet"
      ref={navSheetRef}
      className="nav-sheet-shell"
      role="dialog"
      aria-modal="true"
      aria-label={ui.accessibility.siteMenu}
      aria-hidden={!open}
      inert={!open}
      tabIndex={-1}
    >
      <div className="site-container site-container-wide nav-sheet-grid">
        {shellColumns.map((group) => {
          const items = group.items.filter(
            (item) => !('kind' in item && item.kind === 'internal' && item.to === bookingPath),
          )

          return (
            <div
              key={group.title}
              className={
                group.title === ui.navigation.contact
                  ? 'footer-column nav-sheet-animate nav-sheet-contact-column'
                  : 'footer-column nav-sheet-animate'
              }
            >
              <p className="eyebrow">{group.title}</p>
              {items.map((item) =>
                'kind' in item ? (
                  item.kind === 'internal' ? (
                    <Link
                      key={item.label}
                      to={item.to}
                      search={item.search as never}
                      className="footer-link"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      key={item.label}
                      className="footer-link"
                      href={item.to}
                      target={item.to.startsWith('http') ? '_blank' : undefined}
                      rel={item.to.startsWith('http') ? 'noreferrer' : undefined}
                    >
                      {item.label}
                    </a>
                  )
                ) : (
                  <HeaderLink
                    key={item.key}
                    itemKey={item.key}
                    to={item.to}
                    label={item.label}
                    className="footer-link"
                    onNavigate={() => setOpen(false)}
                  />
                ),
              )}
            </div>
          )
        })}

        <div className="nav-sheet-toolbar nav-sheet-animate">
          <LocaleSwitcher currentLocale={currentLocale} />
          <Link
            to={bookingPath}
            search={bookingSearch as never}
            className="button-primary"
            onClick={() => setOpen(false)}
          >
            {ui.actions.bookNow}
          </Link>
        </div>
      </div>
    </div>
  )
}
