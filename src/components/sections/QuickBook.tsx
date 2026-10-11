"use client";

import { useId, useState } from "react";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { serviceOptions } from "@/lib/booking/context";
import { requestService } from "@/lib/booking/events";
import { bookingAnchor } from "@/config/navigation";

/**
 * Avvio rapido della prenotazione nell'hero: scegli il servizio e vai al
 * modulo con il servizio gia' selezionato e il focus sul campo successivo.
 * Senza JavaScript resta un normale collegamento al modulo.
 */
export function QuickBook() {
  const uid = useId();
  const [service, setService] = useState<string>("");

  function go(event: React.MouseEvent<HTMLAnchorElement>) {
    if (!service) return; // nessuna scelta: comportamento standard dell'ancora
    event.preventDefault();
    requestService(service, true);
    const target = document.getElementById("prenota");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", bookingAnchor);
  }

  return (
    <div>
      <fieldset>
        <legend className="type-label mb-3">Cosa vuoi prenotare?</legend>
        <div className="flex flex-wrap gap-2">
          {serviceOptions.map((s) => (
            <label key={s.id} className="chip">
              <input
                type="radio"
                name={`${uid}-quick-service`}
                value={s.id}
                checked={service === s.id}
                onChange={() => setService(s.id)}
              />
              <span>{s.id === "altro" ? "Altro" : s.name}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <a href={bookingAnchor} onClick={go} className="btn btn-primary mt-6 w-full sm:w-auto">
        Prenota
        <ArrowRightIcon size={18} className="btn-icon" aria-hidden="true" />
      </a>
    </div>
  );
}
