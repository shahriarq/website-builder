/**
 * SERVIZI
 * --------------------------------------------------------------------------
 * DA CONFERMARE CON IL TITOLARE prima della pubblicazione.
 *
 * Le quattro categorie sotto sono segnaposto suggeriti dal brief
 * (taglio, styling, barba, trattamenti estetici). Il listino reale del
 * salone va verificato: aggiungi, rimuovi o rinomina le voci qui.
 *
 * `duration` e `price` restano null finche' non sono dati reali forniti
 * dal salone: quando sono null non vengono mostrati in pagina.
 */

import type { ImageKey } from "./images";

export interface Service {
  /** Identificatore stabile, usato dal modulo di prenotazione. */
  id: string;
  name: string;
  description: string;
  /** Durata indicativa, es. "45 min". null = non mostrata. */
  duration: string | null;
  /** Prezzo, es. "da 35 €". null = non mostrato. */
  price: string | null;
  image: ImageKey;
  /** true dopo che il titolare ha confermato nome e descrizione. */
  confirmed: boolean;
}

export const services: Service[] = [
  {
    id: "taglio",
    name: "Taglio",
    description:
      "Un taglio costruito sulla forma del viso, sulla texture dei capelli e sul modo in cui li porti ogni giorno.",
    duration: null,
    price: null,
    image: "serviceCut",
    confirmed: false,
  },
  {
    id: "styling",
    name: "Piega e styling",
    description:
      "Piega, finish e styling per la giornata o per un'occasione speciale, con prodotti scelti per i tuoi capelli.",
    duration: null,
    price: null,
    image: "serviceStyling",
    confirmed: false,
  },
  {
    id: "barba",
    name: "Barba",
    description:
      "Rifinitura e cura della barba, con linee pulite e proporzioni pensate insieme al taglio.",
    duration: null,
    price: null,
    image: "serviceBeard",
    confirmed: false,
  },
  {
    id: "estetica",
    name: "Trattamenti estetici",
    description:
      "Trattamenti di estetica e cura della persona, per completare il tuo appuntamento in salone.",
    duration: null,
    price: null,
    image: "serviceBeauty",
    confirmed: false,
  },
];

/** Voce aggiuntiva del modulo per chi non ha ancora deciso. */
export const otherServiceOption = {
  id: "altro",
  name: "Altro o da definire insieme",
} as const;

export function serviceLabel(id: string): string | null {
  if (id === otherServiceOption.id) return otherServiceOption.name;
  return services.find((s) => s.id === id)?.name ?? null;
}
