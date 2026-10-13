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

export type MessageLang = "it" | "en";

export interface ValidationContext {
  serviceIds: readonly string[];
  timeOptions: readonly string[];
  /** Data odierna a Milano, formato YYYY-MM-DD. */
  today: string;
  maxDaysAhead: number;
  /** 0 = domenica ... 6 = sabato. */
  closedWeekdays: readonly number[];
  /** Lingua dei messaggi d'errore (predefinita: italiano). */
  lang?: MessageLang;
}

/** Separatore tra piu' servizi scelti insieme, es. "taglio+barba". */
export const SERVICE_SEPARATOR = "+";

/** Servizi scelti, senza duplicati e nell'ordine indicato. */
export function splitServices(value: string): string[] {
  return [...new Set(value.split(SERVICE_SEPARATOR).map((s) => s.trim()).filter(Boolean))];
}

const MESSAGES = {
  it: {
    serviceRequired: "Scegli almeno un servizio.",
    serviceInvalid: "Scegli un servizio dall'elenco.",
    dateRequired: "Scegli un giorno.",
    dateInvalid: "Inserisci una data valida.",
    datePast: "La data non può essere nel passato.",
    dateTooFar: (days: number) => `Puoi indicare una data entro i prossimi ${days} giorni.`,
    dateClosed: "In questo giorno il salone è chiuso. Scegli un'altra data.",
    timeRequired: "Scegli una fascia oraria.",
    timeInvalid: "Scegli una fascia oraria dall'elenco.",
    nameRequired: "Inserisci il tuo nome.",
    nameInvalid: "Inserisci un nome valido.",
    phoneRequired: "Inserisci un numero di telefono.",
    phoneInvalid: "Inserisci un numero di telefono valido, ad esempio 333 123 4567.",
    notesTooLong: (max: number) => `La nota può contenere al massimo ${max} caratteri.`,
    consentRequired: "Per inviare la richiesta conferma di aver letto l'informativa privacy.",
  },
  en: {
    serviceRequired: "Choose at least one service.",
    serviceInvalid: "Choose a service from the list.",
    dateRequired: "Choose a day.",
    dateInvalid: "Enter a valid date.",
    datePast: "The date can't be in the past.",
    dateTooFar: (days: number) => `You can choose a date within the next ${days} days.`,
    dateClosed: "The salon is closed on this day. Please choose another date.",
    timeRequired: "Choose a time of day.",
    timeInvalid: "Choose a time of day from the list.",
    nameRequired: "Enter your name.",
    nameInvalid: "Enter a valid name.",
    phoneRequired: "Enter a phone number.",
    phoneInvalid: "Enter a valid phone number, for example +39 333 123 4567.",
    notesTooLong: (max: number) => `The note can be at most ${max} characters.`,
    consentRequired: "To send the request, confirm you have read the privacy notice.",
  },
} as const;

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
    service: splitServices(sanitizeText(r.service, LIMITS.short)).join(SERVICE_SEPARATOR),
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
  const m = MESSAGES[ctx.lang ?? "it"];
  switch (field) {
    case "service": {
      const chosen = splitServices(input.service);
      if (chosen.length === 0) return m.serviceRequired;
      if (!chosen.every((id) => ctx.serviceIds.includes(id))) return m.serviceInvalid;
      return;
    }
    case "date": {
      if (!input.date) return m.dateRequired;
      const d = parseIsoDate(input.date);
      if (!d) return m.dateInvalid;
      if (input.date < ctx.today) return m.datePast;
      if (input.date > addDays(ctx.today, ctx.maxDaysAhead)) return m.dateTooFar(ctx.maxDaysAhead);
      if (ctx.closedWeekdays.includes(d.getUTCDay())) return m.dateClosed;
      return;
    }
    case "time":
      if (!input.time) return m.timeRequired;
      if (!ctx.timeOptions.includes(input.time)) return m.timeInvalid;
      return;
    case "name": {
      if (!input.name) return m.nameRequired;
      const letters = input.name.match(/\p{L}/gu)?.length ?? 0;
      if (letters < 2) return m.nameInvalid;
      return;
    }
    case "phone": {
      if (!input.phone) return m.phoneRequired;
      const digits = phoneDigits(input.phone);
      if (!digits || digits.length < 6 || digits.length > 15) return m.phoneInvalid;
      return;
    }
    case "notes":
      if (input.notes.length > LIMITS.notes) return m.notesTooLong(LIMITS.notes);
      return;
    case "consent":
      if (!input.consent) return m.consentRequired;
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
