"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, setLenis, scrollToElement } from "@/lib/motion";

/**
 * Scorrimento morbido con inerzia (Lenis) sincronizzato con ScrollTrigger.
 * - Disattivato con prefers-reduced-motion.
 * - Sul touch resta lo scorrimento nativo (Lenis agisce solo su rotella e trackpad).
 * - Pubblica la posizione di scorrimento in --sy, usata dal palo da barbiere
 *   e dalle strisce decorative senza ricalcoli React.
 * - Intercetta i link interni (#...) per scorrere con la stessa inerzia.
 */
export function SmoothScroll() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    const publish = () => root.style.setProperty("--sy", String(Math.round(window.scrollY)));

    function start() {
      if (lenis || reduce.matches) return;
      lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, anchors: false });
      setLenis(lenis);
      root.classList.add("has-lenis");
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    function stop() {
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
      tick = null;
      setLenis(null);
      root.classList.remove("has-lenis");
    }

    const onPreference = () => (reduce.matches ? stop() : start());

    // Link interni: stessa inerzia, focus sulla destinazione per tastiera e lettori.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
      const link = (event.target as Element | null)?.closest?.("a[href^='#']");
      if (!(link instanceof HTMLAnchorElement)) return;
      const id = link.hash.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      event.preventDefault();
      scrollToElement(target);
      history.pushState(null, "", `#${id}`);
      // Campi del modulo (riepilogo errori) e contenuto principale ricevono il focus.
      if (id === "contenuto" || target.matches("input, select, textarea, button, [tabindex]")) {
        target.focus({ preventScroll: true });
      }
    };

    start();
    publish();
    window.addEventListener("scroll", publish, { passive: true });
    reduce.addEventListener("change", onPreference);
    document.addEventListener("click", onClick);

    // Le scene fissate cambiano l'altezza della pagina: ricalcola dopo font e immagini.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    // Arrivo con un'ancora nell'URL: posiziona dopo il calcolo delle scene.
    if (location.hash.length > 1) {
      const target = document.getElementById(location.hash.slice(1));
      if (target) requestAnimationFrame(() => requestAnimationFrame(() => scrollToElement(target, { immediate: true })));
    }

    return () => {
      stop();
      window.removeEventListener("scroll", publish);
      reduce.removeEventListener("change", onPreference);
      document.removeEventListener("click", onClick);
      window.removeEventListener("load", refresh);
    };
  }, []);

  return null;
}
