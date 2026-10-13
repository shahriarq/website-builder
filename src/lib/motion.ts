"use client";

/**
 * Motore del movimento: GSAP + ScrollTrigger per le scene legate allo
 * scorrimento, Lenis per lo scorrimento morbido con inerzia (solo rotella e
 * trackpad: sul touch resta lo scorrimento nativo del telefono).
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import type Lenis from "lenis";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  // La barra dell'indirizzo su mobile cambia l'altezza: niente ricalcoli a ogni scatto.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/**
 * Condizioni per gsap.matchMedia:
 * - wide: parallasse piu' ampia e anteprime che seguono il cursore;
 * - narrow: parallasse ridotta, nessun effetto legato al cursore;
 * - reduce: nessuna animazione, composizioni finali statiche.
 */
export const MOTION = {
  wide: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
  narrow: "(max-width: 767.98px) and (prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
} as const;

export type MotionConditions = { wide: boolean; narrow: boolean; reduce: boolean };

let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

/** Altezza dell'header fisso, per non coprire l'inizio delle sezioni. */
export function headerOffset() {
  return document.querySelector("header")?.getBoundingClientRect().height ?? 0;
}

/**
 * Porta lo scorrimento all'inizio di un elemento, con Lenis se attivo
 * oppure con lo scorrimento nativo (morbido solo senza movimento ridotto).
 */
export function scrollToElement(target: HTMLElement, opts: { immediate?: boolean } = {}) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Destinazione calcolata dalla posizione reale della pagina, lasciando lo spazio
  // dell'header (scroll-padding-top in globals.css).
  const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || headerOffset();
  const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - padding);
  if (lenis) {
    // Se la pagina si e' mossa senza passare da Lenis, riallinea il suo stato prima di partire.
    if (!lenis.isScrolling && Math.abs(lenis.animatedScroll - window.scrollY) > 1) {
      lenis.scrollTo(window.scrollY, { immediate: true, force: true });
    }
    lenis.scrollTo(top, { immediate: opts.immediate || reduce, duration: 1.2, force: true });
    return;
  }
  window.scrollTo({ top, behavior: opts.immediate || reduce ? "auto" : "smooth" });
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
