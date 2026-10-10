"use client";

import { useEffect } from "react";

/**
 * Attiva le comparse allo scorrimento per gli elementi con [data-reveal].
 * - Rispetta prefers-reduced-motion (in quel caso non fa nulla).
 * - Segna subito come visibili gli elementi gia' nel viewport, poi aggiunge
 *   .reveal-ready: niente sfarfallio e contenuto visibile se JS fallisce.
 * - Aggiunge .lite su dispositivi lenti o con risparmio dati attivo.
 */
export function RevealController() {
  useEffect(() => {
    const root = document.documentElement;
    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean };
      deviceMemory?: number;
    };
    const lite =
      nav.connection?.saveData === true ||
      (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 2) ||
      (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2);
    if (lite) root.classList.add("lite");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) return;

    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const viewport = window.innerHeight;
    // Un elemento completamente ritagliato da clip-path non risulta mai
    // "intersecante": per le maschere si osserva quindi il contenitore.
    const watched = new Map<Element, HTMLElement[]>();
    for (const el of elements) {
      const rect = el.getBoundingClientRect();
      if (rect.top < viewport * 0.92 && rect.bottom > 0) {
        el.classList.add("is-visible");
        continue;
      }
      const target = el.dataset.reveal === "mask" && el.parentElement ? el.parentElement : el;
      watched.set(target, [...(watched.get(target) ?? []), el]);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          watched.get(entry.target)?.forEach((el) => el.classList.add("is-visible"));
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    watched.forEach((_, target) => observer.observe(target));
    root.classList.add("reveal-ready");

    return () => {
      observer.disconnect();
      root.classList.remove("reveal-ready");
    };
  }, []);

  return null;
}
