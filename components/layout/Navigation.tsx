import Link from 'next/link';

export function Navigation() {
  return (
    <ul className="flex gap-6">
      <li>
        <Link href="/services" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
          Services
        </Link>
      </li>
      <li>
        <Link href="/about" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
          About
        </Link>
      </li>
      <li>
        <Link href="/contact" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
          Contact
        </Link>
      </li>
    </ul>
  );
}
