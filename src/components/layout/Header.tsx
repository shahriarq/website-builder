"use client";

import { useEffect, useRef, useState } from "react";
import { ListIcon, XIcon, PhoneIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { navItems, bookingAnchor } from "@/config/navigation";
import { site, telHref } from "@/config/site";
import { goToAnchor } from "@/lib/scroll";

export function Header() {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Header trasparente sopra l'hero, pieno appena l'hero inizia a scorrere.
  useEffect(() => {
    const sentinel = document.getElementById("hero-sentinel");
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => setSolid(!entry.isIntersecting));
    observer.observe(sentinel);
    return () => observer.disconnect();
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
    // Attende la chiusura del dialogo, poi scorre e sposta il focus.
    requestAnimationFrame(() => goToAnchor(href));
  }

  return (
    <>
      <header
        className={`surface-dark fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-500 ease-[var(--ease-editorial)] ${
          solid ? "border-b border-ivory/10 bg-obsidian/95 backdrop-blur-sm" : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8 lg:h-[72px] lg:px-12">
          <a href="#top" className="wordmark text-[1.625rem] text-ivory" aria-label={`${site.shortName}, torna all'inizio`}>
            {site.wordmark}
          </a>

          <nav aria-label="Principale" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="relative py-2 text-[0.9375rem] font-medium text-ivory/85 transition-colors duration-300 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-brass after:transition-transform after:duration-500 after:ease-[var(--ease-editorial)] hover:text-ivory hover:after:scale-x-100"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <a href={bookingAnchor} className="btn btn-brass min-h-11 px-5 text-sm sm:px-6">
              Prenota
            </a>
            <button
              ref={toggleRef}
              type="button"
              onClick={openMenu}
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              aria-controls="menu-mobile"
              className="inline-flex size-11 items-center justify-center rounded-[var(--radius-control)] text-ivory transition-colors hover:bg-ivory/10 lg:hidden"
            >
              <ListIcon size={26} weight="light" aria-hidden="true" />
              <span className="sr-only">Apri il menu</span>
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
        className="surface-dark menu-dialog fixed inset-0 m-0 h-[100dvh] w-full bg-obsidian p-0 text-ivory backdrop:bg-obsidian/60 lg:hidden"
      >
        <div className="flex h-full flex-col px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-8">
          <div className="flex h-16 items-center justify-between">
            <span className="wordmark text-[1.625rem]" aria-hidden="true">
              {site.wordmark}
            </span>
            <button
              type="button"
              onClick={closeMenu}
              className="inline-flex size-11 items-center justify-center rounded-[var(--radius-control)] transition-colors hover:bg-ivory/10"
            >
              <XIcon size={26} weight="light" aria-hidden="true" />
              <span className="sr-only">Chiudi il menu</span>
            </button>
          </div>

          <nav aria-label="Menu mobile" className="mt-10 flex-1">
            <ul className="flex flex-col">
              {navItems.map((item, i) => (
                <li key={item.href} className="menu-item border-b border-ivory/10" style={{ "--i": i } as React.CSSProperties}>
                  <a
                    href={item.href}
                    onClick={(e) => navigateFromMenu(e, item.href)}
                    className="display flex items-center justify-between py-4 text-[2.5rem] leading-none text-ivory"
                  >
                    {item.label}
                    <ArrowRightIcon size={22} weight="light" className="text-brass" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="menu-item grid gap-4 pt-8" style={{ "--i": navItems.length } as React.CSSProperties}>
            <a href={bookingAnchor} onClick={(e) => navigateFromMenu(e, bookingAnchor)} className="btn btn-brass w-full">
              Prenota il tuo appuntamento
            </a>
            <a href={telHref()} className="btn btn-outline-light w-full">
              <PhoneIcon size={18} weight="regular" aria-hidden="true" />
              {site.contact.phoneDisplay}
            </a>
            <p className="text-sm text-mist">{site.address.full}</p>
          </div>
        </div>
      </dialog>
    </>
  );
}
