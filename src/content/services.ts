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
  /** Traduzione inglese di nome, descrizione e (se presenti) durata e prezzo. */
  en: { name: string; description: string; duration?: string | null; price?: string | null };
}

export const services: Service[] = [
  {
    id: "taglio",
    name: "Taglio",
    description:
      "Forbici, macchinetta e sfumature costruite sulla forma della testa, sulla crescita dei capelli e su come li porti ogni giorno.",
    duration: null,
    price: null,
    image: "serviceCut",
    confirmed: false,
    en: { name: "Haircut", description: "Scissors, clippers and fades shaped around your head, how your hair grows and how you wear it every day." },
  },
  {
    id: "barba",
    name: "Barba",
    description:
      "Disegno, rifinitura e cura della barba: linee nette sul collo e sugli zigomi, proporzioni pensate insieme al taglio.",
    duration: null,
    price: null,
    image: "serviceBeard",
    confirmed: false,
    en: { name: "Beard", description: "Shaping, trimming and beard care: clean lines on the neck and cheekbones, proportions designed together with the cut." },
  },
  {
    id: "styling",
    name: "Styling",
    description:
      "Piega e finish con prodotti scelti per il tuo tipo di capello, per la giornata o per un'occasione.",
    duration: null,
    price: null,
    image: "serviceStyling",
    confirmed: false,
    en: { name: "Styling", description: "Blow-dry and finish with products chosen for your hair type, for the day or for an occasion." },
  },
  {
    id: "estetica",
    name: "Viso ed estetica",
    description:
      "Trattamenti di estetica e cura della persona, per completare l'appuntamento in poltrona.",
    duration: null,
    price: null,
    image: "serviceFace",
    confirmed: false,
    en: { name: "Face and grooming", description: "Grooming and personal care treatments to round off your time in the chair." },
  },
];

/** Voce aggiuntiva del modulo per chi non ha ancora deciso. */
export const otherServiceOption = {
  id: "altro",
  name: "Altro o da definire insieme",
  en: { name: "Other, or decide together" },
} as const;

/** Nome del servizio in italiano (usato nel messaggio al salone). */
export function serviceLabel(id: string): string | null {
  if (id === otherServiceOption.id) return otherServiceOption.name;
  return services.find((s) => s.id === id)?.name ?? null;
}

/** Nome e testi del servizio nella lingua della pagina. */
export function localizedService(service: Service, lang: "it" | "en") {
  if (lang === "it") return { name: service.name, description: service.description, duration: service.duration, price: service.price };
  return {
    name: service.en.name,
    description: service.en.description,
    duration: service.en.duration ?? service.duration,
    price: service.en.price ?? service.price,
  };
}
