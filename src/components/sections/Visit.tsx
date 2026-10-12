import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { dayLabels, site, telHref, whatsappChatHref } from "@/config/site";
import { BookingForm } from "@/components/booking/BookingForm";
import { MapEmbed } from "./MapEmbed";

const steps =
  site.booking.delivery === "telegram"
    ? [
        "Scegli servizio, giorno e fascia oraria.",
        "Invia: la richiesta arriva direttamente al salone.",
        "Il salone ti richiama per confermare.",
      ]
    : ["Scegli servizio, giorno e fascia oraria.", "Invia il messaggio già pronto su WhatsApp.", "Il salone ti risponde per confermare."];

/**
 * Capitolo VI: dove siamo, quando, e la prenotazione. A sinistra indirizzo,
 * orari e contatti; a destra il modulo (stessa logica di sempre: validazione,
 * WhatsApp o Telegram). Sotto, la mappa caricata solo con consenso.
 */
export function Visit() {
  const whatsapp = whatsappChatHref("Buongiorno, vorrei alcune informazioni.");
  const newTab = <span className="sr-only"> (si apre in una nuova scheda)</span>;

  return (
    <section id="contatti" aria-labelledby="contatti-title" className="relative">
      <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 md:py-36 lg:px-12">
        <div className="chapter mb-14 md:mb-20">
          <span className="kicker kicker-bronze">VI</span>
          <p className="kicker">Visita e prenota</p>
        </div>

        <h2 id="contatti-title" className="display display-xl" data-split>
          Via Ornato, <em>59.</em>
        </h2>

        <div className="mt-16 grid gap-16 md:mt-24 lg:grid-cols-12 lg:gap-6">
          <div className="grid content-start gap-10 lg:col-span-4">
            <address className="not-italic">
              <p className="kicker kicker-bronze">Indirizzo</p>
              <p className="display display-s mt-3">
                {site.address.street}
                <br />
                {site.address.postalCode} {site.address.city}
              </p>
              <a
                href={site.links.directions}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-[0.9375rem]"
              >
                <span className="link">Indicazioni stradali</span>
                <ArrowUpRightIcon size={15} aria-hidden="true" />
                {newTab}
              </a>
            </address>

            <div>
              <p className="kicker kicker-bronze">Orari</p>
              {site.openingHours ? (
                <dl className="mt-3 grid max-w-[22rem] gap-1.5">
                  {site.openingHours.map((entry) => (
                    <div key={entry.day} className="grid grid-cols-[7rem_1fr] gap-4 border-b border-line pb-1.5">
                      <dt>{dayLabels[entry.day]}</dt>
                      <dd className="tabular-nums">
                        {entry.ranges.length === 0 ? "Chiuso" : entry.ranges.map(([a, b]) => `${a}–${b}`).join(", ")}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <>
                  <p className="display display-s mt-3">Su appuntamento</p>
                  <p className="mt-2 max-w-[22rem] text-muted">Per gli orari di apertura chiama o scrivi al salone.</p>
                </>
              )}
            </div>

            <div>
              <p className="kicker kicker-bronze">Contatti</p>
              <a href={telHref()} className="display display-s mt-3 block tabular-nums">
                {site.contact.phoneDisplay}
              </a>
              <div className="mt-3 flex flex-wrap gap-x-6">
                <a href={telHref()} className="inline-flex min-h-11 items-center text-[0.9375rem]">
                  <span className="link">Chiama</span>
                </a>
                {whatsapp && (
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-1.5 text-[0.9375rem]"
                  >
                    <span className="link">WhatsApp</span>
                    <ArrowUpRightIcon size={15} aria-hidden="true" />
                    {newTab}
                  </a>
                )}
                <a
                  href={site.links.treatwell}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-1.5 text-[0.9375rem]"
                >
                  <span className="link">Treatwell</span>
                  <ArrowUpRightIcon size={15} aria-hidden="true" />
                  {newTab}
                </a>
              </div>
            </div>
          </div>

          <div id="prenota" aria-labelledby="prenota-title" className="lg:col-span-7 lg:col-start-6" role="region">
            <div className="border border-line bg-raised p-6 sm:p-10 lg:p-14">
              <h3 id="prenota-title" className="display display-m">
                Prenota la <em>poltrona.</em>
              </h3>
              <ol className="mt-8 grid gap-0 border-t border-line sm:grid-cols-3">
                {steps.map((step, i) => (
                  <li key={step} className="flex gap-3 border-b border-line py-4 text-[0.9375rem] sm:border-b-0 sm:pr-4">
                    <span className="font-display text-bronze-text italic" aria-hidden="true">
                      {["i", "ii", "iii"][i]}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <p className="caption mt-4">L&apos;orario indicato è una preferenza: vale solo dopo la conferma del salone.</p>
              <div className="mt-10">
                <BookingForm />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 md:mt-24" data-reveal>
          <MapEmbed />
        </div>
      </div>
    </section>
  );
}
