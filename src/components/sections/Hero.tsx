import Image from "next/image";
import { altFor, focus, images } from "@/content/images";
import { QuickBook } from "./QuickBook";

/**
 * Hero informativo: chi, dove, come prenotare. Una sola azione principale
 * (Prenota) con scelta del servizio, nessuna animazione che ritardi i contenuti.
 */
export function Hero() {
  const hero = images.heroPortrait;

  return (
    <section id="top" aria-labelledby="hero-title" className="relative">
      <div id="top-sentinel" aria-hidden="true" className="absolute inset-x-0 top-0 h-4" />
      <div className="mx-auto grid max-w-[1360px] grid-cols-1 gap-10 px-5 pt-8 pb-12 sm:px-8 md:pt-14 lg:grid-cols-12 lg:gap-10 lg:px-10 lg:pt-14 lg:pb-12">
        <div className="lg:col-span-7 lg:pt-4">
          <h1 id="hero-title" className="type-display enter">
            <span className="sr-only">Style86 Parrucchieri &amp; Estetica: </span>
            Il salone di <span className="whitespace-nowrap">Via Ornato.</span>
          </h1>
          <p className="enter mt-6 max-w-[34rem] text-[1.125rem] leading-relaxed text-muted md:mt-8" style={{ "--d": 80 } as React.CSSProperties}>
            Parrucchieri ed estetica a Milano. Scegli il servizio, indica quando preferisci venire: il salone ti conferma
            l&apos;orario.
          </p>
          <div className="enter mt-8 md:mt-10" style={{ "--d": 140 } as React.CSSProperties}>
            <QuickBook />
          </div>
        </div>

        <figure className="lg:col-span-5">
          <div className="relative aspect-[16/11] overflow-hidden bg-line sm:aspect-[16/10] lg:aspect-auto lg:h-[clamp(26rem,calc(100dvh-15rem),40rem)]">
            <Image
              src={hero.src}
              alt={altFor(hero)}
              fill
              priority
              placeholder="blur"
              sizes="(min-width: 1024px) 40vw, 100vw"
              style={focus(hero)}
              className="photo object-cover"
            />
          </div>
          <figcaption className="mt-2 text-[0.8125rem] text-muted">Foto di repertorio</figcaption>
        </figure>
      </div>
    </section>
  );
}
