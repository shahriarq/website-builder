"use client";

import { useState, useSyncExternalStore } from "react";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { site } from "@/config/site";
import { grantMapForSession, readMapConsent, subscribeConsent, writeMapConsent } from "@/lib/consent";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

/**
 * Mappa Google caricata solo su richiesta: prima del clic nessuna richiesta
 * parte verso Google. La scelta si puo' revocare da "Preferenze cookie".
 */
export function MapEmbed({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);
  const allowed = useSyncExternalStore(subscribeConsent, readMapConsent, () => false);
  const [remember, setRemember] = useState(false);

  function load() {
    if (remember) writeMapConsent(true);
    else grantMapForSession();
  }

  return (
    <div className="relative w-full overflow-hidden border border-line bg-raised sm:aspect-[16/9] lg:aspect-[21/8]">
      {allowed ? (
        <iframe
          title={t.map.title(site.name, site.address.full)}
          src={site.links.mapEmbed}
          className="absolute inset-0 h-full w-full border-0 [filter:grayscale(1)_invert(0.9)_sepia(0.25)_contrast(0.9)]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="flex h-full flex-col justify-between gap-10 p-6 sm:absolute sm:inset-0 sm:p-10">
          <p className="kicker">{t.map.label}</p>
          <div className="grid gap-5">
            <p className="max-w-[30rem] text-[0.9375rem] text-muted">
              {t.map.notice}
            </p>
            <label className="flex min-h-11 cursor-pointer items-center gap-3 self-start text-[0.9375rem]">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="size-5 cursor-pointer accent-ink"
              />
              {t.map.remember}
            </label>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <button type="button" onClick={load} className="btn btn-secondary">
                {t.map.load}
              </button>
              <a
                href={site.links.directions}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1.5 text-[0.9375rem]"
              >
                <span className="link">{t.map.open}</span>
                <ArrowUpRightIcon size={15} aria-hidden="true" />
                <span className="sr-only"> {t.common.newTab}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
