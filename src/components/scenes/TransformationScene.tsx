"use client";

import Image from "next/image";
import { useRef } from "react";
import { altFor, focus, images } from "@/content/images";
import { gsap, MOTION_QUERIES, type MotionConditions, useGSAP } from "@/lib/gsap";

/**
 * SCENA 3 - La trasformazione.
 * Il ritratto si apre da una sottile fessura verticale (come un taglio) fino
 * a tutto schermo, mentre compare "Il tuo stile. La tua firma.".
 * Nessun prima/dopo inventato: e' un ritratto editoriale illustrativo.
 * Desktop: scena fissata per ~1 viewport. Touch: rivelazione senza pin.
 */
export function TransformationScene() {
  const root = useRef<HTMLElement>(null);
  const portrait = images.heroPortrait;

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
            ? { trigger: root.current, start: "top top", end: "+=100%", pin: true, scrub: 0.8, anticipatePin: 1 }
            : { trigger: root.current, start: "top 80%", end: "bottom 75%", scrub: 0.5 },
        });

        tl.fromTo(
          q(".s3-mask"),
          { clipPath: desktop ? "inset(12% 48.4% 12% 48.4%)" : "inset(6% 45% 6% 45%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.62, ease: "power2.inOut" },
          0,
        )
          .fromTo(q(".s3-mask img"), { scale: 1.35 }, { scale: 1, duration: 0.8, ease: "power1.out" }, 0)
          .fromTo(q(".s3-scrim"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.32)
          .fromTo(q(".s3-line"), { yPercent: 110 }, { yPercent: 0, duration: 0.28, stagger: 0.24, ease: "power3.out" }, 0.1)
          .fromTo(q(".s3-after"), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.2, stagger: 0.06 }, 0.72);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="transform-title" className="surface-dark relative isolate overflow-hidden bg-obsidian">
      <div className="relative h-[100svh] min-h-[34rem] lg:h-[100dvh]">
        <div className="s3-mask absolute inset-0 overflow-hidden will-change-[clip-path]">
          <Image
            src={portrait.src}
            alt={altFor(portrait)}
            fill
            placeholder="blur"
            sizes="100vw"
            style={focus(portrait)}
            className="object-cover"
          />
          <div aria-hidden="true" className="s3-scrim absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/45 to-obsidian/0 lg:bg-gradient-to-r lg:from-obsidian/90 lg:via-obsidian/35 lg:to-obsidian/0" />
        </div>

        <div className="relative mx-auto flex h-full max-w-[1440px] flex-col justify-end px-5 pb-12 sm:px-8 lg:justify-center lg:px-12 lg:pb-0">
          <h2 id="transform-title" className="display text-[clamp(2.75rem,11vw,7.5rem)] leading-[1.02] text-ivory">
            <span className="block overflow-hidden pb-[0.08em]">
              <span className="s3-line block">Il tuo stile.</span>
            </span>
            <span className="block overflow-hidden pb-[0.12em]">
              <span className="s3-line block">
                La tua <em className="font-light italic text-brass">firma</em>.
              </span>
            </span>
          </h2>
          <p className="s3-after mt-5 max-w-[26rem] text-[1.0625rem] leading-relaxed text-ivory/85 lg:mt-8">
            Linee, volume e finitura costruiti intorno a te, per un risultato che ti somiglia.
          </p>
          <p className="s3-after mt-6 text-sm text-mist">Immagine a scopo illustrativo.</p>
        </div>
      </div>
    </section>
  );
}
