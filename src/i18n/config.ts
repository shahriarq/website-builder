/**
 * LINGUE DEL SITO
 * --------------------------------------------------------------------------
 * L'italiano e' la lingua principale e vive alla radice ("/"); l'inglese e'
 * sotto "/en". Il proxy (src/proxy.ts) riscrive internamente le pagine
 * italiane su /it, cosi' gli indirizzi pubblici restano senza prefisso.
 */

export const locales = ["it", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "it";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Prefisso pubblico degli indirizzi: "" per l'italiano, "/en" per l'inglese. */
export function localePrefix(lang: Locale): string {
  return lang === defaultLocale ? "" : `/${lang}`;
}

/** Indirizzo pubblico di una pagina nella lingua data, es. href("en", "/privacy") -> "/en/privacy". */
export function href(lang: Locale, path = "/"): string {
  const prefix = localePrefix(lang);
  if (path === "/") return prefix || "/";
  return `${prefix}${path}`;
}

/** Tag di lingua per Intl e per l'attributo lang. */
export const intlLocale: Record<Locale, string> = { it: "it-IT", en: "en-GB" };

/** Nome della lingua nella lingua stessa, per il selettore. */
export const languageName: Record<Locale, string> = { it: "Italiano", en: "English" };
