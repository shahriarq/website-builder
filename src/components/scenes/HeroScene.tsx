"use client";

import { useRef } from "react";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { site } from "@/config/site";
import { bookingAnchor } from "@/config/navigation";
import { Scissors, SCISSORS_PIVOT } from "@/components/tools/Scissors";
import { gsap, MOTION_QUERIES, type MotionConditions, useGSAP } from "@/lib/gsap";

/**
 * SCENA 1 - Apertura / Precisione.
 * Desktop: scena fissata per ~1 viewport; le forbici si aprono, ruotano e
 * "tagliano", una linea in ottone attraversa la composizione.
 * Touch: stessa coreografia senza pin, legata allo scorrimento dell'hero.
 * Riduzione movimento: composizione statica.
 */
export function HeroScene() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES, (ctx) => {
        const { desktop, reduce } = ctx.conditions as MotionConditions;
        const q = gsap.utils.selector(root);
        const tool = q(".s1-tool");
        const halfA = q('[data-part="half-a"]');
        const halfB = q('[data-part="half-b"]');

        if (reduce) {
          gsap.set(halfA, { rotation: -10, svgOrigin: SCISSORS_PIVOT });
          gsap.set(halfB, { rotation: 10, svgOrigin: SCISSORS_PIVOT });
          return;
        }

        gsap.set([halfA, halfB], { svgOrigin: SCISSORS_PIVOT });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: desktop
            ? { trigger: root.current, start: "top top", end: "+=110%", pin: true, scrub: 0.8, anticipatePin: 1 }
            : { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.5 },
        });

        tl.to(halfA, { rotation: -19, duration: 0.34, ease: "power1.inOut" }, 0)
          .to(halfB, { rotation: 19, duration: 0.34, ease: "power1.inOut" }, 0)
          .to(tool, { rotation: 6, scale: desktop ? 1.12 : 1.05, xPercent: desktop ? -7 : -4, duration: 0.45, ease: "power1.inOut" }, 0)
          // Il taglio: le lame si chiudono di scatto.
          .to([halfA, halfB], { rotation: 0, duration: 0.1, ease: "power3.in" }, 0.42)
          .fromTo(q(".s1-cut"), { scaleX: 0 }, { scaleX: 1, duration: 0.22, ease: "power2.out" }, 0.5)
          .to(tool, { yPercent: -35, rotation: 34, scale: 0.82, autoAlpha: 0, duration: 0.38, ease: "power2.in" }, 0.62)
          .to(q(".s1-mark"), { xPercent: -5, duration: 1 }, 0);

        if (desktop) tl.to(q(".s1-copy"), { yPercent: -10, duration: 0.38 }, 0.62);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" aria-labelledby="hero-title" className="surface-dark relative isolate overflow-hidden bg-obsidian">
      <div id="hero-sentinel" aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-20" />

      {/* Luce d'atmosfera dietro allo strumento. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_72%_42%,rgb(200_167_123/0.16),transparent_55%)] max-lg:bg-[radial-gradient(ellipse_at_60%_22%,rgb(200_167_123/0.14),transparent_60%)]"
      />

      {/* Forbici: banda superiore su mobile, colonna destra da lg. */}
      <div
        aria-hidden="true"
        className="tool-enter pointer-events-none absolute top-[58px] right-[-10vw] w-[84vw] max-w-[640px] sm:top-[76px] sm:right-[-6vw] sm:w-[78vw] lg:top-1/2 lg:right-[-3vw] lg:w-[57vw] lg:max-w-[920px] lg:-translate-y-[58%]"
      >
        <div className="s1-tool will-change-transform" style={{ transform: "rotate(-14deg)" }}>
          <Scissors className="h-auto w-full" />
        </div>
      </div>

      <div className="mx-auto grid min-h-[100dvh] max-w-[1440px] grid-cols-1 content-end px-5 pt-28 pb-8 sm:px-8 lg:grid-rows-[1fr_auto_auto] lg:content-stretch lg:px-12 lg:pt-32 lg:pb-5">
        <div className="s1-copy max-w-[34rem] self-center lg:max-w-[44%] lg:pb-8">
          <p className="eyebrow hero-rise text-brass" style={{ "--d": 0 } as React.CSSProperties}>
            Milano · {site.category}
          </p>

          <p
            aria-hidden="true"
            className="wordmark hero-rise mt-5 text-[clamp(3.75rem,19vw,6.5rem)] leading-[0.82] tracking-[0.01em] lg:hidden"
            style={{ "--d": 80 } as React.CSSProperties}
          >
            STYLE<span className="text-brass">86</span>
          </p>

          <h1
            id="hero-title"
            className="display hero-rise mt-5 pb-1 text-[clamp(2.5rem,10.5vw,3.5rem)] leading-[1.08] text-ivory lg:mt-7 lg:text-[clamp(3.75rem,6vw,6rem)]"
            style={{ "--d": 160 } as React.CSSProperties}
          >
            <span className="sr-only">{site.name}, Milano. </span>
            L&apos;arte del <em className="font-light italic text-brass">taglio</em>.
          </h1>

          <p
            className="hero-rise mt-4 max-w-[30rem] text-base leading-relaxed text-ivory/85 sm:text-[1.0625rem] lg:mt-6"
            style={{ "--d": 300 } as React.CSSProperties}
          >
            Parrucchieri ed estetica in Via Ornato, a Milano. Un taglio pensato su di te, eseguito con precisione.
          </p>

          <div className="hero-rise mt-7 flex flex-col gap-3 xs:flex-row xs:flex-wrap lg:mt-9" style={{ "--d": 380 } as React.CSSProperties}>
            <a href={bookingAnchor} className="btn btn-brass">
              Prenota il tuo appuntamento
              <ArrowRightIcon size={18} weight="regular" className="btn-icon" aria-hidden="true" />
            </a>
            <a href="#servizi" className="btn btn-outline-light">
              Scopri i servizi
            </a>
          </div>
        </div>

        {/* Linea del taglio. */}
        <div aria-hidden="true" className="s1-cut hidden h-px origin-right bg-brass/70 lg:block" />

        <p
          aria-hidden="true"
          className="s1-mark wordmark hero-rise pointer-events-none -mx-[0.04em] mt-4 hidden select-none whitespace-nowrap text-[17vw] leading-[0.8] tracking-[-0.01em] text-ivory lg:block 2xl:text-[15.5rem]"
          style={{ "--d": 200 } as React.CSSProperties}
        >
          STYLE<span className="text-brass">86</span>
        </p>
      </div>

      {/* Linea del taglio su mobile, sotto la banda delle forbici. */}
      <div aria-hidden="true" className="s1-cut absolute top-[calc(58px+42vw)] right-0 left-0 h-px origin-right bg-brass/60 sm:top-[calc(76px+40vw)] lg:hidden" />
    </section>
  );
}
