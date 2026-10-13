import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Inter } from "next/font/google";
import { site } from "@/config/site";
import { hairSalonJsonLd } from "@/lib/seo";
import { href, isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { RevealController } from "@/components/motion/RevealController";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import "../globals.css";

// Un solo carattere, come nel sistema Apple. SF Pro non e' distribuibile sul
// web: sui dispositivi Apple la pila in globals.css usa il carattere di sistema
// (SF Pro); altrove Inter, con le dimensioni ottiche (Text e Display).
const inter = Inter({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-inter",
  display: "swap",
});

/**
 * Sipario d'apertura: solo alla prima pagina della sessione (home italiana o
 * inglese) e solo con movimento consentito. Lo script gira prima del primo
 * disegno, cosi' il sipario non lampeggia; senza JavaScript non compare.
 */
const introScript = `try{var m=matchMedia("(prefers-reduced-motion: reduce)").matches;var p=location.pathname;if(!m&&!sessionStorage.getItem("s86-intro")&&(p==="/"||p==="/en")){document.documentElement.classList.add("intro");sessionStorage.setItem("s86-intro","1")}}catch(e){}`;

/** Le due lingue sono generate in modo statico; qualsiasi altro prefisso e' 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    ...(site.url
      ? {
          metadataBase: new URL(site.url),
          alternates: { canonical: href(lang), languages: { it: href("it"), en: href("en"), "x-default": href("it") } },
        }
      : {}),
    title: t.meta.title,
    description: t.meta.description,
    applicationName: site.shortName,
    formatDetection: { telephone: false, address: false, email: false },
    openGraph: {
      type: "website",
      locale: lang === "it" ? "it_IT" : "en_GB",
      alternateLocale: lang === "it" ? ["en_GB"] : ["it_IT"],
      siteName: site.name,
      title: t.meta.title,
      description: t.meta.description,
      ...(site.url ? { url: `${site.url}${href(lang) === "/" ? "" : href(lang)}` } : {}),
    },
    twitter: { card: "summary_large_image", title: t.meta.title, description: t.meta.description },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#121110",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang as Locale);

  return (
    <html lang={lang} className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>
        <div className="curtain" aria-hidden="true">
          <div className="text-center">
            <p className="curtain-mark brand-mark">
              <span>
                Style<span className="brand-num">86</span>
              </span>
            </p>
            <div className="curtain-rule mx-auto" />
          </div>
        </div>
        <script
          type="application/ld+json"
          // I dati provengono solo dalla configurazione statica del sito.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(hairSalonJsonLd()).replace(/</g, "\\u003c"),
          }}
        />
        <a
          href="#contenuto"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:bg-ink focus:px-4 focus:py-3 focus:text-paper"
        >
          {t.common.skipToContent}
        </a>
        {children}
        <RevealController />
        <SmoothScroll />
      </body>
    </html>
  );
}
