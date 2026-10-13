import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { site, telHref, whatsappChatHref } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { BookingForm } from "@/components/booking/BookingForm";
import { MapEmbed } from "./MapEmbed";

/**
 * Capitolo: dove siamo, quando, e la prenotazione. A sinistra indirizzo,
 * orari e contatti; a destra il modulo (stessa logica di sempre: validazione,
 * WhatsApp o Telegram). Sotto, la mappa caricata solo con consenso.
 */
export function Visit({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);
  const whatsapp = whatsappChatHref(lang === "en" ? "Hello, I'd like some information." : "Buongiorno, vorrei alcune informazioni.");
  const newTab = <span className="sr-only"> {t.common.newTab}</span>;

  return (
    <section id="contatti" aria-labelledby="contatti-title" className="relative">
      <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 md:py-36 lg:px-12">
        <div className="chapter mb-14 md:mb-20">
          <p className="eyebrow">{t.visit.eyebrow}</p>
        </div>

        <h2 id="contatti-title" className="display display-xl" data-split>
          {t.visit.titleStreet} <em>{t.visit.titleNumber}</em>
        </h2>

        <div className="mt-16 grid gap-16 md:mt-24 lg:grid-cols-12 lg:gap-6">
          <div className="grid content-start gap-10 lg:col-span-4">
            <address className="not-italic">
              <p className="kicker kicker-bronze">{t.visit.address}</p>
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
                <span className="link">{t.visit.directions}</span>
                <ArrowUpRightIcon size={15} aria-hidden="true" />
                {newTab}
              </a>
            </address>

            <div>
              <p className="kicker kicker-bronze">{t.visit.hours}</p>
              {site.openingHours ? (
                <dl className="mt-3 grid max-w-[22rem] gap-1.5">
                  {site.openingHours.map((entry) => (
                    <div key={entry.day} className="grid grid-cols-[7rem_1fr] gap-4 border-b border-line pb-1.5">
                      <dt>{t.days[entry.day]}</dt>
                      <dd className="tabular-nums">
                        {entry.ranges.length === 0 ? t.visit.closed : entry.ranges.map(([a, b]) => `${a}–${b}`).join(", ")}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <>
                  <p className="display display-s mt-3">{t.visit.byAppointment}</p>
                  <p className="mt-2 max-w-[22rem] text-muted">{t.visit.hoursHint}</p>
                </>
              )}
            </div>

            <div>
              <p className="kicker kicker-bronze">{t.visit.contacts}</p>
              <a href={telHref()} className="display display-s mt-3 block tabular-nums">
                {site.contact.phoneDisplay}
              </a>
              <div className="mt-3 flex flex-wrap gap-x-6">
                <a href={telHref()} className="inline-flex min-h-11 items-center text-[0.9375rem]">
                  <span className="link">{t.common.call}</span>
                </a>
                {whatsapp && (
                  <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 text-[0.9375rem]">
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
            <div className="border border-line bg-raised p-5 sm:p-8 lg:p-10">
              <h3 id="prenota-title" className="display display-m">
                {t.visit.bookTitle[0]} <em>{t.visit.bookTitle[1]}</em>
              </h3>
              <p className="mt-3 max-w-[34rem] text-[0.9375rem] text-muted">{t.visit.bookNote}</p>
              <div className="mt-8">
                <BookingForm lang={lang} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 md:mt-24" data-reveal>
          <MapEmbed lang={lang} />
        </div>
      </div>
    </section>
  );
}
