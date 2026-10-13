"use client";

import { useEffect, useState } from "react";
import { ArrowRightIcon, PhoneIcon } from "@phosphor-icons/react";
import { site, telHref } from "@/config/site";
import { bookingAnchor } from "@/config/navigation";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

/**
 * Barra di prenotazione sui telefoni (da 640 px il bottone e' nell'header): compare dopo l'hero e si nasconde quando
 * il modulo o il footer sono visibili, per non coprire contenuti utili.
 */
export function MobileBookingBar({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);
  const [heroVisible, setHeroVisible] = useState(true);
  const [targetVisible, setTargetVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    const targets = ["prenota", "footer"].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const visible = new Set<Element>();

    const heroObserver = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), { threshold: 0.15 });
    const targetObserver = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target);
        else visible.delete(e.target);
      }
      setTargetVisible(visible.size > 0);
    });

    if (hero) heroObserver.observe(hero);
    targets.forEach((t) => targetObserver.observe(t));
    return () => {
      heroObserver.disconnect();
      targetObserver.disconnect();
    };
  }, []);

  const show = !heroVisible && !targetVisible;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-line-strong bg-paper px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-[transform,opacity] duration-300 ease-[var(--ease-out-quart)] motion-reduce:transition-none sm:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
      aria-hidden={!show}
      inert={!show}
    >
      <div className="mx-auto flex max-w-lg gap-3">
        <a href={bookingAnchor} className="btn btn-primary flex-1">
          {t.common.book}
          <ArrowRightIcon size={18} className="btn-icon" aria-hidden="true" />
        </a>
        <a href={telHref()} className="btn btn-secondary w-[3.25rem] shrink-0 px-0" aria-label={t.nav.callLabel(site.contact.phoneDisplay)}>
          <PhoneIcon size={20} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
