import Link from 'next/link';
import { Navigation } from './Navigation';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { MiniCart } from '../cart/MiniCart';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
          PURITY
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <Navigation />
          <LanguageSwitcher />
          <MiniCart />
        </div>
        {/* Mobile menu trigger would go here */}
        <div className="flex items-center gap-2 md:hidden">
          <MiniCart />
        </div>
      </div>
    </header>
  );
}
