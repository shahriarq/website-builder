"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { services } from "@/content/services";
import { altFor, focus, images } from "@/content/images";
import { bookingAnchor } from "@/config/navigation";
import { requestService } from "@/lib/booking/events";

/**
 * Servizi: elenco tipografico con immagine fissa che cambia con la voce
 * attiva (passaggio del mouse o focus da tastiera). Su mobile ogni voce
 * mostra la propria immagine.
 */
export function Services() {
  const [active, setActive] = useState(0);
  const hasMeta = services.some((s) => s.duration || s.price);

  return (
    <section id="servizi" aria-labelledby="servizi-title" className="surface-light border-t border-obsidian/10 bg-ivory">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-5 pt-20 pb-24 sm:px-8 md:pt-28 md:pb-32 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:pb-40">
        {/* Immagine fissa, solo da lg. */}
        <div className="hidden lg:col-span-5 lg:block">
          <div className="sticky top-28">
            <div className="relative aspect-[4/5] overflow-hidden bg-charcoal">
              {services.map((service, i) => {
                const img = images[service.image];
                return (
                  <Image
                    key={service.id}
                    src={img.src}
                    alt={i === active ? altFor(img) : ""}
                    aria-hidden={i === active ? undefined : true}
                    fill
                    placeholder="blur"
                    sizes="(min-width: 1024px) 38vw, 1px"
                    style={focus(img)}
                    className={`object-cover transition-[opacity,transform] duration-[900ms] ease-[var(--ease-editorial)] motion-reduce:transition-none ${
                      i === active ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <h2 id="servizi-title" className="display text-[clamp(2.25rem,5.5vw,4rem)]" data-reveal>
            Servizi
          </h2>
          <p className="mt-5 max-w-[34rem] text-[1.0625rem] leading-relaxed text-charcoal" data-reveal>
            Scegli da dove partire. Durata e dettagli si definiscono insieme al salone quando confermi l&apos;appuntamento.
          </p>

          <ul className="mt-12 md:mt-16">
            {services.map((service, i) => {
              const img = images[service.image];
              return (
                <li
                  key={service.id}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group border-t border-obsidian/15 py-8 last:border-b md:py-10"
                >
                  <div className="relative mb-6 aspect-[4/3] overflow-hidden bg-charcoal lg:hidden">
                    <Image
                      src={img.src}
                      alt={altFor(img)}
                      fill
                      placeholder="blur"
                      sizes="(min-width: 640px) 80vw, 100vw"
                      style={focus(img)}
                      className="object-cover"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end sm:gap-8">
                    <div>
                      <h3 className="display text-[2.25rem] leading-none transition-colors duration-500 md:text-[2.75rem] lg:group-hover:text-brass-deep">
                        {service.name}
                      </h3>
                      <p className="mt-4 max-w-[30rem] leading-relaxed text-charcoal">{service.description}</p>
                      {(service.duration || service.price) && (
                        <p className="mt-4 text-sm font-semibold text-olive-deep">
                          {[service.duration, service.price].filter(Boolean).join(" / ")}
                        </p>
                      )}
                    </div>
                    <a
                      href={bookingAnchor}
                      onClick={() => requestService(service.id)}
                      className="inline-flex min-h-11 items-center gap-2 self-start text-[0.9375rem] font-semibold text-obsidian sm:self-end"
                    >
                      <span className="link-underline">
                        Prenota<span className="sr-only"> {service.name.toLowerCase()}</span>
                      </span>
                      <ArrowRightIcon
                        size={16}
                        weight="regular"
                        aria-hidden="true"
                        className="transition-transform duration-500 ease-[var(--ease-editorial)] group-hover:translate-x-1"
                      />
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>

          {!hasMeta && (
            <p className="mt-8 max-w-[34rem] text-sm leading-relaxed text-olive-deep">
              Non trovi quello che cerchi? Nel modulo scegli “Altro o da definire insieme” e raccontaci cosa desideri.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
