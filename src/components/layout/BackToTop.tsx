"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpIcon } from "@phosphor-icons/react";
import { goToAnchor } from "@/lib/scroll";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

const R = 21;
const CIRCUMFERENCE = 2 * Math.PI * R;

/**
 * Torna all'inizio: un cerchio minimale con una freccia sottile. Compare dopo
 * l'hero; l'anello in bronzo si riempie con l'avanzare della lettura.
 * L'anello e' aggiornato direttamente nel DOM (nessun ridisegno React a ogni scorrimento).
 * Su telefono sta sopra la barra di prenotazione; si fa da parte mentre il
 * modulo di prenotazione e' visibile, per non coprire campi e testo.
 */
export function BackToTop({ lang }: { lang: Locale }) {
  const label = getDictionary(lang).common.backToTop;
  const [scrolled, setScrolled] = useState(false);
  const [overForm, setOverForm] = useState(false);
  const visible = scrolled && !overForm;
  const ringRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      ringRef.current?.style.setProperty("stroke-dashoffset", String(CIRCUMFERENCE * (1 - progress)));
      setScrolled(window.scrollY > window.innerHeight * 0.9);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    const form = document.getElementById("prenota");
    const formObserver = new IntersectionObserver(([entry]) => setOverForm(entry.isIntersecting), { rootMargin: "-15% 0px -15% 0px" });
    if (form) formObserver.observe(form);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      formObserver.disconnect();
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() => goToAnchor("#top")}
      aria-label={label}
      title={label}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={`back-to-top group fixed right-4 bottom-[calc(5.25rem+env(safe-area-inset-bottom))] z-30 inline-flex size-12 items-center justify-center rounded-full border border-line bg-paper/85 text-ink backdrop-blur-sm transition-[opacity,transform,border-color] duration-500 ease-[var(--ease-out-expo)] hover:border-line-strong motion-reduce:transition-none sm:right-6 sm:bottom-6 lg:right-8 lg:bottom-8 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
        <circle
          ref={ringRef}
          cx="24"
          cy="24"
          r={R}
          fill="none"
          stroke="var(--color-bronze)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
        />
      </svg>
      <ArrowUpIcon size={18} weight="light" aria-hidden="true" className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-0.5" />
    </button>
  );
}
