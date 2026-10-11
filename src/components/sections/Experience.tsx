import Image from "next/image";
import { altFor, focus, images, type SiteImage } from "@/content/images";

const notes = [
  {
    title: "Ascolto",
    text: "Si parte sempre da una conversazione su come vivi i tuoi capelli, prima di prendere le forbici.",
  },
  {
    title: "Precisione",
    text: "Strumenti professionali, gesti misurati, finiture curate fino all'ultimo passaggio.",
  },
  {
    title: "Comfort",
    text: "Luce calda e un ritmo senza fretta, per un appuntamento che sia anche una pausa.",
  },
];

function Frame({ image, ratio, sizes, delay = 0 }: { image: SiteImage; ratio: string; sizes: string; delay?: number }) {
  return (
    <div
      data-reveal="mask"
      style={{ "--reveal-delay": delay } as React.CSSProperties}
      className={`relative overflow-hidden bg-charcoal ${ratio}`}
    >
      <Image
        src={image.src}
        alt={altFor(image)}
        fill
        placeholder="blur"
        sizes={sizes}
        style={focus(image)}
        className="parallax-soft object-cover"
      />
    </div>
  );
}

export function Experience() {
  const collage = [images.experienceInterior, images.experienceTools, images.experienceMirror];
  const illustrative = collage.some((img) => img.illustrative);

  return (
    <section aria-labelledby="esperienza-title" className="surface-dark bg-obsidian">
      <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 md:py-32 lg:px-12 lg:py-40">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <Frame image={images.experienceInterior} ratio="aspect-[16/10]" sizes="(min-width: 1024px) 58vw, 100vw" />
          </div>

          <div className="flex flex-col justify-end lg:col-span-4 lg:col-start-9">
            <h2 id="esperienza-title" className="display max-w-[18ch] text-[clamp(2.25rem,5vw,3.75rem)]" data-reveal>
              Un salone dove prendersi il proprio tempo
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-5 md:gap-8 lg:col-span-6">
            <div className="lg:mt-24">
              <Frame image={images.experienceTools} ratio="aspect-[3/4]" sizes="(min-width: 1024px) 24vw, 50vw" delay={80} />
            </div>
            <div className="mt-16 lg:mt-0">
              <Frame image={images.experienceMirror} ratio="aspect-square" sizes="(min-width: 1024px) 24vw, 50vw" delay={160} />
            </div>
          </div>

          <dl className="grid content-start gap-10 lg:col-span-5 lg:col-start-8 lg:mt-16">
            {notes.map((note, i) => (
              <div
                key={note.title}
                data-reveal
                style={{ "--reveal-delay": i * 90 } as React.CSSProperties}
                className="grid gap-3 border-t border-ivory/15 pt-6 sm:grid-cols-[9rem_1fr] sm:gap-6 lg:grid-cols-1 lg:gap-3 xl:grid-cols-[9rem_1fr] xl:gap-6"
              >
                <dt className="display text-[1.75rem] leading-none text-brass">{note.title}</dt>
                <dd className="leading-relaxed text-ivory/80">{note.text}</dd>
              </div>
            ))}
          </dl>
        </div>

        {illustrative && (
          <p className="mt-16 text-sm text-mist md:mt-20">Immagini a scopo illustrativo.</p>
        )}
      </div>
    </section>
  );
}
