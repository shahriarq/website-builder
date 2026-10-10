"use client";

import { useRef, useState } from "react";
import { XIcon } from "@phosphor-icons/react";
import { readMapConsent, writeMapConsent } from "@/lib/consent";

/**
 * Preferenze sui contenuti di terze parti. Il sito non usa cookie di
 * profilazione ne' strumenti di analisi: l'unico contenuto esterno
 * facoltativo e' la mappa Google.
 */
export function CookiePreferences() {
  const ref = useRef<HTMLDialogElement>(null);
  const [maps, setMaps] = useState(false);
  const [saved, setSaved] = useState(false);

  function open() {
    setMaps(readMapConsent());
    setSaved(false);
    ref.current?.showModal();
  }

  function save() {
    writeMapConsent(maps);
    setSaved(true);
  }

  return (
    <>
      <button type="button" onClick={open} className="link-underline text-left">
        Preferenze cookie
      </button>
      <dialog
        ref={ref}
        aria-labelledby="cookie-title"
        data-scroll-lock
        className="surface-light m-auto w-[calc(100%-2.5rem)] max-w-lg rounded-[var(--radius-control)] bg-ivory p-0 text-obsidian backdrop:bg-obsidian/70"
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <h2 id="cookie-title" className="display text-[2rem] leading-tight">
              Preferenze cookie
            </h2>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className="-mt-1 -mr-2 inline-flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-control)] hover:bg-obsidian/5"
            >
              <XIcon size={22} weight="light" aria-hidden="true" />
              <span className="sr-only">Chiudi</span>
            </button>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-charcoal">
            Questo sito non usa cookie di profilazione né strumenti di analisi. Puoi scegliere se caricare i contenuti
            esterni qui sotto.
          </p>
          <div className="mt-6 grid gap-4 border-t border-obsidian/15 pt-6">
            <div className="flex items-start gap-3">
              <input id="pref-tecnici" type="checkbox" checked disabled className="mt-1 size-4 accent-obsidian" />
              <label htmlFor="pref-tecnici" className="text-sm leading-relaxed">
                <span className="font-semibold">Funzionamento del sito.</span> Necessario, sempre attivo. Non salva dati
                personali.
              </label>
            </div>
            <div className="flex items-start gap-3">
              <input
                id="pref-mappe"
                type="checkbox"
                checked={maps}
                onChange={(e) => {
                  setMaps(e.target.checked);
                  setSaved(false);
                }}
                className="mt-1 size-4 cursor-pointer accent-obsidian"
              />
              <label htmlFor="pref-mappe" className="cursor-pointer text-sm leading-relaxed">
                <span className="font-semibold">Google Maps.</span> Carica automaticamente la mappa nella sezione
                Contatti. Google può impostare cookie propri.
              </label>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button type="button" onClick={save} className="btn btn-ink">
              Salva le preferenze
            </button>
            <p className="text-sm text-olive-deep" aria-live="polite">
              {saved ? "Preferenze salvate." : ""}
            </p>
          </div>
        </div>
      </dialog>
    </>
  );
}
