import { href, languageName, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

/**
 * Selettore di lingua minimale: "IT  EN", la lingua corrente piena, l'altra
 * tenue. Collegamenti normali alla stessa pagina nell'altra lingua (con
 * hreflang), cosi' funziona anche senza JavaScript.
 */
export function LanguageSwitch({ lang, path = "/", className = "" }: { lang: Locale; path?: string; className?: string }) {
  const t = getDictionary(lang);
  return (
    <nav aria-label={t.common.language} className={`flex items-center gap-1 text-[0.875rem] font-semibold tracking-[-0.01em] ${className}`}>
      {locales.map((code, i) => {
        const current = code === lang;
        return (
          <span key={code} className="flex items-center gap-1">
            {i > 0 && (
              <span aria-hidden="true" className="text-line-strong">
                /
              </span>
            )}
            {current ? (
              <span aria-current="true" className="inline-flex min-h-11 min-w-8 items-center justify-center text-ink">
                <span className="sr-only">{languageName[code]}</span>
                <span aria-hidden="true">{code.toUpperCase()}</span>
              </span>
            ) : (
              <a
                href={href(code, path)}
                hrefLang={code}
                lang={code}
                className="inline-flex min-h-11 min-w-8 items-center justify-center text-muted transition-colors duration-300 hover:text-ink"
              >
                <span className="sr-only">{getDictionary(code).common.switchTo}</span>
                <span aria-hidden="true">{code.toUpperCase()}</span>
              </a>
            )}
          </span>
        );
      })}
    </nav>
  );
}
