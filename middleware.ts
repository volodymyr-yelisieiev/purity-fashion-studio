import createMiddleware from 'next-intl/middleware';
import {NextRequest, NextResponse} from 'next/server';
import {routing} from './i18n/routing';

const i18nMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;

  // Redirect locale-prefixed admin paths (e.g. /en/admin, /uk/admin/collections)
  // to the canonical admin route (e.g. /admin, /admin/collections)
  const localeAdminRegex = new RegExp(`^/(${routing.locales.join('|')})/admin(/|$)`);
  if (localeAdminRegex.test(pathname)) {
    const newPath = pathname.replace(new RegExp(`^/(${routing.locales.join('|')})`), '');
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  return i18nMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next`, `/_vercel`, or `/admin`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next|_vercel|admin|.*\\..*).*)']
};
