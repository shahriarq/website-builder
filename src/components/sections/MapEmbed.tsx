"use client";

import { useState, useSyncExternalStore } from "react";
import { MapPinIcon } from "@phosphor-icons/react";
import { site } from "@/config/site";
import { grantMapForSession, readMapConsent, subscribeConsent, writeMapConsent } from "@/lib/consent";

/**
 * Mappa Google caricata solo su richiesta: prima del clic nessuna richiesta
 * parte verso Google. La scelta si puo' revocare da "Preferenze cookie".
 */
export function MapEmbed() {
  const allowed = useSyncExternalStore(subscribeConsent, readMapConsent, () => false);
  const [remember, setRemember] = useState(false);

  function load() {
    if (remember) writeMapConsent(true);
    else grantMapForSession();
  }

  return (
    <div className="relative min-h-[22rem] w-full overflow-hidden bg-obsidian sm:min-h-0 sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[28rem]">
      {allowed ? (
        <iframe
          title={`Mappa: ${site.name}, ${site.address.full}`}
          src={site.links.mapEmbed}
          className="absolute inset-0 h-full w-full border-0 grayscale-[35%] sepia-[12%]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="surface-dark flex h-full min-h-[inherit] flex-col items-start justify-end gap-5 p-6 sm:absolute sm:inset-0 sm:p-10">
          <MapPinIcon size={32} weight="light" className="text-brass" aria-hidden="true" />
          <p className="max-w-[26rem] text-sm leading-relaxed text-ivory/85">
            La mappa è fornita da Google Maps. Caricandola, Google riceve alcuni dati di navigazione e può impostare
            cookie. Puoi anche aprire le indicazioni direttamente su Google Maps.
          </p>
          <label className="flex items-center gap-2.5 text-sm text-ivory/85">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="size-4 accent-brass"
            />
            Ricorda la mia scelta
          </label>
          <button type="button" onClick={load} className="btn btn-outline-light">
            Carica la mappa
          </button>
        </div>
      )}
    </div>
  );
}
