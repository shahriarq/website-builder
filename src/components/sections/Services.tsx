"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { services } from "@/content/services";
import { altFor, focus, images } from "@/content/images";
import { bookingAnchor } from "@/config/navigation";
import { requestService } from "@/lib/booking/events";
import { MOTION, gsap, revealOnFocus, ScrollTrigger, useGSAP, type MotionConditions } from "@/lib/motion";

/**
 * Scena 3, i servizi. Da tablet in su la sezione si fissa e i pannelli
 * scorrono in orizzontale mentre si scorre in verticale; su telefono e con
 * movimento ridotto sono un elenco verticale. Durata e prezzo compaiono solo
 * quando sono dati reali.
 */
export function Services() {
  const hasMeta = services.some((s) => s.duration || s.price);
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, (ctx) => {
        const { wide } = ctx.conditions as MotionConditions;
        const section = sectionRef.current!;
        const track = trackRef.current!;

        if (!wide) {
          // Telefono: ogni pannello entra con una leggera salita della foto.
          gsap.utils.toArray<HTMLElement>("[data-service-photo]").forEach((photo) => {
            gsap.fromTo(photo, { scale: 1.12 }, { scale: 1, ease: "none", scrollTrigger: { trigger: photo, start: "top bottom", end: "bottom center", scrub: true } });
          });
          return;
        }

        section.classList.add("is-track");
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        const st = tween.scrollTrigger as ScrollTrigger;

        // Le foto si spostano piu' lentamente del pannello: profondita'.
        gsap.utils.toArray<HTMLElement>("[data-service-photo]").forEach((photo) => {
          gsap.fromTo(
            photo,
            { xPercent: -7, scale: 1.18 },
            {
              xPercent: 7,
              scale: 1.18,
              ease: "none",
              scrollTrigger: { trigger: photo.parentElement, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
            },
          );
        });

        // Focus da tastiera su un pannello fuori vista: porta lo scorrimento al pannello.
        const offFocus = revealOnFocus(track, (el) => {
          const panel = el.closest<HTMLElement>("li");
          if (!panel || distance() === 0) return;
          const p = Math.min(1, Math.max(0, (panel.offsetLeft - 80) / distance()));
          window.scrollTo({ top: st.start + (st.end - st.start) * p, behavior: "auto" });
        });

        return () => {
          offFocus();
          section.classList.remove("is-track");
        };
      });
      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="servizi" aria-labelledby="servizi-title" className="services">
      <div className="services-inner">
        <div className="services-head mx-auto w-full max-w-[1360px] px-5 sm:px-8 lg:px-10">
          <h2 id="servizi-title" className="type-h2" data-reveal>
            Servizi
          </h2>
          <p className="mt-4 max-w-[30rem] text-muted" data-reveal>
            {hasMeta
              ? "Durate e prezzi indicativi: il salone li conferma con l'appuntamento."
              : "Durata e prezzo dipendono da capelli e richiesta: il salone te li conferma quando risponde alla prenotazione."}
          </p>
        </div>

        <ul ref={trackRef} className="services-track">
          {services.map((service, i) => {
            const img = images[service.image];
            return (
              <li key={service.id} className="services-panel">
                <div className="services-photo relative aspect-[4/5] overflow-hidden bg-raised">
                  <Image
                    src={img.src}
                    alt={altFor(img)}
                    fill
                    placeholder="blur"
                    sizes="(min-width: 768px) 30rem, 90vw"
                    style={focus(img)}
                    className="photo object-cover"
                    data-service-photo
                  />
                  <span className="type-figure absolute top-0 left-0 bg-paper px-3 pt-3 pb-2 text-[1.5rem] text-ink" aria-hidden="true">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="type-h3 mt-5">{service.name}</h3>
                <p className="mt-2 max-w-[30rem] text-[0.9375rem] leading-relaxed text-muted">{service.description}</p>
                {(service.duration || service.price) && (
                  <p className="mt-2 text-[0.9375rem] font-semibold tabular-nums">
                    {[service.duration, service.price].filter(Boolean).join(" / ")}
                  </p>
                )}
                <a
                  href={bookingAnchor}
                  onClick={() => requestService(service.id, true)}
                  className="link mt-3 inline-flex min-h-11 items-center gap-1.5 text-[0.9375rem] font-semibold"
                >
                  Prenota<span className="sr-only"> {service.name.toLowerCase()}</span>
                  <ArrowRightIcon size={16} aria-hidden="true" />
                </a>
              </li>
            );
          })}
          <li className="services-panel services-note">
            <p className="type-h3 max-w-[18rem]">Non trovi quello che cerchi?</p>
            <p className="mt-3 max-w-[22rem] text-[0.9375rem] text-muted">
              Nel modulo scegli “Altro” e raccontaci cosa desideri. Le foto dei servizi sono di repertorio.
            </p>
            <a href={bookingAnchor} className="link mt-4 inline-flex min-h-11 items-center gap-1.5 text-[0.9375rem] font-semibold">
              Prenota
              <ArrowRightIcon size={16} aria-hidden="true" />
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
