/**
 * Validazione e normalizzazione delle richieste di appuntamento.
 * Modulo puro, condiviso tra browser (modulo) e server (endpoint Telegram).
 * Nessun import con alias: deve funzionare anche con `node --test`.
 */

export interface BookingInput {
  service: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  notes: string;
  consent: boolean;
}

export type BookingField = keyof BookingInput;
export type BookingErrors = Partial<Record<BookingField, string>>;

export interface ValidationContext {
  serviceIds: readonly string[];
  timeOptions: readonly string[];
  /** Data odierna a Milano, formato YYYY-MM-DD. */
  today: string;
  maxDaysAhead: number;
  /** 0 = domenica ... 6 = sabato. */
  closedWeekdays: readonly number[];
}

export const LIMITS = {
  name: 80,
  phone: 24,
  notes: 500,
  short: 60,
} as const;

/** Ordine dei campi, usato per il riepilogo errori e per il focus. */
export const FIELD_ORDER: BookingField[] = ["service", "date", "time", "name", "phone", "notes", "consent"];

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u202A-\u202E\u2066-\u2069]/g;

/** Rimuove caratteri di controllo, comprime gli spazi e taglia alla lunghezza massima. */
export function sanitizeText(value: unknown, max: number, multiline = false): string {
  if (typeof value !== "string") return "";
  let text = value.replace(CONTROL_CHARS, "");
  text = multiline
    ? text.replace(/\r\n?/g, "\n").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n")
    : text.replace(/\s+/g, " ");
  return text.trim().slice(0, max);
}

/** Converte un payload qualsiasi in un BookingInput pulito. */
export function normalizeBooking(raw: unknown): BookingInput {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    service: sanitizeText(r.service, LIMITS.short),
    date: sanitizeText(r.date, 10),
    time: sanitizeText(r.time, LIMITS.short),
    name: sanitizeText(r.name, LIMITS.name),
    phone: sanitizeText(r.phone, LIMITS.phone),
    notes: sanitizeText(r.notes, LIMITS.notes, true),
    consent: r.consent === true || r.consent === "true" || r.consent === "on",
  };
}

/** Data odierna nel fuso di Milano, formato YYYY-MM-DD. */
export function todayInRome(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

function parseIsoDate(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  if (d.getUTCFullYear() !== Number(m[1]) || d.getUTCMonth() !== Number(m[2]) - 1 || d.getUTCDate() !== Number(m[3])) {
    return null;
  }
  return d;
}

export function addDays(iso: string, days: number): string {
  const d = parseIsoDate(iso);
  if (!d) return iso;
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Cifre del numero, ammettendo +, spazi, punti, trattini e parentesi. */
export function phoneDigits(phone: string): string | null {
  const compact = phone.replace(/[\s.\-()/]/g, "");
  if (!/^(\+|00)?\d+$/.test(compact)) return null;
  return compact.replace(/^(\+|00)/, "");
}

export function validateField(field: BookingField, input: BookingInput, ctx: ValidationContext): string | undefined {
  switch (field) {
    case "service":
      if (!input.service) return "Scegli un servizio.";
      if (!ctx.serviceIds.includes(input.service)) return "Scegli un servizio dall'elenco.";
      return;
    case "date": {
      if (!input.date) return "Scegli una data preferita.";
      const d = parseIsoDate(input.date);
      if (!d) return "Inserisci una data valida.";
      if (input.date < ctx.today) return "La data non può essere nel passato.";
      if (input.date > addDays(ctx.today, ctx.maxDaysAhead)) {
        return `Puoi indicare una data entro i prossimi ${ctx.maxDaysAhead} giorni.`;
      }
      if (ctx.closedWeekdays.includes(d.getUTCDay())) {
        return "In questo giorno il salone è chiuso. Scegli un'altra data.";
      }
      return;
    }
    case "time":
      if (!input.time) return "Scegli una fascia oraria preferita.";
      if (!ctx.timeOptions.includes(input.time)) return "Scegli una fascia oraria dall'elenco.";
      return;
    case "name": {
      if (!input.name) return "Inserisci nome e cognome.";
      const letters = input.name.match(/\p{L}/gu)?.length ?? 0;
      if (letters < 2) return "Inserisci un nome valido.";
      return;
    }
    case "phone": {
      if (!input.phone) return "Inserisci un numero di telefono.";
      const digits = phoneDigits(input.phone);
      if (!digits || digits.length < 6 || digits.length > 15) {
        return "Inserisci un numero di telefono valido, ad esempio 333 123 4567.";
      }
      return;
    }
    case "notes":
      if (input.notes.length > LIMITS.notes) return `Le note possono contenere al massimo ${LIMITS.notes} caratteri.`;
      return;
    case "consent":
      if (!input.consent) return "Per inviare la richiesta devi acconsentire al trattamento dei dati.";
      return;
  }
}

export function validateBooking(input: BookingInput, ctx: ValidationContext): BookingErrors {
  const errors: BookingErrors = {};
  for (const field of FIELD_ORDER) {
    const message = validateField(field, input, ctx);
    if (message) errors[field] = message;
  }
  return errors;
}
