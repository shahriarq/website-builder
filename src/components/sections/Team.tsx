import Image from "next/image";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/config/site";
import { bookingAnchor } from "@/config/navigation";
import { altFor, focus, images } from "@/content/images";

/**
 * Capitolo IV, il team. Mostra solo persone reali inserite in
 * site.team (nome, ruolo, foto con consenso). Finche' l'elenco e' vuoto
 * racconta il lavoro in poltrona senza nomi e senza volti inventati.
 */
export function Team() {
  const team = site.team;
  const hands = images.teamHands;

  return (
    <section id="team" aria-labelledby="team-title" className="relative">
      <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 md:py-36 lg:px-12">
        <div className="chapter mb-14 md:mb-20">
          <p className="eyebrow">Il team</p>
        </div>

        {team.length > 0 ? (
          <>
            <h2 id="team-title" className="display display-l max-w-[14ch]" data-split>
              Le mani dietro <em>il taglio.</em>
            </h2>
            <ul className="mt-16 grid gap-x-6 gap-y-14 sm:grid-cols-2 md:mt-24 lg:grid-cols-3">
              {team.map((member, i) => (
                <li key={member.name} className={i % 3 === 1 ? "lg:mt-24" : undefined}>
                  {member.photo && (
                    <div className="relative aspect-[3/4] overflow-hidden bg-raised" data-clip>
                      <Image
                        src={member.photo}
                        alt={`${member.name}, ${member.role}`}
                        fill
                        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                        className="photo object-cover"
                      />
                    </div>
                  )}
                  <p className="kicker kicker-bronze mt-5">{member.role}</p>
                  <h3 className="display display-s mt-2">{member.name}</h3>
                  {member.focus && <p className="mt-2 text-muted">{member.focus}</p>}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="grid grid-cols-12 gap-x-4 gap-y-12 md:gap-x-6">
            <figure className="col-span-10 md:col-span-5">
              <div className="relative aspect-[3/4] overflow-hidden bg-raised" data-clip="left">
                <div className="absolute inset-x-0 -top-[10%] h-[120%]" data-parallax="0.16">
                  <Image
                    src={hands.src}
                    alt={altFor(hands)}
                    fill
                    placeholder="blur"
                    sizes="(min-width: 768px) 40vw, 80vw"
                    style={focus(hands)}
                    className="photo object-cover"
                  />
                </div>
              </div>
              <figcaption className="caption mt-3">Foto di repertorio</figcaption>
            </figure>

            <div className="col-span-12 flex flex-col justify-end md:col-span-6 md:col-start-7">
              <h2 id="team-title" className="display display-l" data-split>
                Le mani dietro <em>il taglio.</em>
              </h2>
              <p className="lede mt-8 max-w-[34rem]" data-reveal>
                In Via Ornato ti accoglie il team di Style86: chi ti taglia i capelli ti segue anche nella barba, così ogni dettaglio resta
                coerente.
              </p>
              <p className="mt-5 max-w-[34rem] text-[1.0625rem]" data-reveal>
                Hai già un barbiere di fiducia in salone? Scrivi il suo nome nelle note della prenotazione.
              </p>
              <a href={bookingAnchor} className="btn btn-secondary mt-10 self-start" data-reveal>
                Prenota
                <ArrowRightIcon size={16} className="btn-icon" aria-hidden="true" />
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
