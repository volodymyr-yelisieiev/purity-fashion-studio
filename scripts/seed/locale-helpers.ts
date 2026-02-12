/**
 * Locale helpers — localizeDoc.
 */
import type { Payload, LocalizedData } from "./types";
import { LOCALES } from "./types";

/**
 * Localize a document across non-en locales.
 */
export async function localizeDoc(
  payload: Payload,
  collection: string,
  id: number | string,
  locales: LocalizedData,
): Promise<void> {
  for (const locale of LOCALES) {
    if (locale === "en") continue;
    const data = locales[locale];
    if (!data || Object.keys(data).length === 0) continue;
    await payload.update({ collection: collection as any, id, locale, data });
  }
}
