"use client";

import { useRef } from "react";
import Image from "next/image";
import { altFor, focus, images } from "@/content/images";
import { BarberPole } from "@/components/brand/BarberPole";
import { MOTION, gsap, useGSAP, type MotionConditions } from "@/lib/motion";
import { QuickBook } from "./QuickBook";

/**
 * Scena 1: chi, dove e come prenotare, subito. Il palo da barbiere gira con
 * lo scorrimento; ritratto e palo si muovono a velocita' diverse (parallasse).
 * Nessuna animazione blocca il modulo rapido di prenotazione.
 */
export function Hero() {
  const hero = images.heroPortrait;
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, (ctx) => {
        const { reduce, wide } = ctx.conditions as MotionConditions;
        if (reduce) return;
        const scrub = { trigger: ref.current, start: "top top", end: "bottom top", scrub: true };
        gsap.fromTo("[data-hero-photo]", { scale: 1.14 }, { scale: 1, ease: "none", scrollTrigger: scrub });
        gsap.to("[data-hero-frame]", { yPercent: wide ? 10 : 6, ease: "none", scrollTrigger: scrub });
        gsap.to("[data-hero-pole]", { yPercent: wide ? -18 : -8, ease: "none", scrollTrigger: scrub });
        gsap.to("[data-hero-title]", { yPercent: -12, ease: "none", scrollTrigger: scrub });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="top" aria-labelledby="hero-title" className="relative overflow-hidden">
      <div id="top-sentinel" aria-hidden="true" className="absolute inset-x-0 top-0 h-4" />
      <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-[1360px] grid-cols-1 gap-10 px-5 pt-8 pb-14 sm:px-8 md:pt-12 lg:min-h-[calc(100svh-72px)] lg:grid-cols-12 lg:items-center lg:gap-10 lg:px-10 lg:pb-16">
        <div className="relative z-10 lg:col-span-7">
          <h1 id="hero-title" className="type-display enter" data-hero-title>
            <span className="sr-only">Style86 Parrucchieri &amp; Estetica: </span>
            Il salone di <span className="whitespace-nowrap">Via Ornato.</span>
          </h1>
          <p className="enter mt-6 max-w-[34rem] text-[1.125rem] leading-relaxed text-muted md:mt-8" style={{ "--d": 80 } as React.CSSProperties}>
            Parrucchieri, barba ed estetica a Milano. Scegli il servizio, indica quando preferisci venire: il salone ti
            conferma l&apos;orario.
          </p>
          <div className="enter mt-8 md:mt-10" style={{ "--d": 140 } as React.CSSProperties}>
            <QuickBook />
          </div>
        </div>

        <figure className="relative lg:col-span-5">
          <div className="relative" data-hero-frame>
            <div className="relative aspect-[16/12] overflow-hidden bg-raised sm:aspect-[16/10] lg:aspect-[4/5] lg:max-h-[calc(100svh-12rem)] lg:w-full">
              <Image
                src={hero.src}
                alt={altFor(hero)}
                fill
                priority
                placeholder="blur"
                sizes="(min-width: 1024px) 40vw, 100vw"
                style={focus(hero)}
                className="photo object-cover"
                data-hero-photo
              />
            </div>
            <div
              className="absolute top-[-1.5rem] right-4 bottom-[-1.5rem] [--pole-width:2.75rem] sm:right-6 lg:top-[-2.5rem] lg:right-auto lg:bottom-[-2.5rem] lg:-left-8 lg:[--pole-width:3.75rem]"
              data-hero-pole
            >
              <BarberPole />
            </div>
          </div>
          <figcaption className="mt-3 text-[0.8125rem] text-muted lg:mt-4 lg:text-right">Foto di repertorio</figcaption>
        </figure>
      </div>
    </section>
  );
}
