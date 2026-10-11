import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { site, telHref } from "@/config/site";
import { BookingForm } from "@/components/booking/BookingForm";

const steps =
  site.booking.delivery === "telegram"
    ? ["Scegli servizio, giorno e fascia oraria.", "Invia la richiesta: arriva direttamente al salone.", "Il salone ti richiama per confermare l'orario."]
    : ["Scegli servizio, giorno e fascia oraria.", "Invia il messaggio già pronto su WhatsApp.", "Il salone ti risponde per confermare l'orario."];

export function Booking() {
  return (
    <section id="prenota" aria-labelledby="prenota-title" className="border-y border-line-strong bg-raised">
      <div className="mx-auto grid max-w-[1360px] gap-12 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-12 lg:gap-10 lg:px-10">
        <div className="lg:col-span-4">
          <h2 id="prenota-title" className="type-h2" data-reveal>
            Prenota
          </h2>
          <ol className="mt-8 grid gap-0 border-t border-line-strong" data-reveal>
            {steps.map((step, i) => (
              <li key={step} className="grid grid-cols-[2rem_1fr] gap-3 border-b border-line py-4">
                <span className="type-figure pt-0.5 text-[1.25rem] text-red" aria-hidden="true">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-6 max-w-[26rem] text-[0.9375rem] text-muted" data-reveal>
            L&apos;orario che indichi è una preferenza: l&apos;appuntamento vale solo dopo la conferma del salone.
          </p>

          <div className="mt-10 grid gap-1 text-[0.9375rem]" data-reveal>
            <p className="text-muted">Preferisci a voce o su un&apos;altra piattaforma?</p>
            <div className="flex flex-wrap gap-x-6">
              <a href={telHref()} className="link inline-flex min-h-11 items-center tabular-nums">
                Chiama {site.contact.phoneDisplay}
              </a>
              <a href={site.links.treatwell} target="_blank" rel="noopener noreferrer" className="link inline-flex min-h-11 items-center gap-1.5">
                Treatwell
                <ArrowUpRightIcon size={15} aria-hidden="true" />
                <span className="sr-only"> (si apre in una nuova scheda)</span>
              </a>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <BookingForm />
        </div>
      </div>
    </section>
  );
}
