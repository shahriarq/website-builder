import type { Metadata } from "next";
import { ViewTransition } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/config/site";
import { href, intlLocale, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { PrivacyBody } from "@/i18n/privacy";
import { BrandMark } from "@/components/brand/BrandMark";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang).privacy;
  const path = href(lang, "/privacy");
  return {
    title: `${t.metaTitle} | ${site.name}`,
    description: t.metaDescription(site.name),
    robots: { index: true, follow: true },
    ...(site.url
      ? {
          alternates: {
            canonical: path,
            languages: { it: href("it", "/privacy"), en: href("en", "/privacy"), "x-default": href("it", "/privacy") },
          },
        }
      : {}),
  };
}

/**
 * Informativa privacy (GDPR, art. 13). DA FAR VERIFICARE AL TITOLARE.
 * Il testo, in entrambe le lingue, sta in src/i18n/privacy.tsx.
 */
export default async function PrivacyPage({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const lastUpdated = new Intl.DateTimeFormat(intlLocale[lang], { dateStyle: "long" }).format(new Date(site.privacy.lastUpdated));

  return (
    <ViewTransition enter="page" exit="page" default="none">
      <main id="contenuto" className="min-h-[100dvh]">
        <div className="mx-auto max-w-[46rem] px-5 py-16 sm:px-8 md:py-24">
          <Link href={href(lang)} transitionTypes={["page"]} className="inline-flex text-[2rem]" aria-label={t.nav.homeLabel}>
            <BrandMark />
          </Link>
          <h1 className="display display-l mt-14">
            {t.privacy.title[0]} <em>{t.privacy.title[1]}</em>
          </h1>
          <p className="mt-8 text-[0.9375rem] text-muted">
            {t.privacy.updated}: {lastUpdated}
          </p>

          <div className="mt-12 grid gap-10 leading-relaxed [&_h2]:text-[1.5rem] [&_h2]:font-semibold [&_h2]:leading-tight [&_h2]:tracking-[-0.01em] [&_p]:text-ink/85 [&_a]:underline [&_a]:decoration-1 [&_a]:underline-offset-4 [&_ul]:mt-3 [&_ul]:grid [&_ul]:list-disc [&_ul]:gap-2 [&_ul]:pl-5">
            <PrivacyBody lang={lang} />
          </div>

          <Link href={href(lang)} transitionTypes={["page"]} className="btn btn-secondary mt-16">
            {t.privacy.back}
          </Link>
        </div>
      </main>
    </ViewTransition>
  );
}
