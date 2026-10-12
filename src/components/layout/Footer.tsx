import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { site, telHref } from "@/config/site";
import { bookingAnchor, navItems } from "@/config/navigation";
import { BookingBadge } from "@/components/motion/BookingBadge";
import { CookiePreferences } from "./CookiePreferences";
import { Year } from "./Year";

/**
 * Chiusura: invito finale alla prenotazione, poi il marchio a tutta
 * larghezza che sale lettera per lettera, poi i collegamenti essenziali.
 */
export function Footer() {
  return (
    <footer id="footer" className="relative overflow-hidden border-t border-line">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid items-center gap-12 py-24 md:grid-cols-12 md:py-36">
          <h2 className="display display-l md:col-span-8" data-split>
            Il prossimo taglio <em>ti aspetta.</em>
          </h2>
          <div className="flex items-center gap-8 md:col-span-4 md:justify-end">
            <BookingBadge />
            <a href={bookingAnchor} className="btn btn-primary md:hidden">
              Prenota
              <ArrowRightIcon size={16} className="btn-icon" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="grid gap-10 border-t border-line py-14 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="kicker kicker-bronze">Salone</p>
            <p className="mt-4">
              {site.address.street}
              <br />
              {site.address.postalCode} {site.address.city} {site.address.province}
            </p>
            <a href={telHref()} className="mt-3 inline-flex min-h-11 items-center tabular-nums">
              <span className="link">{site.contact.phoneDisplay}</span>
            </a>
            {site.contact.email && (
              <a href={`mailto:${site.contact.email}`} className="block w-fit">
                <span className="link">{site.contact.email}</span>
              </a>
            )}
          </div>

          <nav aria-label="Navigazione nel piè di pagina" className="lg:col-span-3 lg:col-start-6">
            <p className="kicker kicker-bronze">Capitoli</p>
            <ul className="mt-3 grid">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="inline-flex min-h-10 items-center">
                    <span className="link-quiet">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3 lg:col-start-10">
            <p className="kicker kicker-bronze">Altrove</p>
            <ul className="mt-3 grid">
              <li>
                <a href={site.links.treatwell} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center">
                  <span className="link-quiet">Treatwell</span>
                  <span className="sr-only"> (si apre in una nuova scheda)</span>
                </a>
              </li>
              <li>
                <a href={site.links.googleListing} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center">
                  <span className="link-quiet">Google Maps</span>
                  <span className="sr-only"> (si apre in una nuova scheda)</span>
                </a>
              </li>
              {site.social.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center">
                    <span className="link-quiet">{s.label}</span>
                    <span className="sr-only"> (si apre in una nuova scheda)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Marchio a tutta larghezza: decorativo, il nome e' gia' nell'header e nei dati strutturati. */}
      <p aria-hidden="true" className="brand-mark select-none px-3 pb-[0.2em] text-center text-[clamp(5rem,27vw,26rem)] leading-[0.78]" data-chars>
        Style<span className="brand-num">86</span>
      </p>

      <div className="mx-auto flex max-w-[1440px] flex-col gap-2 border-t border-line px-5 py-6 text-[0.8125rem] text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <p>
          © <Year initial={new Date().getFullYear()} /> {site.name}
          {site.privacy.vatNumber ? `. P. IVA ${site.privacy.vatNumber}` : ""}
        </p>
        <div className="flex gap-6">
          <Link href="/privacy" transitionTypes={["page"]} className="inline-flex min-h-11 items-center">
            <span className="link-quiet">Privacy</span>
          </Link>
          <CookiePreferences />
        </div>
      </div>
    </footer>
  );
}
