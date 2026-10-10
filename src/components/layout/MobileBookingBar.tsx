"use client";

import { useEffect, useState } from "react";
import { PhoneIcon } from "@phosphor-icons/react";
import { site, telHref } from "@/config/site";
import { bookingAnchor } from "@/config/navigation";

/**
 * Barra di prenotazione su mobile: compare dopo l'hero e si nasconde quando
 * il modulo o il footer sono visibili, per non coprire contenuti utili.
 */
export function MobileBookingBar() {
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
      className={`surface-dark fixed inset-x-0 bottom-0 z-30 border-t border-ivory/10 bg-obsidian/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-sm transition-[transform,opacity] duration-500 ease-[var(--ease-editorial)] motion-reduce:transition-none lg:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
      aria-hidden={!show}
      inert={!show}
    >
      <div className="mx-auto flex max-w-lg gap-3">
        <a href={bookingAnchor} className="btn btn-brass min-h-12 flex-1">
          Prenota un appuntamento
        </a>
        <a href={telHref()} className="btn btn-outline-light min-h-12 w-12 shrink-0 px-0" aria-label={`Chiama ${site.contact.phoneDisplay}`}>
          <PhoneIcon size={20} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
