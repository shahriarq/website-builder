import Image from "next/image";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/config/site";
import { bookingAnchor } from "@/config/navigation";
import { altFor, focus, images } from "@/content/images";

export function Hero() {
  const hero = images.heroPortrait;

  return (
    <section id="top" aria-labelledby="hero-title" className="surface-dark relative isolate overflow-hidden bg-obsidian">
      {/* Sentinella: l'header diventa pieno quando esce dal viewport. */}
      <div id="hero-sentinel" aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-20" />

      {/* Fotografia: a tutta pagina su mobile, colonna destra da lg. */}
      <div className="absolute inset-0 -z-10 lg:left-auto lg:w-[45%]">
        <div className="hero-reveal absolute inset-0 overflow-hidden">
          <div className="parallax-hero absolute inset-x-0 -top-[8%] h-[116%]">
            <Image
              src={hero.src}
              alt={altFor(hero)}
              fill
              priority
              placeholder="blur"
              sizes="(min-width: 1024px) 45vw, 100vw"
              style={focus(hero)}
              className="hero-reveal-img object-cover"
            />
          </div>
        </div>
        {/* Velature per la leggibilita': dal basso su mobile, da sinistra da lg. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-obsidian from-30% via-obsidian/70 via-55% to-obsidian/5 lg:bg-gradient-to-r lg:from-obsidian lg:from-0% lg:via-obsidian/10 lg:via-35% lg:to-transparent"
        />
      </div>

      <div className="mx-auto grid min-h-[100dvh] max-w-[1440px] grid-cols-1 content-end px-5 pt-28 pb-8 sm:px-8 lg:grid-rows-[1fr_auto] lg:content-stretch lg:px-12 lg:pt-32 lg:pb-5">
        <div className="max-w-[34rem] self-center lg:max-w-[46%] lg:pb-10">
          <p className="eyebrow hero-rise text-brass" style={{ "--d": 0 } as React.CSSProperties}>
            Milano · {site.category}
          </p>

          <h1 id="hero-title" className="sr-only">
            {site.name}, Milano
          </h1>

          {/* Wordmark su mobile, sopra il titolo. */}
          <p
            aria-hidden="true"
            className="wordmark hero-rise mt-5 text-[clamp(4.25rem,21vw,7rem)] leading-[0.82] tracking-[0.01em] lg:hidden"
            style={{ "--d": 80 } as React.CSSProperties}
          >
            STYLE<span className="text-brass">86</span>
          </p>

          <p className="display mt-6 text-[clamp(2.5rem,9.5vw,3.25rem)] text-ivory lg:mt-7 lg:text-[clamp(3.5rem,5.4vw,5.5rem)]">
            <span className="hero-rise block" style={{ "--d": 160 } as React.CSSProperties}>
              Il tuo stile.
            </span>
            <span className="hero-rise block" style={{ "--d": 260 } as React.CSSProperties}>
              La tua <em className="font-light italic text-brass">firma</em>.
            </span>
          </p>

          <p
            className="hero-rise mt-5 max-w-[30rem] text-base leading-relaxed text-ivory/85 sm:text-[1.0625rem] lg:mt-7"
            style={{ "--d": 360 } as React.CSSProperties}
          >
            Parrucchieri ed estetica in Via Ornato, a Milano. Un taglio pensato su di te, rifinito con cura in ogni dettaglio.
          </p>

          <div
            className="hero-rise mt-7 flex flex-col gap-3 xs:flex-row xs:flex-wrap lg:mt-9"
            style={{ "--d": 420 } as React.CSSProperties}
          >
            <a href={bookingAnchor} className="btn btn-brass">
              Prenota un appuntamento
              <ArrowRightIcon size={18} weight="regular" className="btn-icon" aria-hidden="true" />
            </a>
            <a href="#servizi" className="btn btn-outline-light">
              Scopri i servizi
            </a>
          </div>
        </div>

        {/* Wordmark monumentale da lg: attraversa il testo e la fotografia. */}
        <p
          aria-hidden="true"
          className="wordmark hero-rise pointer-events-none -mx-[0.04em] hidden select-none whitespace-nowrap text-[18vw] leading-[0.8] tracking-[-0.01em] text-ivory lg:block 2xl:text-[16.5rem]"
          style={{ "--d": 200 } as React.CSSProperties}
        >
          STYLE<span className="text-brass">86</span>
        </p>
      </div>
    </section>
  );
}
