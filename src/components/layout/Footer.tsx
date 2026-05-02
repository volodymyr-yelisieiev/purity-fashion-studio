import { Link } from '@tanstack/react-router'
import { buildLocalePath } from '~/lib/i18n'
import type { Locale, UiCopy } from '~/lib/types'
import { HeaderLink, type ShellColumn } from './Header'

export function Footer({
  locale,
  shellColumns,
  ui,
}: {
  locale: Locale
  shellColumns: ShellColumn[]
  ui: UiCopy
}) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="site-container site-container-wide footer-nav-grid">
        {shellColumns.map((group) => (
          <div key={group.title} className="footer-column">
            <p className="eyebrow">{group.title}</p>
            {group.items.map((item) =>
              'kind' in item ? (
                item.kind === 'internal' ? (
                  <Link
                    key={item.label}
                    to={item.to}
                    search={item.search as never}
                    className="footer-link"
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
                />
              ),
            )}
          </div>
        ))}
      </div>
      <div className="footer-logo-band">
        <img src="/main_black.svg" alt={ui.brand} className="footer-logo-band-image" />
      </div>
      <div className="site-container site-container-wide footer-legal">
        <p className="footer-legal-copy">© {currentYear} {ui.labels.allRightsReserved}</p>
        <Link to={buildLocalePath(locale, '/privacy')} className="footer-legal-link">
          {ui.labels.privacyLink}
        </Link>
      </div>
    </footer>
  )
}
