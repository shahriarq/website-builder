"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { services } from "@/content/services";
import { focus, images } from "@/content/images";
import { bookingAnchor } from "@/config/navigation";
import { requestService } from "@/lib/booking/events";
import { gsap } from "@/lib/motion";

/**
 * Capitolo II, i servizi: un indice editoriale. Su desktop con mouse, la
 * foto del servizio segue il cursore aprendosi da una maschera e cambia
 * scorrendo tra le righe; con la tastiera compare accanto alla riga a fuoco.
 * Su touch ogni riga mostra la sua foto. Durata e prezzo solo se reali.
 */
export function Services() {
  const listRef = useRef<HTMLUListElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [pointer, setPointer] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)");
    const update = () => setPointer(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Anteprima che segue il cursore con un leggero ritardo (quickTo = un solo tween riutilizzato).
  useEffect(() => {
    const list = listRef.current;
    const preview = previewRef.current;
    if (!pointer || !list || !preview) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const xTo = gsap.quickTo(preview, "x", {
      duration: reduce ? 0 : 0.7,
      ease: "power3",
    });
    const yTo = gsap.quickTo(preview, "y", {
      duration: reduce ? 0 : 0.7,
      ease: "power3",
    });
    const rTo = gsap.quickTo(preview, "rotation", {
      duration: reduce ? 0 : 0.9,
      ease: "power3",
    });
    let lastX = 0;
    const onMove = (e: PointerEvent) => {
      const w = preview.offsetWidth;
      const h = preview.offsetHeight;
      xTo(e.clientX + 32);
      yTo(e.clientY - h / 2);
      rTo(gsap.utils.clamp(-6, 6, (e.clientX - lastX) * 0.4));
      lastX = e.clientX;
      if (e.clientX + 32 + w > window.innerWidth) xTo(e.clientX - w - 32);
    };
    list.addEventListener("pointermove", onMove);
    return () => list.removeEventListener("pointermove", onMove);
  }, [pointer]);

  // Tastiera: posiziona l'anteprima accanto alla riga che riceve il focus.
  function placeBesideRow(row: HTMLElement) {
    const preview = previewRef.current;
    if (!pointer || !preview) return;
    const rect = row.getBoundingClientRect();
    gsap.set(preview, {
      x: rect.right - preview.offsetWidth - 24,
      y: rect.top + rect.height / 2 - preview.offsetHeight / 2,
      rotation: 0,
    });
  }

  const hasMeta = services.some((s) => s.duration || s.price);

  return (
    <section id="servizi" aria-labelledby="servizi-title" className="relative">
      <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 md:py-36 lg:px-12">
        <div className="chapter mb-14 md:mb-20">
          <span className="kicker kicker-bronze">II</span>
          <p className="kicker">Servizi</p>
        </div>

        <div className="grid gap-8 md:grid-cols-12 md:items-end md:gap-6">
          <h2 id="servizi-title" className="display display-l md:col-span-7" data-split>
            Fatti su <em>misura,</em> uno alla volta.
          </h2>
          <p className="lede md:col-span-4 md:col-start-9" data-reveal>
            {hasMeta
              ? "Durate e prezzi indicativi: il salone li conferma con l'appuntamento."
              : "Durata e prezzo dipendono da capelli e richiesta: il salone te li conferma quando risponde alla prenotazione."}
          </p>
        </div>

        <ul ref={listRef} className="services-list mt-16 md:mt-24" onPointerLeave={() => setActive(null)}>
          {services.map((service, i) => {
            const img = images[service.image];
            return (
              <li
                key={service.id}
                className="service-row group"
                onPointerEnter={() => setActive(i)}
                onFocus={(e) => {
                  setActive(i);
                  placeBesideRow(e.currentTarget);
                }}
                onBlur={() => setActive(null)}
              >
                <div className="grid grid-cols-[1fr_auto] items-center gap-x-5 gap-y-4 py-7 md:py-9 lg:grid-cols-[4rem_minmax(0,1.3fr)_minmax(0,1fr)_auto] lg:gap-x-10">
                  <span className="kicker kicker-bronze hidden lg:block" aria-hidden="true">
                    0{i + 1}
                  </span>
                  <h3 className="service-name display text-[clamp(2.6rem,6.5vw,5.75rem)]">{service.name}</h3>

                  {/* Foto in riga su touch e schermi stretti */}
                  <div className="relative row-span-2 aspect-[3/4] w-[clamp(5.5rem,22vw,9rem)] overflow-hidden bg-raised lg:hidden">
                    <Image src={img.src} alt="" fill placeholder="blur" sizes="9rem" style={focus(img)} className="photo object-cover" />
                  </div>

                  <div className="col-start-1 lg:col-start-auto">
                    <p className="max-w-[32rem] text-[0.9875rem] leading-relaxed text-muted">{service.description}</p>
                    {(service.duration || service.price) && (
                      <p className="mt-2 text-[0.9375rem] tabular-nums">{[service.duration, service.price].filter(Boolean).join(" / ")}</p>
                    )}
                  </div>
                  <a
                    href={bookingAnchor}
                    onClick={() => requestService(service.id, true)}
                    className="col-span-2 inline-flex min-h-11 items-center gap-2 justify-self-start text-[0.8125rem] font-semibold tracking-[0.16em] uppercase lg:col-span-1 lg:justify-self-end"
                  >
                    <span className="link-quiet group-hover:bg-[length:100%_1px]">Prenota</span>
                    <span className="sr-only"> {service.name.toLowerCase()}</span>
                    <ArrowRightIcon size={16} aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1" />
                  </a>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="caption mt-8">
          Non trovi quello che cerchi? Nel modulo scegli “Altro” e raccontaci cosa desideri. Foto di repertorio.
        </p>
      </div>

      {/* Anteprima che segue il cursore (decorativa: le righe hanno gia' nome e descrizione). */}
      {pointer && (
        <div ref={previewRef} className="service-preview" data-on={active !== null ? "" : undefined} aria-hidden="true">
          {services.map((service, i) => {
            const img = images[service.image];
            return (
              <div key={service.id} className="service-preview-img" data-active={active === i ? "" : undefined}>
                <Image src={img.src} alt="" fill sizes="20rem" style={focus(img)} className="photo object-cover" />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
