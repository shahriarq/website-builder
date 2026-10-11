"use client";

import Image from "next/image";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { services } from "@/content/services";
import { altFor, focus, images } from "@/content/images";
import { bookingAnchor } from "@/config/navigation";
import { requestService } from "@/lib/booking/events";

/**
 * Listino dei servizi: righe compatte, leggibili come il cartello di un
 * salone. Durata e prezzo compaiono solo quando sono dati reali.
 */
export function Services() {
  const hasMeta = services.some((s) => s.duration || s.price);

  return (
    <section id="servizi" aria-labelledby="servizi-title" className="mx-auto max-w-[1360px] px-5 pt-20 pb-20 sm:px-8 md:pt-28 lg:px-10">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <h2 id="servizi-title" className="type-h2" data-reveal>
              Servizi
            </h2>
            <p className="mt-5 max-w-[26rem] text-muted" data-reveal>
              {hasMeta
                ? "Durate e prezzi indicativi: il salone li conferma con l'appuntamento."
                : "Durata e prezzo dipendono da capelli e richiesta: il salone te li conferma quando risponde alla prenotazione."}
            </p>
          </div>
        </div>

        <ul className="rule-top lg:col-span-8">
          {services.map((service) => {
            const img = images[service.image];
            return (
              <li key={service.id} className="group grid grid-cols-[4.5rem_1fr] gap-x-5 gap-y-3 border-b border-line py-6 sm:grid-cols-[6.5rem_1fr_auto] sm:items-center sm:gap-x-8 md:py-7">
                <div className="relative row-span-2 aspect-square overflow-hidden bg-line sm:row-span-1">
                  <Image src={img.src} alt={altFor(img)} fill placeholder="blur" sizes="(min-width: 640px) 104px, 72px" style={focus(img)} className="photo object-cover transition-transform duration-500 ease-[var(--ease-out-quart)] group-hover:scale-[1.04] motion-reduce:transition-none" />
                </div>
                <div>
                  <h3 className="type-h3">{service.name}</h3>
                  <p className="mt-2 max-w-[38rem] text-[0.9375rem] leading-relaxed text-muted">{service.description}</p>
                  {(service.duration || service.price) && (
                    <p className="mt-2 text-[0.9375rem] font-semibold tabular-nums">
                      {[service.duration, service.price].filter(Boolean).join(" / ")}
                    </p>
                  )}
                </div>
                <a
                  href={bookingAnchor}
                  onClick={() => requestService(service.id, true)}
                  className="link col-start-2 inline-flex min-h-11 items-center gap-1.5 justify-self-start text-[0.9375rem] font-semibold sm:col-start-auto sm:justify-self-end"
                >
                  Prenota<span className="sr-only"> {service.name.toLowerCase()}</span>
                  <ArrowRightIcon size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      <p className="mt-6 text-[0.8125rem] text-muted lg:ml-[calc(33.333%+0.833rem)]">
        Non trovi quello che cerchi? Nel modulo scegli “Altro” e raccontaci cosa desideri. Foto di repertorio.
      </p>
    </section>
  );
}
