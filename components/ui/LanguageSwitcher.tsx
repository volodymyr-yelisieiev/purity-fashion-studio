"use client";

import { useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useTransition } from "react";

interface Language {
  code: "en" | "uk" | "ru";
  label: string;
}

const languages: Language[] = [
  { code: "en", label: "EN" },
  { code: "uk", label: "UK" },
  { code: "ru", label: "RU" },
];

export function LanguageSwitcher() {
  const router = useRouter();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) return;

    startTransition(() => {
      // Robustly get the path without locale
      let path = window.location.pathname;
      // Remove locale prefix if present
      const segments = path.split("/");
      // segments[0] is empty, segments[1] is locale (maybe)
      if (["en", "uk", "ru"].includes(segments[1])) {
        path = "/" + segments.slice(2).join("/");
      }
      // Ensure path starts with /
      if (!path.startsWith("/")) path = "/" + path;

      router.replace(path, { locale: newLocale });
    });
  };

  return (
    <div className="flex gap-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          disabled={isPending}
          className={`px-3 py-1 text-sm font-medium transition-colors ${
            locale === lang.code
              ? "text-foreground border-b-2 border-foreground"
              : "text-muted-foreground hover:text-foreground"
          } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
