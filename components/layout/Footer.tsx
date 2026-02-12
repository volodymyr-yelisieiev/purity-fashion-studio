import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { navItems } from "@/config/navigation";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-foreground text-background">
      {/* Top section — large serif wordmark */}
      <div className="border-b border-background/10">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-24 py-16 md:py-24">
          <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl font-extralight tracking-tight leading-none">
            PURITY
          </h2>
          <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-background/60">
            {t("description")}
          </p>
        </div>
      </div>

      {/* Main grid — 4 columns */}
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-24 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
          {/* Column 1: Navigation */}
          <div>
            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-background/40 block mb-6">
              {t("navigation")}
            </span>
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="text-sm font-light text-background/70 hover:text-background transition-colors duration-300"
                  >
                    {t(`links.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Contact */}
          <div>
            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-background/40 block mb-6">
              {t("contact")}
            </span>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:info@purity-fashion-studio.ua"
                  className="text-sm font-light text-background/70 hover:text-background transition-colors duration-300"
                >
                  info@purity-fashion-studio.ua
                </a>
              </li>
              <li>
                <a
                  href="tel:+380123456789"
                  className="text-sm font-light text-background/70 hover:text-background transition-colors duration-300"
                >
                  +380 12 345 67 89
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Social */}
          <div>
            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-background/40 block mb-6">
              {t("social")}
            </span>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://instagram.com/purity.fashion.studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-light text-background/70 hover:text-background transition-colors duration-300"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="5" />
                    <circle
                      cx="17.5"
                      cy="6.5"
                      r="1"
                      fill="currentColor"
                      stroke="none"
                    />
                  </svg>
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com/purity.fashion.studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-light text-background/70 hover:text-background transition-colors duration-300"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://pinterest.com/purity.fashion.studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-light text-background/70 hover:text-background transition-colors duration-300"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M8 12a4 4 0 118 0c0 2.5-1.5 5-3 6.5l-1-4" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  Pinterest
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Studio Hours */}
          <div>
            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-background/40 block mb-6">
              {t("studioHours")}
            </span>
            <ul className="space-y-3 text-sm font-light text-background/70">
              <li>{t("weekdays")}</li>
              <li>{t("weekends")}</li>
              <li className="pt-2 text-background/40">{t("byAppointment")}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar — copyright */}
      <div className="border-t border-background/10">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-24 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs font-light text-background/40">
            © {new Date().getFullYear()} {t("rights")}
          </p>
          <p className="text-xs font-light text-background/40 tracking-widest uppercase">
            Kyiv, Ukraine
          </p>
        </div>
      </div>
    </footer>
  );
}
