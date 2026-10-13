import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { site } from "@/config/site";
import { href } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { BrandMark } from "@/components/brand/BrandMark";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], axes: ["opsz"], variable: "--font-inter", display: "swap" });

const it = getDictionary("it").notFound;
const en = getDictionary("en").notFound;

export const metadata: Metadata = {
  title: `${it.title.join(" ")} | ${site.shortName}`,
  description: it.body,
};

/**
 * Pagina 404 per qualsiasi indirizzo sconosciuto, in entrambe le lingue.
 * La radice dell'app e' il segmento [lang], quindi questa pagina non passa dal
 * layout: per questo ha il proprio <html> e importa stili e carattere.
 * L'italiano e' principale; l'inglese segue, con il proprio attributo lang.
 */
export default function GlobalNotFound() {
  return (
    <html lang="it" className={inter.variable}>
      <body>
        <main id="contenuto" className="mx-auto flex min-h-[100dvh] max-w-[1440px] flex-col justify-center px-5 sm:px-8 lg:px-12">
          <a href={href("it")} className="self-start text-[2rem]" aria-label={getDictionary("it").nav.homeLabel}>
            <BrandMark />
          </a>
          <p className="kicker kicker-bronze mt-16">{it.kicker}</p>
          <h1 className="display display-xl mt-6 max-w-[12ch]">
            {it.title[0]} <em>{it.title[1]}</em>
          </h1>
          <p className="lede mt-8 max-w-[30rem]">{it.body}</p>
          <p lang="en" className="mt-3 max-w-[30rem] text-muted">
            {en.title.join(" ")} {en.body}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
            <a href={href("it")} className="btn btn-secondary">
              {it.home}
            </a>
            <a href={href("en")} lang="en" hrefLang="en" className="inline-flex min-h-11 items-center text-[0.9375rem]">
              <span className="link">{en.home}</span>
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
