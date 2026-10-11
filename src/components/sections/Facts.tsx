import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { site, telHref, whatsappChatHref } from "@/config/site";

/**
 * Le quattro risposte che un cliente di quartiere cerca subito:
 * dove, come contattare, quando, cosa dicono gli altri.
 * Solo dati reali dalla configurazione; nessun orario inventato.
 */
export function Facts() {
  const { google } = site.reviews;
  const whatsapp = whatsappChatHref("Buongiorno, vorrei alcune informazioni.");
  const rating = google.rating?.toLocaleString("it-IT", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  const external = (label: string) => <span className="sr-only"> {label} (si apre in una nuova scheda)</span>;

  return (
    <section aria-label="Informazioni utili" className="mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-10">
      <dl className="rule-top grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border-b border-line py-6 lg:border-b-0">
          <dt className="type-label">Indirizzo</dt>
          <dd className="mt-2">
            <p className="text-[1.0625rem] leading-snug font-medium">
              {site.address.street}
              <br />
              {site.address.postalCode} {site.address.city}
            </p>
            <a href={site.links.directions} target="_blank" rel="noopener noreferrer" className="link mt-3 inline-flex min-h-11 items-center gap-1.5 text-[0.9375rem]">
              Indicazioni
              <ArrowUpRightIcon size={15} aria-hidden="true" />
              {external("verso il salone")}
            </a>
          </dd>
        </div>

        <div className="border-b border-line py-6 lg:border-b-0">
          <dt className="type-label">Telefono</dt>
          <dd className="mt-2">
            <a href={telHref()} className="text-[1.0625rem] font-medium tabular-nums">
              {site.contact.phoneDisplay}
            </a>
            <div className="mt-3 flex flex-wrap gap-x-5">
              <a href={telHref()} className="link inline-flex min-h-11 items-center text-[0.9375rem]">
                Chiama
              </a>
              {whatsapp && (
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="link inline-flex min-h-11 items-center text-[0.9375rem]">
                  WhatsApp
                  {external("")}
                </a>
              )}
            </div>
          </dd>
        </div>

        <div className="border-b border-line py-6 sm:border-b-0">
          <dt className="type-label">Orari</dt>
          <dd className="mt-2">
            {site.openingHours ? (
              <ul className="grid gap-0.5 text-[0.9375rem] tabular-nums">
                {site.openingHours.map((entry) => (
                  <li key={entry.day} className="grid grid-cols-[3.25rem_1fr]">
                    <span className="capitalize text-muted">{entry.day}</span>
                    <span>{entry.ranges.length ? entry.ranges.map(([a, b]) => `${a}-${b}`).join(", ") : "Chiuso"}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <>
                <p className="text-[1.0625rem] leading-snug font-medium">Su appuntamento</p>
                <p className="mt-3 text-[0.9375rem] text-muted">Per gli orari di apertura chiama o scrivi al salone.</p>
              </>
            )}
          </dd>
        </div>

        <div className="py-6">
          <dt className="type-label">Recensioni Google</dt>
          <dd className="mt-2">
            {rating && google.count !== null ? (
              <p className="flex items-baseline gap-2">
                <span className="type-figure text-[2rem] text-red">{rating}</span>
                <span className="text-[0.9375rem] text-muted">su 5, {google.count} recensioni</span>
              </p>
            ) : (
              <p className="text-[1.0625rem] font-medium">Leggi le opinioni dei clienti</p>
            )}
            <a href="#recensioni" className="link mt-3 inline-flex min-h-11 items-center text-[0.9375rem]">
              Dicono di noi
            </a>
          </dd>
        </div>
      </dl>
    </section>
  );
}
