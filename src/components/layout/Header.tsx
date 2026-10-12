"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRightIcon, PhoneIcon, WhatsappLogoIcon } from "@phosphor-icons/react";
import { navItems, bookingAnchor } from "@/config/navigation";
import { site, telHref, whatsappChatHref } from "@/config/site";
import { goToAnchor } from "@/lib/scroll";
import { BrandMark } from "@/components/brand/BrandMark";

/**
 * Header: trasparente sull'hero, pieno dopo. Si ritira scorrendo verso il
 * basso e ritorna appena si risale, cosi' le foto restano a tutto schermo.
 * Su schermi stretti il menu e' un sipario a tutta pagina.
 */
export function Header() {
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Pieno dopo l'hero; nascosto in discesa, visibile in salita.
  useEffect(() => {
    let lastY = window.scrollY;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const hero = document.getElementById("top");
      const heroEnd = hero ? hero.offsetHeight - 80 : 400;
      setSolid(y > 24);
      const delta = y - lastY;
      if (Math.abs(delta) > 6) {
        setHidden(delta > 0 && y > heroEnd);
        lastY = y;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Voce attiva: la sezione al centro dello schermo.
  useEffect(() => {
    const sections = navItems.map((item) => document.getElementById(item.href.slice(1))).filter((el): el is HTMLElement => Boolean(el));
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(`#${entry.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  function openMenu() {
    dialogRef.current?.showModal();
    setMenuOpen(true);
  }

  function closeMenu() {
    dialogRef.current?.close();
  }

  function navigateFromMenu(event: React.MouseEvent<HTMLAnchorElement>, href: string) {
    event.preventDefault();
    closeMenu();
    requestAnimationFrame(() => goToAnchor(href));
  }

  const whatsapp = whatsappChatHref("Buongiorno, vorrei alcune informazioni.");
  const show = !hidden || menuOpen;

  return (
    <>
      <header
        onFocusCapture={() => setHidden(false)}
        className={`fixed inset-x-0 top-0 z-40 transition-[transform,background-color,border-color] duration-700 ease-[var(--ease-out-expo)] motion-reduce:transition-none ${
          show ? "translate-y-0" : "-translate-y-full"
        } ${solid ? "border-b border-line bg-paper/95 backdrop-blur-sm" : "border-b border-transparent bg-transparent"}`}
      >
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8 lg:h-20 lg:px-12">
          <a href="#top" className="text-[1.6rem] lg:text-[1.8rem]" aria-label={`${site.shortName}, torna all'inizio`}>
            <BrandMark />
          </a>

          <nav aria-label="Principale" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {navItems.map((item) => {
                const isActive = active === item.href;
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      aria-current={isActive ? "location" : undefined}
                      className={`group relative inline-flex items-baseline gap-1.5 py-2 text-[0.875rem] tracking-[0.04em] transition-colors duration-300 ${
                        isActive ? "text-ink" : "text-muted hover:text-ink"
                      }`}
                    >
                      <span className="font-display text-[0.75rem] text-bronze-text italic">{item.numeral}</span>
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={`absolute inset-x-0 -bottom-px h-px origin-left bg-bronze transition-transform duration-700 ease-[var(--ease-out-expo)] ${
                          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                        }`}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-5">
            <a href={telHref()} className="link-quiet hidden text-[0.875rem] tracking-[0.04em] tabular-nums xl:inline">
              {site.contact.phoneDisplay}
            </a>
            <a
              href={telHref()}
              className="inline-flex size-11 items-center justify-center border border-line-strong lg:hidden"
              aria-label={`Chiama ${site.contact.phoneDisplay}`}
            >
              <PhoneIcon size={19} aria-hidden="true" />
            </a>
            <a href={bookingAnchor} className="btn btn-primary hidden min-h-11 px-6 sm:inline-flex">
              Prenota
            </a>
            <button
              ref={toggleRef}
              type="button"
              onClick={openMenu}
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              aria-controls="menu-mobile"
              className="group inline-flex h-11 items-center gap-3 border border-line-strong px-4 text-[0.75rem] font-semibold tracking-[0.18em] uppercase lg:hidden"
            >
              Menu
              <span aria-hidden="true" className="grid gap-[5px]">
                <span className="block h-px w-5 bg-current" />
                <span className="block h-px w-3.5 bg-current transition-[width] duration-500 group-hover:w-5" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <dialog
        ref={dialogRef}
        id="menu-mobile"
        aria-label="Menu"
        data-scroll-lock
        onClose={() => {
          setMenuOpen(false);
          toggleRef.current?.focus({ preventScroll: true });
        }}
        className="menu-dialog fixed inset-0 m-0 h-[100dvh] w-full bg-paper p-0 text-ink backdrop:bg-transparent lg:hidden"
      >
        <div className="flex h-full flex-col px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-8">
          <div className="flex h-16 items-center justify-between">
            <span className="text-[1.6rem]">
              <BrandMark />
            </span>
            <button
              type="button"
              onClick={closeMenu}
              className="inline-flex h-11 items-center gap-3 border border-line-strong px-4 text-[0.75rem] font-semibold tracking-[0.18em] uppercase"
            >
              Chiudi
              <span aria-hidden="true" className="relative block size-3.5">
                <span className="absolute top-1/2 left-0 block h-px w-full rotate-45 bg-current" />
                <span className="absolute top-1/2 left-0 block h-px w-full -rotate-45 bg-current" />
              </span>
            </button>
          </div>

          <nav aria-label="Menu" className="flex flex-1 items-center">
            <ul className="w-full">
              {navItems.map((item, i) => (
                <li key={item.href} className="overflow-hidden">
                  <a
                    href={item.href}
                    onClick={(e) => navigateFromMenu(e, item.href)}
                    className="menu-item display flex items-baseline gap-4 py-2 text-[clamp(2.75rem,12vw,4.5rem)]"
                    style={{ "--i": i } as React.CSSProperties}
                  >
                    <span className="w-10 text-[1rem] text-bronze-text italic">{item.numeral}</span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="menu-fade grid gap-3 border-t border-line pt-5">
            <a href={bookingAnchor} onClick={(e) => navigateFromMenu(e, bookingAnchor)} className="btn btn-primary w-full">
              Prenota
              <ArrowRightIcon size={16} className="btn-icon" aria-hidden="true" />
            </a>
            <div className="grid grid-cols-2 gap-3">
              <a href={telHref()} className="btn btn-secondary px-3">
                <PhoneIcon size={16} aria-hidden="true" />
                Chiama
              </a>
              {whatsapp && (
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-secondary px-3">
                  <WhatsappLogoIcon size={16} aria-hidden="true" />
                  WhatsApp
                </a>
              )}
            </div>
            <p className="caption pt-1">{site.address.full}</p>
          </div>
        </div>
      </dialog>
    </>
  );
}
