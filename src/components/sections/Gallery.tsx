"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, CaretLeftIcon, CaretRightIcon, XIcon } from "@phosphor-icons/react";
import { altFor, focus, galleryImages, images } from "@/content/images";

/**
 * Ispirazioni: riferimenti di taglio e piega da portare in salone.
 * Sono foto di repertorio, presentate come tali (non come lavori del salone).
 * Striscia orizzontale con scorrimento a scatti; si apre in un lightbox.
 */
const COUNT = galleryImages.length;
/** Larghezza delle tessere: alterna formati verticali e orizzontali. */
const widths = ["w-[78vw] sm:w-[22rem]", "w-[78vw] sm:w-[30rem]", "w-[78vw] sm:w-[19rem]", "w-[78vw] sm:w-[22rem]", "w-[78vw] sm:w-[19rem]", "w-[78vw] sm:w-[30rem]"];

function stepIndex(current: number | null, delta: number): number | null {
  return current === null ? current : (current + delta + COUNT) % COUNT;
}

export function Gallery() {
  const items = galleryImages.map((key) => images[key]);
  const [index, setIndex] = useState<number | null>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const dialogRef = useRef<HTMLDialogElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const lastTrigger = useRef(0);

  // Stato delle frecce in base alla posizione della striscia (osservando i bordi).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const first = track.firstElementChild;
    const last = track.lastElementChild;
    if (!first || !last) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          setEdges((prev) => (e.target === first ? { ...prev, start: e.intersectionRatio > 0.9 } : { ...prev, end: e.intersectionRatio > 0.9 }));
        }
      },
      { root: track, threshold: [0, 0.9, 1] },
    );
    io.observe(first);
    io.observe(last);
    return () => io.disconnect();
  }, []);

  const scrollByPage = (dir: number) => {
    const track = trackRef.current;
    if (!track) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({ left: dir * track.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" });
  };

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

  return (
    <section id="ispirazioni" aria-labelledby="ispirazioni-title" className="py-20 md:py-28">
      <div className="mx-auto flex max-w-[1360px] items-end justify-between gap-6 px-5 sm:px-8 lg:px-10">
        <div>
          <h2 id="ispirazioni-title" className="type-h2" data-reveal>
            Ispirazioni
          </h2>
          <p className="mt-5 max-w-[34rem] text-muted" data-reveal>
            Tagli e pieghe da portare in salone come riferimento. Foto di repertorio, non lavori del salone.
          </p>
        </div>
        <div className="hidden gap-2 md:flex">
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            disabled={edges.start}
            className="inline-flex size-12 items-center justify-center border border-line-strong transition-colors hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:opacity-30"
          >
            <ArrowLeftIcon size={20} aria-hidden="true" />
            <span className="sr-only">Ispirazioni precedenti</span>
          </button>
          <button
            type="button"
            onClick={() => scrollByPage(1)}
            disabled={edges.end}
            className="inline-flex size-12 items-center justify-center border border-line-strong transition-colors hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:opacity-30"
          >
            <ArrowRightIcon size={20} aria-hidden="true" />
            <span className="sr-only">Ispirazioni successive</span>
          </button>
        </div>
      </div>

      <ul
        ref={trackRef}
        tabIndex={0}
        aria-label="Ispirazioni, scorri in orizzontale"
        className="mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-4 [scrollbar-width:thin] sm:scroll-px-8 sm:px-8 md:gap-4 lg:scroll-px-[max(2.5rem,calc((100vw-1360px)/2+2.5rem))] lg:px-[max(2.5rem,calc((100vw-1360px)/2+2.5rem))]"
      >
        {items.map((img, i) => (
          <li key={i} className={`shrink-0 snap-start ${widths[i] ?? "w-[78vw] sm:w-[22rem]"}`}>
            <button
              type="button"
              ref={(el) => {
                triggerRefs.current[i] = el;
              }}
              onClick={() => open(i)}
              aria-haspopup="dialog"
              className="group relative block aspect-[4/5] w-full overflow-hidden bg-line sm:aspect-auto sm:h-[26rem]"
            >
              <Image
                src={img.src}
                alt=""
                fill
                placeholder="blur"
                sizes="(min-width: 640px) 480px, 78vw"
                style={focus(img)}
                className="photo object-cover transition-transform duration-700 ease-[var(--ease-out-quart)] group-hover:scale-[1.03] motion-reduce:transition-none"
              />
              <span className="sr-only">Ingrandisci: {altFor(img)}</span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label="Ispirazioni ingrandite"
        data-scroll-lock
        onClose={() => {
          setIndex(null);
          triggerRefs.current[lastTrigger.current]?.focus({ preventScroll: true });
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        className="lightbox fixed inset-0 m-0 h-[100dvh] w-full bg-paper p-0 text-ink backdrop:bg-transparent"
      >
        {current && index !== null && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-4 py-3 sm:px-6">
              <p className="text-sm text-muted tabular-nums" aria-live="polite">
                Immagine {index + 1} di {items.length}
              </p>
              <button type="button" onClick={close} className="inline-flex size-11 items-center justify-center bg-ink text-paper">
                <XIcon size={22} aria-hidden="true" />
                <span className="sr-only">Chiudi</span>
              </button>
            </div>
            <figure className="relative mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-4 pb-4 sm:px-20">
              <div className="relative flex-1">
                <Image key={index} src={current.src} alt={altFor(current)} fill sizes="(min-width: 1280px) 1200px, 100vw" className="lightbox-image photo object-contain" />
              </div>
              <figcaption className="mx-auto max-w-[60ch] pt-4 text-center text-sm text-muted">{altFor(current)}. Foto di repertorio.</figcaption>
            </figure>
            <div className="flex justify-center gap-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:pointer-events-none sm:absolute sm:inset-x-4 sm:top-1/2 sm:-translate-y-1/2 sm:justify-between sm:pb-0">
              <button type="button" onClick={() => step(-1)} className="pointer-events-auto inline-flex size-12 items-center justify-center border border-line-strong bg-paper transition-colors hover:bg-ink hover:text-paper">
                <CaretLeftIcon size={22} aria-hidden="true" />
                <span className="sr-only">Immagine precedente</span>
              </button>
              <button type="button" onClick={() => step(1)} className="pointer-events-auto inline-flex size-12 items-center justify-center border border-line-strong bg-paper transition-colors hover:bg-ink hover:text-paper">
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
