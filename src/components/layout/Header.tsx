"use client";

import { useEffect, useRef, useState } from "react";
import { ListIcon, XIcon, PhoneIcon, WhatsappLogoIcon } from "@phosphor-icons/react";
import { navItems, bookingAnchor } from "@/config/navigation";
import { site, telHref, whatsappChatHref } from "@/config/site";
import { goToAnchor } from "@/lib/scroll";
import { BrandMark } from "@/components/brand/BrandMark";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Filetto sotto l'header solo dopo l'inizio dello scorrimento.
  useEffect(() => {
    const sentinel = document.getElementById("top-sentinel");
    if (!sentinel) return;
    const io = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  // Voce di menu attiva: la sezione che occupa il centro del viewport.
  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter((el): el is HTMLElement => Boolean(el));
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

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 bg-paper transition-[border-color] duration-300 ${
          scrolled ? "border-b border-line" : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1360px] items-center justify-between gap-6 px-5 sm:px-8 lg:h-[72px] lg:px-10">
          <a href="#top" className="text-[1.375rem]" aria-label={`${site.shortName}, torna all'inizio`}>
            <BrandMark />
          </a>

          <nav aria-label="Principale" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {navItems.map((item) => {
                const isActive = active === item.href;
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      aria-current={isActive ? "location" : undefined}
                      className={`relative py-2 text-[0.9375rem] font-medium transition-colors duration-200 after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-red after:transition-transform after:duration-300 ${
                        isActive ? "text-ink after:scale-x-100" : "text-muted hover:text-ink after:scale-x-0"
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <a href={telHref()} className="link hidden text-[0.9375rem] font-medium tabular-nums xl:inline">
              {site.contact.phoneDisplay}
            </a>
            <a
              href={telHref()}
              className="inline-flex size-11 items-center justify-center border border-line-strong lg:hidden"
              aria-label={`Chiama ${site.contact.phoneDisplay}`}
            >
              <PhoneIcon size={20} aria-hidden="true" />
            </a>
            <a href={bookingAnchor} className="btn btn-primary hidden min-h-11 px-5 text-[0.9375rem] sm:inline-flex">
              Prenota
            </a>
            <button
              ref={toggleRef}
              type="button"
              onClick={openMenu}
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              aria-controls="menu-mobile"
              className="inline-flex size-11 items-center justify-center bg-ink text-paper lg:hidden"
            >
              <ListIcon size={22} aria-hidden="true" />
              <span className="sr-only">Apri il menu</span>
            </button>
          </div>
        </div>
      </header>
      {/* Spazio dell'header fisso. */}
      <div aria-hidden="true" className="h-16 lg:h-[72px]" />

      <dialog
        ref={dialogRef}
        id="menu-mobile"
        aria-label="Menu"
        data-scroll-lock
        onClose={() => {
          setMenuOpen(false);
          toggleRef.current?.focus({ preventScroll: true });
        }}
        className="menu-dialog fixed inset-0 m-0 h-[100dvh] w-full bg-paper p-0 text-ink backdrop:bg-ink/40 lg:hidden"
      >
        <div className="flex h-full flex-col px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-8">
          <div className="flex h-16 items-center justify-between">
            <span className="text-[1.375rem]">
              <BrandMark />
            </span>
            <button type="button" onClick={closeMenu} className="inline-flex size-11 items-center justify-center bg-ink text-paper">
              <XIcon size={22} aria-hidden="true" />
              <span className="sr-only">Chiudi il menu</span>
            </button>
          </div>

          <nav aria-label="Menu mobile" className="mt-6 flex-1">
            <ul className="border-t border-line-strong">
              {navItems.map((item, i) => (
                <li key={item.href} className="menu-item border-b border-line" style={{ "--i": i } as React.CSSProperties}>
                  <a href={item.href} onClick={(e) => navigateFromMenu(e, item.href)} className="type-h2 flex py-4">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="menu-item grid gap-3" style={{ "--i": navItems.length } as React.CSSProperties}>
            <a href={bookingAnchor} onClick={(e) => navigateFromMenu(e, bookingAnchor)} className="btn btn-primary w-full">
              Prenota
            </a>
            <div className="grid grid-cols-2 gap-3">
              <a href={telHref()} className="btn btn-secondary px-3">
                <PhoneIcon size={18} aria-hidden="true" />
                Chiama
              </a>
              {whatsapp && (
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-secondary px-3">
                  <WhatsappLogoIcon size={18} aria-hidden="true" />
                  WhatsApp
                </a>
              )}
            </div>
            <p className="pt-2 text-sm text-muted">{site.address.full}</p>
          </div>
        </div>
      </dialog>
    </>
  );
}
