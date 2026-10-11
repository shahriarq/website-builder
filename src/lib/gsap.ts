"use client";

/**
 * Registrazione unica di GSAP + ScrollTrigger + useGSAP (pulizia automatica
 * di animazioni e ScrollTrigger allo smontaggio dei componenti).
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  // Su mobile la barra dell'indirizzo cambia l'altezza del viewport: evitiamo
  // ricalcoli continui che farebbero "saltare" lo scorrimento.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/**
 * Condizioni per gsap.matchMedia:
 * - desktop: scene fissate (pin) e animazioni legate allo scorrimento;
 * - touch: nessun pin, animazioni brevi sullo scorrimento naturale;
 * - reduce: nessuna animazione, composizioni statiche complete.
 */
export const MOTION_QUERIES = {
  desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  touch: "(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
} as const;

export type MotionConditions = { desktop: boolean; touch: boolean; reduce: boolean };

/**
 * Se un elemento attivabile da tastiera riceve il focus mentre la scena e'
 * a meta' animazione, porta lo scorrimento alla fine della scena: il
 * contenuto e' cosi' sempre visibile e utilizzabile.
 */
export function revealOnFocus(root: HTMLElement, trigger: ScrollTrigger) {
  const onFocus = () => {
    if (trigger.progress < 1 && trigger.isActive) {
      window.scrollTo({ top: trigger.end + 1, behavior: "auto" });
    }
  };
  root.addEventListener("focusin", onFocus);
  return () => root.removeEventListener("focusin", onFocus);
}

export { gsap, ScrollTrigger, useGSAP };
