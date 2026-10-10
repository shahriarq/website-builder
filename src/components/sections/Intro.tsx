import Image from "next/image";
import { altFor, focus, images } from "@/content/images";

/**
 * Introduzione editoriale. Il testo e' una proposta di tono di voce:
 * va riletto e approvato dal titolare (nessuna storia o dato inventato).
 */
export function Intro() {
  const detail = images.introDetail;

  return (
    <section id="salone" aria-labelledby="intro-title" className="surface-light bg-ivory">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-5 py-24 sm:px-8 md:grid-cols-12 md:gap-8 md:py-32 lg:px-12 lg:py-40">
        <div className="md:col-span-8 lg:col-span-7 lg:col-start-2">
          <h2 id="intro-title" className="display text-[clamp(2.25rem,6vw,4.5rem)]" data-reveal>
            Lo stile è personale.{" "}
            <span className="text-olive-deep">Per questo ogni appuntamento parte da te.</span>
          </h2>
          <div className="mt-10 grid gap-6 text-[1.0625rem] leading-relaxed text-charcoal sm:grid-cols-2 sm:gap-8 md:mt-14 lg:max-w-[46rem]">
            <p data-reveal style={{ "--reveal-delay": 80 } as React.CSSProperties}>
              Da Style86 il taglio nasce dall&apos;ascolto: il tuo viso, la natura dei tuoi capelli, il tempo che vuoi dedicare
              alla piega ogni mattina.
            </p>
            <p data-reveal style={{ "--reveal-delay": 160 } as React.CSSProperties}>
              Poi conta il dettaglio. Linee precise, proporzioni equilibrate e un risultato che resti bello anche nei giorni
              dopo il salone.
            </p>
          </div>
        </div>

        <figure className="md:col-span-4 md:mt-40 lg:col-span-3 lg:col-start-10 lg:mt-56">
          <div data-reveal="mask" className="relative aspect-[3/4] overflow-hidden bg-charcoal">
            <Image
              src={detail.src}
              alt={altFor(detail)}
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 22vw, (min-width: 768px) 33vw, 100vw"
              style={focus(detail)}
              className="object-cover"
            />
          </div>
        </figure>
      </div>
    </section>
  );
}
