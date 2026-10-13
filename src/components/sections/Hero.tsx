"use client";

import { useRef } from "react";
import Image, { getImageProps } from "next/image";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { site } from "@/config/site";
import { bookingAnchor } from "@/config/navigation";
import { altFor, focus, images } from "@/content/images";
import { MOTION, gsap, useGSAP, type MotionConditions } from "@/lib/motion";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

/**
 * Hero a tutto schermo. Sullo sfondo gli strumenti del barbiere (su
 * telefono la rasatura, inquadratura verticale), in primo piano un ritratto
 * al lavoro che si apre come un sipario. Le righe del titolo salgono da una
 * maschera (CSS, nessuna attesa del JavaScript); allo scorrimento i piani
 * si separano in parallasse.
 */
export function Hero({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);
  const ref = useRef<HTMLElement>(null);
  const bg = images.heroTools;
  const shave = images.heroShave;

  // Direzione artistica: verticale su telefono, orizzontale da tablet in su.
  const common = { alt: "", sizes: "100vw", fill: true, fetchPriority: "high" as const, loading: "eager" as const, quality: 75 };
  const { props: desktop } = getImageProps({ ...common, src: bg.src });
  const { props: mobile } = getImageProps({ ...common, src: shave.src });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, (ctx) => {
        const { reduce, wide } = ctx.conditions as MotionConditions;
        if (reduce) return;
        const st = {
          trigger: ref.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        };
        gsap.to("[data-hero-bg]", {
          yPercent: 18,
          ease: "none",
          scrollTrigger: st,
        });
        gsap.to("[data-hero-veil]", {
          opacity: 0.9,
          ease: "none",
          scrollTrigger: st,
        });
        gsap.to("[data-hero-title]", {
          yPercent: wide ? -22 : -10,
          ease: "none",
          scrollTrigger: st,
        });
        if (wide)
          gsap.to("[data-hero-portrait]", {
            yPercent: -16,
            ease: "none",
            scrollTrigger: st,
          });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="top" aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      {/* Sfondo */}
      <div className="hero-open grain absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 -top-[10%] h-[120%]" data-hero-bg>
          <picture>
            <source media="(min-width: 768px)" srcSet={desktop.srcSet} sizes={desktop.sizes} />
            {/* Sfondo d'atmosfera sotto il titolo: decorativo (alt vuoto). Il ritratto in primo piano ha il suo testo. */}
            <img {...mobile} alt="" className="photo h-full w-full object-cover" style={{ ...mobile.style, ...focus(bg) }} />
          </picture>
        </div>
        <div className="absolute inset-0 bg-charcoal/55" data-hero-veil />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,var(--color-charcoal),transparent)]" />
      </div>

      <div className="mx-auto grid w-full max-w-[1440px] flex-1 grid-cols-12 grid-rows-[1fr] gap-x-6 px-5 md:grid-rows-[auto_1fr] pt-28 pb-10 sm:px-8 md:pt-32 lg:px-12 lg:pb-14">
        {/* Ritratto in primo piano (da tablet) */}
        <figure
          className="hero-open relative col-span-4 col-start-9 row-start-1 hidden self-start md:block lg:col-span-4 lg:col-start-8 lg:w-fit lg:justify-self-center"
          data-hero-portrait
        >
          <div className="relative aspect-[2/3] max-h-[48svh] overflow-hidden bg-raised lg:h-[48svh] lg:max-h-none">
            <Image
              src={shave.src}
              alt={altFor(shave, lang)}
              fill
              sizes="(min-width: 1024px) 24vw, 33vw"
              placeholder="blur"
              style={focus(shave)}
              className="photo object-cover"
            />
          </div>
          <figcaption className="caption mt-3 flex justify-between gap-4">
            <span className="hidden lg:inline">{t.hero.portraitCaption}</span>
            <span>{t.common.stockPhoto}</span>
          </figcaption>
        </figure>

        <div
          className="relative z-10 col-span-12 row-start-1 flex flex-col justify-end self-end md:row-start-2 md:-mt-28 lg:-mt-40"
          data-hero-title
        >
          <p className="kicker fade-in mb-6 md:mb-8" style={{ "--d": 100 } as React.CSSProperties}>
            <span className="text-bronze-text">{t.hero.kicker}</span> &nbsp;/&nbsp; {site.address.street}, {site.address.city}
          </p>
          <h1 id="hero-title" className="display display-xl">
            <span className="sr-only">{t.hero.srTitle}</span>
            <span className="line">
              <span style={{ "--d": 150 } as React.CSSProperties}>{t.hero.title[0]}</span>
            </span>
            <span className="line">
              <span style={{ "--d": 260 } as React.CSSProperties}>
                {t.hero.title[1]} <em>{t.hero.title[2]}</em>
              </span>
            </span>
          </h1>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1440px] px-5 pb-8 sm:px-8 lg:px-12 lg:pb-10">
        <div
          className="fade-in grid gap-5 border-t border-line pt-5 md:grid-cols-12 md:items-end md:gap-6"
          style={{ "--d": 600 } as React.CSSProperties}
        >
          <p className="max-w-[36rem] text-[1.0625rem] text-ink/85 md:col-span-6">
            {t.hero.lede}
          </p>
          <div className="flex flex-wrap items-center gap-3 md:col-span-4 md:col-start-7">
            <a href={bookingAnchor} className="btn btn-primary">
              {t.common.book}
              <ArrowRightIcon size={16} className="btn-icon" aria-hidden="true" />
            </a>
            <a href="#servizi" className="btn btn-secondary">
              {t.hero.services}
            </a>
          </div>
          <a href="#filosofia" className="kicker hidden items-center gap-3 justify-self-end md:col-span-2 md:inline-flex">
            {t.hero.scroll}
            <span aria-hidden="true" className="relative block h-10 w-px overflow-hidden bg-line">
              <span className="scroll-cue absolute inset-x-0 top-0 block h-1/2 bg-ink" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
