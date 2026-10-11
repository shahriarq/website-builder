import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { site, telHref } from "@/config/site";
import { bookingAnchor, navItems } from "@/config/navigation";
import { CookiePreferences } from "./CookiePreferences";
import { Year } from "./Year";

export function Footer() {
  return (
    <footer id="footer" className="surface-dark bg-obsidian text-ivory">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-10 border-b border-ivory/10 py-20 md:py-28 lg:grid-cols-12 lg:items-end">
          <p className="display max-w-[16ch] text-[clamp(2.5rem,6.5vw,5.5rem)] lg:col-span-8 lg:max-w-none" data-reveal>
            Il tuo prossimo appuntamento <em className="font-light italic text-brass">inizia qui</em>.
          </p>
          <div className="lg:col-span-4 lg:justify-self-end" data-reveal>
            <a href={bookingAnchor} className="btn btn-brass">
              Prenota un appuntamento
              <ArrowRightIcon size={18} className="btn-icon" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="wordmark text-[3rem]">
              STYLE<span className="text-brass">86</span>
            </p>
            <p className="mt-3 text-sm text-mist">{site.category}</p>
          </div>

          <div className="text-sm leading-relaxed lg:col-span-3">
            <h2 className="font-semibold text-ivory">Contatti</h2>
            <p className="mt-3 text-ivory/80">
              {site.address.street}
              <br />
              {site.address.postalCode} {site.address.city} {site.address.province}
            </p>
            <a href={telHref()} className="link-underline mt-3 inline-block text-ivory">
              {site.contact.phoneDisplay}
            </a>
            {site.contact.email && (
              <a href={`mailto:${site.contact.email}`} className="link-underline mt-2 block w-fit text-ivory">
                {site.contact.email}
              </a>
            )}
          </div>

          <nav aria-label="Navigazione nel piè di pagina" className="text-sm lg:col-span-2">
            <h2 className="font-semibold text-ivory">Sezioni</h2>
            <ul className="mt-3 grid gap-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="inline-flex min-h-9 items-center text-ivory/80 transition-colors hover:text-ivory">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="text-sm lg:col-span-3">
            {site.social.length > 0 && (
              <>
                <h2 className="font-semibold text-ivory">Seguici</h2>
                <ul className="mt-3 mb-8 grid gap-1">
                  {site.social.map((s) => (
                    <li key={s.href}>
                      <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center text-ivory/80 hover:text-ivory">
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <h2 className="font-semibold text-ivory">Prenota anche su</h2>
            <a
              href={site.links.treatwell}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline mt-3 inline-block text-ivory/80"
            >
              Treatwell
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-ivory/10 py-8 pb-24 text-[0.8125rem] text-mist sm:flex-row sm:items-center sm:justify-between lg:pb-8">
          <p>
            © <Year initial={new Date().getFullYear()} /> {site.name}
            {site.privacy.vatNumber ? `. P. IVA ${site.privacy.vatNumber}` : ""}
          </p>
          <div className="flex gap-6">
            <a href="/privacy" className="link-underline">
              Privacy
            </a>
            <CookiePreferences />
          </div>
        </div>
      </div>
    </footer>
  );
}
