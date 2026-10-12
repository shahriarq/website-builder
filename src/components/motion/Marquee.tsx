"use client";

import { useRef } from "react";
import { MOTION, gsap, ScrollTrigger, useGSAP, type MotionConditions } from "@/lib/motion";

const DEFAULT_WORDS = ["Taglio", "Barba", "Styling", "Viso", "Via Ornato, Milano"];

/**
 * Nastro di parole in Bodoni corsivo. Scorre lentamente da solo; lo
 * scorrimento della pagina lo accelera e ne inverte il verso.
 * Decorativo: le stesse voci sono nei servizi, quindi e' nascosto ai lettori di schermo.
 */
export function Marquee({ words = DEFAULT_WORDS, className = "" }: { words?: string[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, (ctx) => {
        if ((ctx.conditions as MotionConditions).reduce) return;
        const loop = gsap.to("[data-marquee-track]", {
          xPercent: -100,
          ease: "none",
          duration: 38,
          repeat: -1,
        });
        let direction = 1;
        const st = ScrollTrigger.create({
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            if (self.direction !== direction) direction = self.direction;
            const boost = Math.min(Math.abs(self.getVelocity()) / 220, 6);
            gsap.to(loop, {
              timeScale: direction * (1 + boost),
              duration: 0.3,
              overwrite: true,
            });
            gsap.to(loop, {
              timeScale: direction,
              duration: 1.4,
              delay: 0.3,
              ease: "power2.out",
            });
          },
          onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
        });
        return () => st.kill();
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const run = (
    <div className="marquee-track" data-marquee-track>
      {words.map((word) => (
        <span key={word} className="marquee-item">
          {word}
          <span className="marquee-dot" />
        </span>
      ))}
    </div>
  );

  return (
    <div ref={ref} aria-hidden="true" className={`marquee display text-[clamp(3rem,9vw,8.5rem)] italic ${className}`}>
      {run}
      {run}
    </div>
  );
}
