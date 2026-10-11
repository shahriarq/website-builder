import { ArrowUpRightIcon, PhoneIcon } from "@phosphor-icons/react/dist/ssr";
import { site, telHref } from "@/config/site";
import { BookingForm } from "@/components/booking/BookingForm";

export function Booking() {
  return (
    <section id="prenota" aria-labelledby="prenota-title" className="surface-dark bg-charcoal">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-14 px-5 py-24 sm:px-8 md:py-32 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:py-40">
        <div className="lg:col-span-4">
          <p className="eyebrow text-brass" data-reveal>
            Prenotazione
          </p>
          <h2 id="prenota-title" className="display mt-5 text-[clamp(2.5rem,6vw,4.25rem)]" data-reveal>
            Richiedi il tuo appuntamento
          </h2>
          <p className="mt-6 max-w-[28rem] text-[1.0625rem] leading-relaxed text-ivory/85" data-reveal>
            Indica servizio, giorno e fascia oraria che preferisci. Il salone ti risponderà per confermare
            l&apos;appuntamento.
          </p>

          <div className="mt-12 grid gap-6 border-t border-ivory/10 pt-8 text-sm" data-reveal>
            <div>
              <p className="text-mist">Preferisci parlarci a voce?</p>
              <a href={telHref()} className="mt-2 inline-flex min-h-11 items-center gap-2 text-lg text-ivory">
                <PhoneIcon size={18} className="text-brass" aria-hidden="true" />
                <span className="link-underline">{site.contact.phoneDisplay}</span>
              </a>
            </div>
            <div>
              <p className="text-mist">Prenoti già con Treatwell?</p>
              <a
                href={site.links.treatwell}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex min-h-11 items-center gap-2 text-lg text-ivory"
              >
                <span className="link-underline">Prenota su Treatwell</span>
                <ArrowUpRightIcon size={16} className="text-brass" aria-hidden="true" />
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
