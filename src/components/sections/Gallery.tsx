"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CaretLeftIcon, CaretRightIcon, PlusIcon } from "@phosphor-icons/react";
import { altFor, focus, galleryImages, images } from "@/content/images";

/**
 * Capitolo III, galleria editoriale: impaginazione asimmetrica da rivista,
 * ogni foto si apre da una maschera e scorre con una parallasse diversa.
 * Un clic apre la foto a tutto schermo (lightbox con frecce ed Esc).
 * Foto di repertorio: riferimenti di stile, non lavori del salone.
 */
const COUNT = galleryImages.length;

/** Impaginazione: posizione nella griglia a 12 colonne, formato e velocita' di parallasse. */
const layout = [
  { cell: "col-span-12 md:col-span-7", ratio: "aspect-[3/2]", speed: 0.1, clip: "up" },
  { cell: "col-span-8 col-start-5 md:col-span-4 md:col-start-9 md:mt-40", ratio: "aspect-[3/4]", speed: 0.24, clip: "left" },
  { cell: "col-span-9 md:col-span-4 md:col-start-2 md:-mt-24", ratio: "aspect-[4/5]", speed: 0.2, clip: "left" },
  { cell: "col-span-12 md:col-span-6 md:col-start-7 md:mt-28", ratio: "aspect-[16/10]", speed: 0.12, clip: "up" },
  { cell: "col-span-12 md:col-span-6 md:col-start-1 md:-mt-8", ratio: "aspect-[3/2]", speed: 0.1, clip: "up" },
  { cell: "col-span-8 col-start-5 md:col-span-4 md:col-start-8 md:mt-24", ratio: "aspect-[4/5]", speed: 0.22, clip: "left" },
];

function stepIndex(current: number | null, delta: number): number | null {
  return current === null ? current : (current + delta + COUNT) % COUNT;
}

export function Gallery() {
  const items = galleryImages.map((key) => images[key]);
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const lastTrigger = useRef(0);

  const open = (i: number) => {
    lastTrigger.current = i;
    setIndex(i);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();
  const step = (delta: number) => setIndex((current) => stepIndex(current, delta));

  const isOpen = index !== null;
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIndex((c) => stepIndex(c, 1));
      if (e.key === "ArrowLeft") setIndex((c) => stepIndex(c, -1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const current = index === null ? null : items[index];
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section id="galleria" aria-labelledby="galleria-title" className="relative">
      <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 md:py-36 lg:px-12">
        <div className="chapter mb-14 md:mb-20">
          <span className="kicker kicker-bronze">III</span>
          <p className="kicker">Galleria</p>
        </div>

        <div className="grid gap-8 md:grid-cols-12 md:items-end md:gap-6">
          <h2 id="galleria-title" className="display display-l md:col-span-8" data-split>
            Stile da portare <em>in poltrona.</em>
          </h2>
          <p className="lede md:col-span-4" data-reveal>
            Riferimenti di taglio, barba e portamento. Sono foto di repertorio, non lavori del salone: mostrale al barbiere e costruite
            insieme il tuo.
          </p>
        </div>

        <ul className="mt-16 grid grid-cols-12 gap-x-4 gap-y-14 md:mt-28 md:gap-x-6 md:gap-y-24">
          {items.map((img, i) => {
            const l = layout[i % layout.length];
            return (
              <li key={i} className={l.cell}>
                <figure>
                  <button
                    type="button"
                    ref={(el) => {
                      triggerRefs.current[i] = el;
                    }}
                    onClick={() => open(i)}
                    aria-haspopup="dialog"
                    className={`group relative block w-full ${l.ratio}`}
                  >
                    {/* La maschera e' su un livello interno: l'anello di focus del bottone resta visibile. */}
                    <span className="absolute inset-0 block overflow-hidden bg-raised" data-clip={l.clip}>
                      <span className="absolute inset-x-0 -top-[10%] block h-[120%]" data-parallax={l.speed}>
                        <Image
                          src={img.src}
                          alt=""
                          fill
                          placeholder="blur"
                          sizes="(min-width: 768px) 55vw, 100vw"
                          style={focus(img)}
                          className="photo object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04] motion-reduce:transition-none"
                        />
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute right-4 bottom-4 inline-flex size-11 items-center justify-center bg-ivory text-charcoal opacity-0 transition-[opacity,transform] duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100"
                    >
                      <PlusIcon size={18} />
                    </span>
                    <span className="sr-only">Ingrandisci: {altFor(img)}</span>
                  </button>
                  <figcaption className="caption mt-3 flex justify-between gap-4">
                    <span className="tabular-nums">
                      {pad(i + 1)} / {pad(items.length)}
                    </span>
                    <span>Foto di repertorio</span>
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </div>

      <dialog
        ref={dialogRef}
        aria-label="Ispirazioni ingrandite"
        data-scroll-lock
        onClose={() => {
          setIndex(null);
          triggerRefs.current[lastTrigger.current]?.focus({
            preventScroll: true,
          });
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        className="lightbox fixed inset-0 m-0 h-[100dvh] w-full bg-paper p-0 text-ink backdrop:bg-transparent"
      >
        {current && index !== null && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-4 py-3 sm:px-6">
              <p className="kicker tabular-nums" aria-live="polite">
                Immagine {index + 1} di {items.length}
              </p>
              <button
                type="button"
                onClick={close}
                className="inline-flex h-11 items-center gap-3 border border-line-strong px-4 text-[0.75rem] font-semibold tracking-[0.18em] uppercase"
              >
                Chiudi
              </button>
            </div>
            <figure className="relative mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-4 pb-4 sm:px-20">
              <div className="relative flex-1">
                <Image
                  key={index}
                  src={current.src}
                  alt={altFor(current)}
                  fill
                  sizes="(min-width: 1280px) 1200px, 100vw"
                  className="lightbox-image photo object-contain"
                />
              </div>
              <figcaption className="mx-auto max-w-[60ch] pt-4 text-center text-sm text-muted">
                {altFor(current)}. Foto di repertorio.
              </figcaption>
            </figure>
            <div className="flex justify-center gap-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:pointer-events-none sm:absolute sm:inset-x-4 sm:top-1/2 sm:-translate-y-1/2 sm:justify-between sm:pb-0">
              <button
                type="button"
                onClick={() => step(-1)}
                className="pointer-events-auto inline-flex size-12 items-center justify-center border border-line-strong bg-paper transition-colors hover:bg-ink hover:text-paper"
              >
                <CaretLeftIcon size={22} aria-hidden="true" />
                <span className="sr-only">Immagine precedente</span>
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                className="pointer-events-auto inline-flex size-12 items-center justify-center border border-line-strong bg-paper transition-colors hover:bg-ink hover:text-paper"
              >
                <CaretRightIcon size={22} aria-hidden="true" />
                <span className="sr-only">Immagine successiva</span>
              </button>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
