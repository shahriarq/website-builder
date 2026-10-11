import { ArrowUpRightIcon, PhoneIcon, WhatsappLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { dayLabels, site, telHref, whatsappChatHref } from "@/config/site";
import { MapEmbed } from "./MapEmbed";

export function Contact() {
  const whatsapp = whatsappChatHref("Buongiorno, vorrei alcune informazioni.");

  return (
    <section id="contatti" aria-labelledby="contatti-title" className="surface-light bg-ivory">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-5 py-24 sm:px-8 md:py-32 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:py-40">
        <div className="lg:col-span-5">
          <h2 id="contatti-title" className="display text-[clamp(2.25rem,5.5vw,4rem)]" data-reveal>
            Vieni a trovarci
          </h2>

          <address className="mt-10 grid gap-8 not-italic sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2" data-reveal>
            <div>
              <h3 className="text-sm font-semibold text-olive-deep">Indirizzo</h3>
              <p className="mt-2 text-lg leading-snug">
                {site.address.street}
                <br />
                {site.address.postalCode} {site.address.city} {site.address.province}
              </p>
              <a
                href={site.links.directions}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-[0.9375rem] font-semibold"
              >
                <span className="link-underline">Indicazioni stradali</span>
                <ArrowUpRightIcon size={16} aria-hidden="true" />
                <span className="sr-only"> (si apre in una nuova scheda)</span>
              </a>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-olive-deep">Telefono</h3>
              <a href={telHref()} className="mt-2 inline-flex min-h-11 items-center gap-2 text-lg">
                <PhoneIcon size={18} className="text-brass-deep" aria-hidden="true" />
                <span className="link-underline">{site.contact.phoneDisplay}</span>
              </a>
              {whatsapp && (
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 flex min-h-11 items-center gap-2 text-[0.9375rem] font-semibold"
                >
                  <WhatsappLogoIcon size={18} className="text-brass-deep" aria-hidden="true" />
                  <span className="link-underline">Scrivici su WhatsApp</span>
                  <span className="sr-only"> (si apre in una nuova scheda)</span>
                </a>
              )}
            </div>

            <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
              <h3 className="text-sm font-semibold text-olive-deep">Orari</h3>
              {site.openingHours ? (
                <dl className="mt-3 grid max-w-[24rem] gap-1.5">
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
                <p className="mt-2 max-w-[26rem] leading-relaxed text-charcoal">
                  Per conoscere gli orari di apertura chiamaci o scrivici: ti rispondiamo con piacere.
                </p>
              )}
            </div>
          </address>

          <p className="mt-10 text-sm text-olive-deep" data-reveal>
            Preferisci prenotare online altrove?{" "}
            <a href={site.links.treatwell} target="_blank" rel="noopener noreferrer" className="link-underline font-semibold text-obsidian">
              Style86 su Treatwell
            </a>
            <span className="sr-only"> (si apre in una nuova scheda)</span>
          </p>
        </div>

        <div className="lg:col-span-6 lg:col-start-7" data-reveal="mask">
          <MapEmbed />
        </div>
      </div>
    </section>
  );
}
