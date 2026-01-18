import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Picks a localized value from a potentially locale-keyed object.
 * Used across Payload hooks, SEO plugin, Live Preview, and frontend.
 */
export function pickLocalized(
  value: unknown,
  locale?: string,
): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    const record = value as Record<string, string | undefined>;
    return (
      (locale && record[locale]) ||
      record.uk ||
      record.en ||
      record.ru ||
      Object.values(record).find(Boolean)
    );
  }
  return undefined;
}

/**
 * Convert a string to URL-friendly slug
 * Handles Latin, Cyrillic (Ukrainian/Russian), and other characters
 */
export function slugify(text: string): string {
  const cyrillicToLatin: Record<string, string> = {
    а: "a",
    б: "b",
    в: "v",
    г: "h",
    ґ: "g",
    д: "d",
    е: "e",
    є: "ye",
    ж: "zh",
    з: "z",
    и: "y",
    і: "i",
    ї: "yi",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "kh",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "shch",
    ь: "",
    ю: "yu",
    я: "ya",
    ы: "y",
    э: "e",
    ё: "yo",
  };

  return text
    .toLowerCase()
    .split("")
    .map((char) => cyrillicToLatin[char] || char)
    .join("")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with dashes
    .replace(/^-+|-+$/g, "") // Remove leading/trailing dashes
    .replace(/-+/g, "-"); // Replace multiple dashes with single
}

/**
 * Extract plain text from Lexical rich text data
 */
export function extractPlainText(lexicalData: unknown): string {
  if (
    !lexicalData ||
    typeof lexicalData !== "object" ||
    !("root" in lexicalData)
  )
    return "";

  const data = lexicalData as { root: { children?: unknown[] } };
  if (!data.root?.children) return "";

  let text = "";

  function traverse(node: unknown) {
    if (!node || typeof node !== "object") return;

    const n = node as { text?: string; children?: unknown[] };

    if (n.text) {
      text += n.text + " ";
    }
    if (n.children) {
      n.children.forEach(traverse);
    }
  }

  traverse(data.root);
  return text.trim();
}

/**
 * Check if a value has meaningful content
 * Handles strings, null/undefined, and Lexical rich text objects
 */
export function hasContent(value: unknown): boolean {
  if (value === null || value === undefined) return false;

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (typeof value === "object") {
    // Check if it's a Lexical object
    if ("root" in value) {
      return extractPlainText(value).length > 0;
    }
    // For other objects, check if they have keys
    return Object.keys(value).length > 0;
  }

  return Boolean(value);
}

/**
 * Format price with currency symbol
 */
export function formatPrice(
  amount: number,
  currency: "UAH" | "EUR" = "UAH",
): string {
  const formatter = new Intl.NumberFormat(
    currency === "UAH" ? "uk-UA" : "en-EU",
    {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
  );
  return formatter.format(amount);
}
