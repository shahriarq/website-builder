"use client";

import { useRef } from "react";
import { MOTION, gsap, useGSAP, type MotionConditions } from "@/lib/motion";

const WORDS = ["Taglio", "Barba", "Piega", "Estetica"];

/**
 * Fascia di parole che scorre di lato con lo scorrimento della pagina.
 * Decorativa (le stesse voci sono nei servizi): nascosta ai lettori di schermo.
 */
export function Marquee() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, (ctx) => {
        if ((ctx.conditions as MotionConditions).reduce) return;
        gsap.fromTo(
          "[data-marquee-row]",
          { xPercent: (i) => (i % 2 ? -30 : 0) },
          {
            xPercent: (i) => (i % 2 ? 0 : -30),
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const row = (outline: boolean) => (
    <div data-marquee-row className="flex w-max gap-[0.4em] whitespace-nowrap">
      {[...WORDS, ...WORDS, ...WORDS].map((word, i) => (
        <span key={i} className={`flex items-center gap-[0.4em] ${outline && i % 2 === 0 ? "marquee-outline" : ""}`}>
          {word}
          <span className="inline-block size-[0.18em] bg-red-fill" />
        </span>
      ))}
    </div>
  );

  return (
    <div ref={ref} aria-hidden="true" className="type-display overflow-hidden py-14 text-[clamp(3.5rem,11vw,10rem)] leading-[1.05] select-none md:py-20">
      {row(false)}
      {row(true)}
    </div>
  );
}
