"use client";

import { useRef } from "react";
import { ArrowDownIcon } from "@phosphor-icons/react";
import { Razor, RAZOR_PIVOT } from "@/components/tools/Razor";
import { gsap, MOTION_QUERIES, type MotionConditions, revealOnFocus, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * SCENA 4 - La firma.
 * Il rasoio si apre e attraversa lo schermo: dietro al filo della lama una
 * tendina color carbone rivela "Il prossimo look inizia qui." e la CTA.
 * La CTA porta al modulo subito sotto; se riceve il focus da tastiera a
 * meta' animazione, la scena salta allo stato finale.
 */
export function SignatureScene() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES, (ctx) => {
        const { desktop, reduce } = ctx.conditions as MotionConditions;
        const q = gsap.utils.selector(root);
        const blade = q('[data-part="blade"]');

        if (reduce) {
          gsap.set(blade, { rotation: 0, svgOrigin: RAZOR_PIVOT });
          return;
        }

        gsap.set(blade, { svgOrigin: RAZOR_PIVOT });
        const track = q(".s4-track")[0] as HTMLElement;
        const wipe = q(".s4-wipe")[0] as HTMLElement;
        const razorWidth = () => (q(".s4-razor")[0] as HTMLElement).offsetWidth;

        // Un solo valore guida rasoio e tendina: il bordo della tendina segue
        // sempre la punta della lama.
        const proxy = { x: 0 };
        const apply = () => {
          gsap.set(track, { x: proxy.x });
          const hidden = Math.min(100, Math.max(0, 100 - (proxy.x / window.innerWidth) * 100));
          wipe.style.clipPath = `inset(0% ${hidden}% 0% 0%)`;
        };

        // Desktop: la scena si fissa solo durante il passaggio del rasoio;
        // l'apertura della lama avviene mentre la sezione entra in vista.
        if (desktop) {
          ScrollTrigger.create({ trigger: root.current, start: "top top", end: "+=70%", pin: true, anticipatePin: 1 });
        }

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: desktop
            ? {
                trigger: root.current,
                start: "top bottom",
                end: () => `+=${window.innerHeight * 1.7}`,
                scrub: 0.8,
                invalidateOnRefresh: true,
              }
            : // Touch: il rasoio e' al centro della sezione; l'animazione parte quando
              // e' in vista e termina con la CTA completamente visibile.
              { trigger: root.current, start: "top 55%", end: "bottom 95%", scrub: 0.5, invalidateOnRefresh: true },
        });

        const entry = desktop ? 1 : 0.35;
        const total = desktop ? 1.7 : 1;
        tl.fromTo(blade, { rotation: 180 }, { rotation: 0, duration: entry * 0.6, ease: "power2.inOut" }, entry * 0.15)
          .fromTo(q(".s4-razor"), { rotation: -8, scale: 0.88 }, { rotation: 0, scale: 1, duration: entry * 0.6, ease: "power2.out" }, entry * 0.15)
          .fromTo(
            proxy,
            { x: () => -razorWidth() * 0.15 },
            { x: () => window.innerWidth * (desktop ? 0.24 : 0.3), duration: entry, ease: "power1.out", onUpdate: apply },
            0,
          )
          .to(proxy, { x: () => window.innerWidth + razorWidth(), duration: total - entry - 0.1, ease: "power1.in", onUpdate: apply }, entry)
          .fromTo(q(".s4-after"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.12, stagger: 0.04, ease: "power2.out" }, total - 0.2)
          .set({}, {}, total);

        const st = tl.scrollTrigger;
        if (st && root.current) return revealOnFocus(root.current, st);
        return undefined;
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="signature-title" className="surface-dark relative isolate overflow-hidden bg-obsidian">
      <div className="relative h-[100svh] min-h-[32rem] lg:h-[100dvh]">
        {/* Tendina: contenuto finale della scena. */}
        <div className="s4-wipe absolute inset-0 bg-charcoal">
          <div className="mx-auto flex h-full max-w-[1440px] flex-col justify-center px-5 sm:px-8 lg:px-12">
            <h2 id="signature-title" className="display max-w-[14ch] pb-2 text-[clamp(3rem,11vw,8.5rem)] leading-[1.02] text-ivory">
              Il prossimo look <em className="font-light italic text-brass">inizia qui</em>.
            </h2>
            <p className="s4-after mt-6 max-w-[30rem] text-[1.0625rem] leading-relaxed text-ivory/85">
              Scegli servizio, giorno e fascia oraria. Il salone ti conferma l&apos;appuntamento.
            </p>
            <div className="s4-after mt-9">
              <a href="#prenota" className="btn btn-brass">
                Prenota il tuo appuntamento
                <ArrowDownIcon size={18} weight="regular" className="btn-icon" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* Rasoio: la lama guida da sinistra verso destra. */}
        <div aria-hidden="true" className="s4-track pointer-events-none absolute top-1/2 left-0 z-10 -translate-y-1/2 will-change-transform">
          <div className="-translate-x-full">
            <div className="s4-razor w-[min(92vw,760px)] -scale-x-100">
              <Razor className="h-auto w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
