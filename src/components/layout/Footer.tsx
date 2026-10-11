import { site, telHref } from "@/config/site";
import { navItems } from "@/config/navigation";
import { BrandMark } from "@/components/brand/BrandMark";
import { CookiePreferences } from "./CookiePreferences";
import { Year } from "./Year";

export function Footer() {
  return (
    <footer id="footer" className="mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-10">
      <div className="rule-top grid grid-cols-2 gap-x-6 gap-y-10 py-12 lg:grid-cols-12 lg:gap-10">
        <div className="col-span-2 lg:col-span-5">
          <BrandMark className="text-[2.25rem]" />
          <p className="mt-4 text-[0.9375rem] text-muted">{site.category} a Milano</p>
        </div>

        <div className="col-span-2 text-[0.9375rem] sm:col-span-1 lg:col-span-3">
          <h2 className="type-label">Salone</h2>
          <p className="mt-3">
            {site.address.street}
            <br />
            {site.address.postalCode} {site.address.city} {site.address.province}
          </p>
          <a href={telHref()} className="link mt-2 inline-flex min-h-11 items-center tabular-nums">
            {site.contact.phoneDisplay}
          </a>
          {site.contact.email && (
            <a href={`mailto:${site.contact.email}`} className="link block w-fit">
              {site.contact.email}
            </a>
          )}
        </div>

        <nav aria-label="Navigazione nel piè di pagina" className="text-[0.9375rem] lg:col-span-2">
          <h2 className="type-label">Sezioni</h2>
          <ul className="mt-2 grid">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="link-quiet inline-flex min-h-10 items-center">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-[0.9375rem] lg:col-span-2">
          <h2 className="type-label">Altrove</h2>
          <ul className="mt-2 grid">
            <li>
              <a href={site.links.treatwell} target="_blank" rel="noopener noreferrer" className="link-quiet inline-flex min-h-10 items-center">
                Treatwell<span className="sr-only"> (si apre in una nuova scheda)</span>
              </a>
            </li>
            <li>
              <a href={site.links.googleListing} target="_blank" rel="noopener noreferrer" className="link-quiet inline-flex min-h-10 items-center">
                Google Maps<span className="sr-only"> (si apre in una nuova scheda)</span>
              </a>
            </li>
            {site.social.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="link-quiet inline-flex min-h-10 items-center">
                  {s.label}<span className="sr-only"> (si apre in una nuova scheda)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-line py-6 text-[0.8125rem] text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © <Year initial={new Date().getFullYear()} /> {site.name}
          {site.privacy.vatNumber ? `. P. IVA ${site.privacy.vatNumber}` : ""}
        </p>
        <div className="flex gap-6">
          <a href="/privacy" className="link inline-flex min-h-11 items-center">
            Privacy
          </a>
          <CookiePreferences />
        </div>
      </div>
    </footer>
  );
}
