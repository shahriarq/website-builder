"use client";

/**
 * Motore del movimento: GSAP + ScrollTrigger per le scene legate allo
 * scorrimento, Lenis per lo scorrimento morbido con inerzia (solo rotella e
 * trackpad: sul touch resta lo scorrimento nativo del telefono).
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type Lenis from "lenis";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  // La barra dell'indirizzo su mobile cambia l'altezza: niente ricalcoli a ogni scatto.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/**
 * Condizioni per gsap.matchMedia:
 * - wide: scene fissate (pin) con timeline legate allo scorrimento;
 * - narrow: scene piu' corte, nessuno scorrimento orizzontale fissato;
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
  if (lenis) {
    // Lenis applica gia' scroll-padding-top (globals.css), che lascia spazio all'header.
    lenis.scrollTo(target, { immediate: opts.immediate || reduce, duration: 1.2 });
    return;
  }
  const top = target.getBoundingClientRect().top + window.scrollY - headerOffset();
  window.scrollTo({ top, behavior: opts.immediate || reduce ? "auto" : "smooth" });
}

/**
 * Se un elemento attivabile da tastiera riceve il focus mentre una scena
 * fissata e' a meta', porta lo scorrimento a una posizione in cui e' visibile.
 */
export function revealOnFocus(root: HTMLElement, onFocus: (el: HTMLElement) => void) {
  const handler = (e: FocusEvent) => {
    if (e.target instanceof HTMLElement) onFocus(e.target);
  };
  root.addEventListener("focusin", handler);
  return () => root.removeEventListener("focusin", handler);
}

export { gsap, ScrollTrigger, useGSAP };
