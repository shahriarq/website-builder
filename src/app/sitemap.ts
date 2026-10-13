import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { href, locales } from "@/i18n/config";

/**
 * La sitemap richiede URL assoluti: viene popolata quando NEXT_PUBLIC_SITE_URL e' impostato.
 * Ogni pagina esiste in italiano (senza prefisso) e in inglese (/en), con i rimandi hreflang.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  if (!base) return [];
  const url = (path: string) => `${base}${path}`;
  const pages = [
    { path: "/", changeFrequency: "monthly" as const, priority: 1 },
    { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.2 },
  ];
  return pages.flatMap((page) =>
    locales.map((lang) => ({
      url: url(href(lang, page.path)),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: { languages: { it: url(href("it", page.path)), en: url(href("en", page.path)) } },
    })),
  );
}
