"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CaretLeftIcon, CaretRightIcon, XIcon } from "@phosphor-icons/react";
import { altFor, focus, galleryImages, images } from "@/content/images";

/**
 * Composizione della griglia. Mobile: 2 colonne con righe complete.
 * Da lg: 12 colonne, 3 righe, nessuna cella vuota.
 */
const layout = [
  { cell: "col-span-2 aspect-[4/3] lg:col-span-5 lg:row-span-2 lg:aspect-auto", sizes: "(min-width: 1024px) 40vw, 100vw" },
  { cell: "aspect-[4/5] lg:col-span-4 lg:aspect-auto", sizes: "(min-width: 1024px) 32vw, 50vw" },
  { cell: "aspect-[4/5] lg:col-span-3 lg:aspect-auto", sizes: "(min-width: 1024px) 24vw, 50vw" },
  { cell: "aspect-[4/5] lg:col-span-3 lg:aspect-auto", sizes: "(min-width: 1024px) 24vw, 50vw" },
  { cell: "aspect-[4/5] lg:col-span-4 lg:row-span-2 lg:aspect-auto", sizes: "(min-width: 1024px) 32vw, 50vw" },
  { cell: "col-span-2 aspect-[3/2] lg:col-span-8 lg:aspect-auto", sizes: "(min-width: 1024px) 64vw, 100vw" },
];

const COUNT = galleryImages.length;

function stepIndex(current: number | null, delta: number): number | null {
  return current === null ? current : (current + delta + COUNT) % COUNT;
}

export function Gallery() {
  const items = galleryImages.map((key) => images[key]);
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const lastTrigger = useRef<number>(0);
  const illustrative = items.some((img) => img.illustrative);

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
      if (e.key === "ArrowRight") setIndex((current) => stepIndex(current, 1));
      if (e.key === "ArrowLeft") setIndex((current) => stepIndex(current, -1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const current = index === null ? null : items[index];

  return (
    <section id="galleria" aria-labelledby="galleria-title" className="surface-light bg-ivory">
      <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 md:py-32 lg:px-12 lg:py-40">
        <h2 id="galleria-title" className="display max-w-[16ch] text-[clamp(2.25rem,5.5vw,4rem)]" data-reveal>
          Galleria
        </h2>

        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 md:mt-16 lg:auto-rows-[minmax(15rem,20vw)] lg:grid-cols-12 lg:gap-6 2xl:auto-rows-[19rem]">
          {items.map((img, i) => (
            <li key={i} className={`relative ${layout[i]?.cell ?? "aspect-[4/5]"}`}>
              <button
                type="button"
                ref={(el) => {
                  triggerRefs.current[i] = el;
                }}
                onClick={() => open(i)}
                aria-haspopup="dialog"
                className="group absolute inset-0 block overflow-hidden bg-charcoal"
              >
                <Image
                  src={img.src}
                  alt=""
                  fill
                  placeholder="blur"
                  sizes={layout[i]?.sizes ?? "50vw"}
                  style={focus(img)}
                  className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-editorial)] group-hover:scale-[1.04] motion-reduce:transition-none"
                />
                <span className="sr-only">Ingrandisci: {altFor(img)}</span>
              </button>
            </li>
          ))}
        </ul>

        {illustrative && <p className="mt-6 text-sm text-olive-deep">Immagini a scopo illustrativo.</p>}
      </div>

      <dialog
        ref={dialogRef}
        aria-label="Galleria ingrandita"
        data-scroll-lock
        onClose={() => {
          setIndex(null);
          triggerRefs.current[lastTrigger.current]?.focus({ preventScroll: true });
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        className="surface-dark lightbox fixed inset-0 m-0 h-[100dvh] w-full bg-obsidian/95 p-0 text-ivory backdrop:bg-transparent"
      >
        {current && index !== null && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-4 py-3 sm:px-6">
              <p className="text-sm text-mist" aria-live="polite">
                Immagine {index + 1} di {items.length}
              </p>
              <button
                type="button"
                onClick={close}
                className="inline-flex size-11 items-center justify-center rounded-[var(--radius-control)] transition-colors hover:bg-ivory/10"
              >
                <XIcon size={24} weight="light" aria-hidden="true" />
                <span className="sr-only">Chiudi</span>
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
                  className="lightbox-image object-contain"
                />
              </div>
              <figcaption className="mx-auto max-w-[60ch] pt-4 text-center text-sm text-ivory/80">{altFor(current)}</figcaption>
            </figure>

            <div className="flex justify-center gap-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:pointer-events-none sm:absolute sm:inset-x-4 sm:top-1/2 sm:-translate-y-1/2 sm:justify-between sm:pb-0">
              <button
                type="button"
                onClick={() => step(-1)}
                className="pointer-events-auto inline-flex size-12 items-center justify-center rounded-[var(--radius-control)] border border-ivory/25 transition-colors hover:bg-ivory/10"
              >
                <CaretLeftIcon size={22} weight="light" aria-hidden="true" />
                <span className="sr-only">Immagine precedente</span>
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                className="pointer-events-auto inline-flex size-12 items-center justify-center rounded-[var(--radius-control)] border border-ivory/25 transition-colors hover:bg-ivory/10"
              >
                <CaretRightIcon size={22} weight="light" aria-hidden="true" />
                <span className="sr-only">Immagine successiva</span>
              </button>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
