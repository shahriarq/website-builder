"use client";

import { MOTION, gsap, ScrollTrigger, SplitText, useGSAP, type MotionConditions } from "@/lib/motion";

/**
 * Effetti allo scorrimento per tutta la pagina, dichiarati con attributi:
 *
 *   data-clip            immagine che si apre da una maschera (clip-path) con
 *                        leggero zoom all'indietro; valore = direzione (up|left)
 *   data-parallax="0.15" spostamento verticale relativo allo scorrimento
 *   data-split           righe di testo che salgono da una maschera
 *   data-chars           lettere che salgono una dopo l'altra (marchio del footer)
 *   data-read            parole che si "accendono" mentre si legge (scrub)
 *
 * Gli effetti riguardano solo contenuti sotto la piega: si preparano quando
 * il browser e' libero (dopo l'idratazione), per non rallentare il primo
 * caricamento. Con movimento ridotto non si applica nulla: il contenuto e'
 * gia' completo nel markup, quindi senza JavaScript tutto resta visibile.
 */
export function ScrollEffects() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(MOTION, (ctx) => {
      const { reduce, wide } = ctx.conditions as MotionConditions;
      if (reduce) return;

      const splits: SplitText[] = [];

      const setup = () => {
        // Immagini: apertura a sipario + zoom della foto all'interno.
        gsap.utils.toArray<HTMLElement>("[data-clip]").forEach((frame) => {
          const from = frame.dataset.clip === "left" ? "inset(0 100% 0 0)" : "inset(100% 0 0 0)";
          const img = frame.querySelector("img");
          const tl = gsap.timeline({ scrollTrigger: { trigger: frame, start: "top 85%", once: true } });
          tl.fromTo(frame, { clipPath: from }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut" });
          if (img) tl.fromTo(img, { scale: 1.3 }, { scale: 1, duration: 2.2, ease: "expo.out" }, 0);
        });

        // Parallasse: elementi che scorrono a velocita' diverse.
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          const amount = Number(el.dataset.parallax || 0.15) * (wide ? 1 : 0.5);
          gsap.fromTo(
            el,
            { yPercent: -amount * 50 },
            {
              yPercent: amount * 50,
              ease: "none",
              scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });

        // Titoli: righe che salgono da una maschera, una dopo l'altra.
        // autoSplit: le righe si ricalcolano quando arriva il carattere o cambia la larghezza;
        // l'animazione restituita da onSplit viene risincronizzata allo stesso punto.
        gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
          const split = SplitText.create(el, {
            type: "lines",
            mask: "lines",
            aria: "auto",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 110,
                duration: 1.3,
                ease: "expo.out",
                stagger: 0.09,
                scrollTrigger: { trigger: el, start: "top 88%", once: true },
              }),
          });
          splits.push(split);
        });

        // Marchio del footer: lettere che salgono una dopo l'altra.
        gsap.utils.toArray<HTMLElement>("[data-chars]").forEach((el) => {
          const split = SplitText.create(el, { type: "chars", mask: "chars", aria: "none" });
          splits.push(split);
          gsap.from(split.chars, {
            yPercent: 100,
            duration: 1.4,
            ease: "expo.out",
            stagger: 0.05,
            scrollTrigger: { trigger: el, start: "top 95%", once: true },
          });
        });

        // Lettura: le parole passano da tenui a piene mentre il paragrafo attraversa lo schermo.
        // Lo stato tenue si applica solo quando il paragrafo si avvicina: prima resta pieno.
        gsap.utils.toArray<HTMLElement>("[data-read]").forEach((el) => {
          ScrollTrigger.create({
            trigger: el,
            start: "top bottom+=80",
            once: true,
            onEnter: () =>
              ctx.add(() => {
                const split = SplitText.create(el, { type: "words", aria: "none" });
                splits.push(split);
                gsap.fromTo(
                  split.words,
                  { opacity: 0.16 },
                  {
                    opacity: 1,
                    ease: "none",
                    stagger: 0.08,
                    scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: 0.6 },
                  },
                );
              }),
          });
        });
      };

      // Preparazione a browser libero (al piu' tardi dopo 1,2 s).
      const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
      const cancel = window.cancelIdleCallback ?? window.clearTimeout;
      const id = idle(() => ctx.add(setup), { timeout: 1200 });

      return () => {
        cancel(id);
        splits.forEach((s) => s.revert());
      };
    });

    return () => mm.revert();
  });

  return null;
}
