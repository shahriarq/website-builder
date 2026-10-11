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
      <button type="button" onClick={open} className="link inline-flex min-h-11 items-center text-left">
        Preferenze cookie
      </button>
      <dialog
        ref={ref}
        aria-labelledby="cookie-title"
        data-scroll-lock
        className="m-auto w-[calc(100%-2.5rem)] max-w-lg border border-line-strong bg-paper p-0 text-ink backdrop:bg-[#171716]/60"
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <h2 id="cookie-title" className="type-h3">
              Preferenze cookie
            </h2>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className="-mt-2 -mr-2 inline-flex size-11 shrink-0 items-center justify-center hover:bg-ink hover:text-paper"
            >
              <XIcon size={22} aria-hidden="true" />
              <span className="sr-only">Chiudi</span>
            </button>
          </div>
          <p className="mt-4 text-[0.9375rem] text-muted">
            Questo sito non usa cookie di profilazione né strumenti di analisi. Puoi scegliere se caricare i contenuti
            esterni qui sotto.
          </p>
          <div className="mt-6 grid gap-4 border-t border-line pt-6">
            <div className="flex items-start gap-3">
              <input id="pref-tecnici" type="checkbox" checked disabled className="mt-0.5 size-5 accent-ink" />
              <label htmlFor="pref-tecnici" className="text-[0.9375rem] leading-relaxed">
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
                className="mt-0.5 size-5 cursor-pointer accent-ink"
              />
              <label htmlFor="pref-mappe" className="cursor-pointer text-[0.9375rem] leading-relaxed">
                <span className="font-semibold">Google Maps.</span> Carica automaticamente la mappa nella sezione
                Contatti. Google può impostare cookie propri.
              </label>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button type="button" onClick={save} className="btn btn-secondary">
              Salva le preferenze
            </button>
            <p className="text-[0.9375rem] text-muted" aria-live="polite">
              {saved ? "Preferenze salvate." : ""}
            </p>
          </div>
        </div>
      </dialog>
    </>
  );
}
