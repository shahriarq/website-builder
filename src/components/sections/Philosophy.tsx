import Image from "next/image";
import { altFor, focus, images } from "@/content/images";

/**
 * Capitolo I, in avorio: la filosofia. Il manifesto si "accende" parola per
 * parola mentre si legge (data-read); le foto si aprono da una maschera e
 * scorrono a velocita' diverse. Testo di tono: DA FAR APPROVARE al titolare.
 */
export function Philosophy() {
  const tools = images.craftTools;
  const shop = images.galleryShop;

  return (
    <section id="filosofia" aria-labelledby="filosofia-title" className="theme-ivory relative overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 md:py-36 lg:px-12">
        <div className="chapter mb-14 md:mb-20">
          <span className="kicker kicker-bronze">I</span>
          <h2 id="filosofia-title" className="kicker">
            La filosofia
          </h2>
        </div>

        <p className="display display-m max-w-[22ch]" data-read>
          Un taglio non si improvvisa. Si ascolta chi siede in poltrona, si guarda come cadono i capelli, si lavora con calma, a mano, fino
          all&apos;ultima linea sul collo.
        </p>

        <div className="mt-20 grid grid-cols-12 gap-x-4 gap-y-12 md:mt-28 md:gap-x-6">
          <figure className="col-span-12 md:col-span-7">
            <div className="relative aspect-[5/4] overflow-hidden bg-raised" data-clip>
              <div className="absolute inset-x-0 -top-[8%] h-[116%]" data-parallax="0.12">
                <Image
                  src={tools.src}
                  alt={altFor(tools)}
                  fill
                  placeholder="blur"
                  sizes="(min-width: 768px) 58vw, 100vw"
                  style={focus(tools)}
                  className="photo object-cover"
                />
              </div>
            </div>
            <figcaption className="caption mt-3 flex justify-between gap-4">
              <span>Gli strumenti del mestiere</span>
              <span>Foto di repertorio</span>
            </figcaption>
          </figure>

          <div className="col-span-12 flex flex-col justify-between gap-12 md:col-span-4 md:col-start-9">
            <div className="grid gap-8">
              <div className="rule-top pt-5">
                <p className="kicker kicker-bronze">Tempo</p>
                <p className="mt-3 text-[1.0625rem]">Ogni appuntamento ha il suo spazio: niente fretta tra un cliente e l&apos;altro.</p>
              </div>
              <div className="rule-top pt-5">
                <p className="kicker kicker-bronze">Mano</p>
                <p className="mt-3 text-[1.0625rem]">Forbici, rasoio e pettine: la macchinetta prepara, la rifinitura si fa a mano.</p>
              </div>
              <div className="rule-top pt-5">
                <p className="kicker kicker-bronze">Misura</p>
                <p className="mt-3 text-[1.0625rem]">Taglio e barba si progettano insieme, sulle proporzioni del viso.</p>
              </div>
            </div>
            <figure className="ml-auto w-2/3 md:w-full">
              <div className="relative aspect-[3/4] overflow-hidden bg-raised" data-clip="left">
                <div className="absolute inset-x-0 -top-[10%] h-[120%]" data-parallax="0.22">
                  <Image
                    src={shop.src}
                    alt={altFor(shop)}
                    fill
                    placeholder="blur"
                    sizes="(min-width: 768px) 30vw, 66vw"
                    style={focus(shop)}
                    className="photo object-cover"
                  />
                </div>
              </div>
              <figcaption className="caption mt-3">Foto di repertorio</figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
