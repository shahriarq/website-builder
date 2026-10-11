import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { dayLabels, site, telHref, whatsappChatHref } from "@/config/site";
import { MapEmbed } from "./MapEmbed";

export function Contact() {
  const whatsapp = whatsappChatHref("Buongiorno, vorrei alcune informazioni.");
  const newTab = <span className="sr-only"> (si apre in una nuova scheda)</span>;

  return (
    <section id="contatti" aria-labelledby="contatti-title" className="mx-auto max-w-[1360px] px-5 py-20 sm:px-8 md:py-28 lg:px-10">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <h2 id="contatti-title" className="type-h2" data-reveal>
            Contatti
          </h2>

          <address className="rule-top mt-10 grid not-italic" data-reveal>
            <div className="grid gap-1 border-b border-line py-5 sm:grid-cols-[8rem_1fr] sm:gap-6">
              <h3 className="type-label pt-0.5">Indirizzo</h3>
              <div>
                <p className="text-[1.0625rem] leading-snug font-medium">
                  {site.address.street}
                  <br />
                  {site.address.postalCode} {site.address.city} {site.address.province}
                </p>
                <a href={site.links.directions} target="_blank" rel="noopener noreferrer" className="link mt-2 inline-flex min-h-11 items-center gap-1.5 text-[0.9375rem]">
                  Indicazioni stradali
                  <ArrowUpRightIcon size={15} aria-hidden="true" />
                  {newTab}
                </a>
              </div>
            </div>

            <div className="grid gap-1 border-b border-line py-5 sm:grid-cols-[8rem_1fr] sm:gap-6">
              <h3 className="type-label pt-0.5">Telefono</h3>
              <div>
                <a href={telHref()} className="link text-[1.0625rem] font-medium tabular-nums">
                  {site.contact.phoneDisplay}
                </a>
                {whatsapp && (
                  <p className="mt-2">
                    <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="link inline-flex min-h-11 items-center gap-1.5 text-[0.9375rem]">
                      Scrivici su WhatsApp
                      <ArrowUpRightIcon size={15} aria-hidden="true" />
                      {newTab}
                    </a>
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-1 border-b border-line py-5 sm:grid-cols-[8rem_1fr] sm:gap-6">
              <h3 className="type-label pt-0.5">Orari</h3>
              {site.openingHours ? (
                <dl className="grid max-w-[24rem] gap-1.5">
                  {site.openingHours.map((entry) => (
                    <div key={entry.day} className="grid grid-cols-[7rem_1fr] gap-4">
                      <dt>{dayLabels[entry.day]}</dt>
                      <dd className="tabular-nums">
                        {entry.ranges.length === 0 ? "Chiuso" : entry.ranges.map(([a, b]) => `${a}-${b}`).join(", ")}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="max-w-[26rem]">Su appuntamento. Per gli orari di apertura chiama o scrivi al salone.</p>
              )}
            </div>

            <div className="grid gap-1 py-5 sm:grid-cols-[8rem_1fr] sm:gap-6">
              <h3 className="type-label pt-0.5">Online</h3>
              <a href={site.links.treatwell} target="_blank" rel="noopener noreferrer" className="link inline-flex min-h-11 items-center gap-1.5 self-start justify-self-start text-[0.9375rem]">
                Style86 su Treatwell
                <ArrowUpRightIcon size={15} aria-hidden="true" />
                {newTab}
              </a>
            </div>
          </address>
        </div>

        <div className="lg:col-span-7" data-reveal>
          <MapEmbed />
        </div>
      </div>
    </section>
  );
}
