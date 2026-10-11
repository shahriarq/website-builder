"use client";

import Image from "next/image";
import { useRef } from "react";
import { Comb } from "@/components/tools/Comb";
import { altFor, focus, images } from "@/content/images";
import { gsap, MOTION_QUERIES, type MotionConditions, useGSAP } from "@/lib/gsap";

/**
 * SCENA 2 - Il mestiere.
 * Il pettine attraversa la composizione da sinistra a destra e, al suo
 * passaggio, rivela il titolo "Ogni dettaglio conta."; lo sfondo passa dal
 * nero dell'apertura all'avorio; l'immagine del dettaglio si apre.
 * Desktop: scena fissata per ~0,8 viewport. Touch: nessun pin.
 */
export function CraftScene() {
  const root = useRef<HTMLElement>(null);
  const detail = images.introDetail;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES, (ctx) => {
        const { desktop, reduce } = ctx.conditions as MotionConditions;
        if (reduce) return;
        const q = gsap.utils.selector(root);

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: desktop
            ? { trigger: root.current, start: "top top", end: "+=80%", pin: true, scrub: 0.8, anticipatePin: 1 }
            : { trigger: root.current, start: "top 85%", end: "bottom 65%", scrub: 0.5 },
        });

        // Il velo scuro si dissolve mentre la sezione entra: nessuna schermata vuota.
        gsap.fromTo(
          q(".s2-shade"),
          { autoAlpha: 1 },
          {
            autoAlpha: 0,
            ease: "power1.in",
            scrollTrigger: desktop
              ? { trigger: root.current, start: "top bottom", end: "top 15%", scrub: 0.6 }
              : { trigger: root.current, start: "top 95%", end: "top 35%", scrub: 0.5 },
          },
        );

        tl.fromTo(q(".s2-comb"), { xPercent: -112, rotation: -4 }, { xPercent: 118, rotation: 3, duration: 0.7 }, 0.08)
          .fromTo(
            q(".s2-title"),
            { clipPath: "inset(-10% 100% -20% 0%)" },
            { clipPath: "inset(-10% 0% -20% 0%)", duration: 0.56 },
            0.16,
          )
          .fromTo(
            q(".s2-figure"),
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 0.4, ease: "power2.out" },
            0.38,
          )
          .fromTo(q(".s2-figure img"), { scale: 1.18 }, { scale: 1, duration: 0.6 }, 0.38)
          .fromTo(q(".s2-cap"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 }, 0.66)
          .fromTo(q(".s2-copy > *"), { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.24, stagger: 0.08, ease: "power2.out" }, 0.62);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="craft-title" className="surface-light relative isolate overflow-hidden bg-ivory">
      {/* Velo scuro che si dissolve: continuita' cromatica con l'apertura. */}
      <div aria-hidden="true" className="s2-shade pointer-events-none invisible absolute inset-0 z-20 bg-obsidian" />

      <div className="mx-auto grid min-h-[100dvh] max-w-[1440px] grid-cols-1 content-center gap-10 px-5 py-24 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:py-20">
        <div className="relative lg:col-span-8">
          {/* Pettine: attraversa il titolo. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[-3.5rem] z-10 sm:top-[-4.5rem] lg:top-[18%]">
            <div className="s2-comb w-[min(78vw,760px)] will-change-transform" style={{ transform: "translate(118%, 0)" }}>
              <Comb className="h-auto w-full drop-shadow-[0_18px_24px_rgb(23_23_21/0.18)]" />
            </div>
          </div>

          <h2
            id="craft-title"
            className="s2-title display relative pb-2 text-[clamp(3rem,13vw,9.5rem)] leading-[0.95] text-obsidian will-change-[clip-path]"
          >
            Ogni dettaglio
            <br />
            <em className="font-light italic text-brass-deep">conta.</em>
          </h2>

          <div className="s2-copy mt-10 grid gap-6 text-[1.0625rem] leading-relaxed text-charcoal sm:grid-cols-2 sm:gap-8 lg:mt-14 lg:max-w-[46rem]">
            <p>
              Da Style86 il taglio nasce dall&apos;ascolto: il tuo viso, la natura dei tuoi capelli, il tempo che vuoi dedicare
              alla piega ogni mattina.
            </p>
            <p>
              Poi viene la precisione. Linee pulite, proporzioni equilibrate e un risultato che resti bello anche nei giorni
              dopo il salone.
            </p>
          </div>
        </div>

        <figure className="lg:col-span-4 lg:self-center">
          <div className="s2-figure relative aspect-[3/4] overflow-hidden bg-charcoal will-change-[clip-path]">
            <Image
              src={detail.src}
              alt={altFor(detail)}
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 30vw, 100vw"
              style={focus(detail)}
              className="object-cover"
            />
          </div>
          <figcaption className="s2-cap mt-3 text-sm text-olive-deep">Immagine a scopo illustrativo.</figcaption>
        </figure>
      </div>
    </section>
  );
}
