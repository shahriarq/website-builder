/**
 * CONFIGURAZIONE CENTRALE DEL SITO
 * --------------------------------------------------------------------------
 * Tutte le informazioni sull'attivita' vivono qui. Modifica questo file per
 * aggiornare contatti, orari, link social, recensioni e prenotazioni.
 *
 * Regola: nessun dato non verificato viene mostrato come fatto. I campi che
 * richiedono conferma del titolare sono marcati con "DA CONFERMARE" e restano
 * nascosti (null / verified: false) finche' non vengono compilati.
 *
 * Questo file e' importato anche dal browser: NON inserire qui segreti
 * (token, chiavi API). I segreti vanno solo nelle variabili d'ambiente server.
 */

export type DayKey = "lun" | "mar" | "mer" | "gio" | "ven" | "sab" | "dom";

export interface OpeningHoursEntry {
  day: DayKey;
  /** Esempio: [["09:00", "13:00"], ["14:30", "19:30"]]. Array vuoto = chiuso. */
  ranges: Array<[string, string]>;
}

/** Una recensione reale, copiata alla lettera dalla piattaforma d'origine. */
export interface ReviewQuote {
  /** Testo breve e fedele all'originale (max ~200 caratteri, senza modificarne il senso). */
  text: string;
  /** Nome come appare sulla piattaforma (es. "Giulia B."). null = non mostrato. */
  author: string | null;
  source: "Google" | "Treatwell";
  /** Data della recensione, es. "2026-09-14". */
  date?: string;
  /** Link alla recensione o alla pagina delle recensioni. */
  url: string;
}

export interface ReviewSource {
  label: "Google" | "Treatwell";
  /** Valutazione media della singola piattaforma. null = non mostrata. */
  rating: number | null;
  /** Numero di recensioni della singola piattaforma. null = non mostrato. */
  count: number | null;
  url: string;
}

/** Un componente reale del team, mostrato nella sezione "Il team". */
export interface TeamMember {
  name: string;
  /** Ruolo come lo descrive il salone, es. "Barbiere", "Titolare". */
  role: string;
  /** Specialita' facoltativa, es. "Sfumature e rasatura". */
  focus?: string;
  /**
   * Foto reale della persona (con il suo consenso), importata come le altre
   * immagini, es. import marco from "@/assets/images/team-marco.jpg".
   */
  photo?: import("next/image").StaticImageData;
}

export interface SocialLink {
  label: string;
  href: string;
}

/**
 * Link alla scheda Google del salone. Se conosci l'URL esatto della scheda
 * (es. https://maps.app.goo.gl/...), sostituiscilo qui: vale per tutto il sito.
 */
const googleListing =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent("Style86 Parrucchieri & Estetica, Via Luigi Ornato 59, 20162 Milano");

export const site = {
  name: "Style86 Parrucchieri & Estetica",
  shortName: "Style86",
  wordmark: "STYLE86",
  locale: "it-IT",
  category: "Parrucchieri & Estetica",

  /**
   * URL pubblico del sito, senza slash finale (es. "https://www.style86.it").
   * Lasciato vuoto finche' il dominio non e' noto: canonical e sitemap
   * vengono generati solo quando e' presente.
   */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "") || null,

  address: {
    street: "Via Luigi Ornato, 59",
    postalCode: "20162",
    city: "Milano",
    province: "MI",
    region: "Lombardia",
    country: "IT",
    /** Riga completa usata in pagina. */
    full: "Via Luigi Ornato, 59, 20162 Milano MI",
  },

  contact: {
    /** Numero in formato leggibile, mostrato in pagina. */
    phoneDisplay: "+39 366 305 7307",
    /** Numero in formato E.164, usato per i link tel: e i dati strutturati. */
    phoneE164: "+393663057307",
    /**
     * Numero WhatsApp in formato internazionale SENZA "+" (richiesto da wa.me).
     * DA CONFERMARE: il numero pubblico non e' ancora stato verificato come
     * abilitato a WhatsApp. Imposta `whatsappVerified: true` dopo la verifica,
     * oppure metti `whatsapp: null` per nascondere ogni riferimento a WhatsApp.
     */
    whatsapp: "393663057307" as string | null,
    whatsappVerified: false,
    /** Indirizzo email pubblico. DA CONFERMARE: null = non mostrato. */
    email: null as string | null,
  },

  /** Link esterni gia' esistenti. */
  links: {
    treatwell: "https://www.treatwell.it/salone/style86/",
    googleListing,
    directions:
      "https://www.google.com/maps/dir/?api=1&destination=" +
      encodeURIComponent("Via Luigi Ornato 59, 20162 Milano MI"),
    /** Mappa incorporata: caricata solo dopo il consenso dell'utente. */
    mapEmbed:
      "https://www.google.com/maps?output=embed&q=" +
      encodeURIComponent("Style86 Parrucchieri & Estetica, Via Luigi Ornato 59, 20162 Milano"),
  },

  /**
   * Orari di apertura. DA CONFERMARE con il titolare.
   * null = la pagina invita a chiamare o scrivere per conoscere gli orari,
   * e gli orari non compaiono nei dati strutturati.
   */
  openingHours: null as OpeningHoursEntry[] | null,

  /**
   * IL TEAM. DA COMPILARE con il titolare: solo persone reali, con il loro
   * consenso a comparire sul sito. Finche' l'elenco e' vuoto la sezione
   * "Il team" racconta il lavoro in poltrona senza nomi.
   */
  team: [] as TeamMember[],

  /**
   * Profili social. Aggiungi solo profili reali, es.
   * { label: "Instagram", href: "https://www.instagram.com/..." }
   */
  social: [] as SocialLink[],

  /**
   * RECENSIONI ("Dicono di noi").
   * Google e Treatwell restano separati: mai sommare valutazioni o conteggi.
   *
   * DA VERIFICARE PRIMA DELLA PUBBLICAZIONE:
   * - google.rating / google.count: 4,9 su 5 da 125 recensioni, indicati dal
   *   titolare come dato della scheda Google. Ricontrollali sulla scheda.
   *   Dopo il controllo imposta `verified: true` (abilita anche i dati
   *   strutturati AggregateRating).
   * - treatwell.rating / treatwell.count: compilali con i valori mostrati
   *   sulla pagina Treatwell (sono diversi da quelli Google).
   * - quotes: incolla solo recensioni reali, copiate alla lettera. Finche'
   *   l'elenco e' vuoto non viene mostrata alcuna citazione.
   */
  reviews: {
    verified: false,
    google: {
      label: "Google",
      rating: 4.9,
      count: 125,
      url: googleListing,
    } as ReviewSource,
    treatwell: {
      label: "Treatwell",
      rating: null,
      count: null,
      url: "https://www.treatwell.it/salone/style86/",
    } as ReviewSource,
    quotes: [] as ReviewQuote[],
  },

  booking: {
    /**
     * Canale di consegna delle richieste di appuntamento:
     * - "whatsapp": il cliente invia un messaggio precompilato (predefinito).
     * - "telegram": il server inoltra la richiesta al bot Telegram del titolare.
     *   Richiede TELEGRAM_BOT_TOKEN e TELEGRAM_CHAT_ID lato server.
     */
    delivery: (process.env.NEXT_PUBLIC_BOOKING_DELIVERY === "telegram"
      ? "telegram"
      : "whatsapp") as "whatsapp" | "telegram",
    /** Quanti giorni in avanti si puo' scegliere una data preferita. */
    maxDaysAhead: 90,
    /**
     * Giorni della settimana in cui il salone e' chiuso (0 = domenica ... 6 = sabato).
     * DA CONFERMARE: lista vuota = nessun giorno escluso dal modulo.
     */
    closedWeekdays: [] as number[],
    /**
     * Fasce orarie proposte nel modulo. Sono preferenze, non disponibilita'
     * reali: il salone conferma sempre l'orario effettivo.
     */
    timePreferences: [
      "Mattina",
      "Ora di pranzo",
      "Primo pomeriggio",
      "Tardo pomeriggio",
      "Nessuna preferenza",
    ],
  },

  /** Dati per l'informativa privacy. DA CONFERMARE con il titolare. */
  privacy: {
    /** Ragione sociale del titolare del trattamento. */
    controllerName: null as string | null,
    /** Partita IVA, se si desidera mostrarla nel footer e nell'informativa. */
    vatNumber: null as string | null,
    /** Email per le richieste privacy. Se null si usa il telefono. */
    contactEmail: null as string | null,
    lastUpdated: "2026-10-10",
  },
} as const;

export type Site = typeof site;

/** Etichette italiane dei giorni, usate per mostrare gli orari. */
export const dayLabels: Record<DayKey, string> = {
  lun: "Lunedì",
  mar: "Martedì",
  mer: "Mercoledì",
  gio: "Giovedì",
  ven: "Venerdì",
  sab: "Sabato",
  dom: "Domenica",
};

export function telHref(): string {
  return `tel:${site.contact.phoneE164}`;
}

export function whatsappChatHref(text?: string): string | null {
  if (!site.contact.whatsapp) return null;
  const base = `https://wa.me/${site.contact.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
