import { site } from "@/config/site";
import { otherServiceOption, serviceLabel, services } from "@/content/services";
import { splitServices, todayInRome, SERVICE_SEPARATOR, type BookingInput, type MessageLang, type ValidationContext } from "./validate.ts";
import type { BookingSummary } from "./message.ts";

/** Voci del modulo: id stabile, nome in italiano e in inglese. */
export const serviceOptions = [
  ...services.map((s) => ({ id: s.id, name: s.name, nameEn: s.en.name })),
  { id: otherServiceOption.id, name: otherServiceOption.name, nameEn: otherServiceOption.en.name },
];

export function bookingContext(now: Date = new Date(), lang: MessageLang = "it"): ValidationContext {
  return {
    serviceIds: serviceOptions.map((s) => s.id),
    timeOptions: site.booking.timePreferences,
    today: todayInRome(now),
    maxDaysAhead: site.booking.maxDaysAhead,
    closedWeekdays: site.booking.closedWeekdays,
    lang,
  };
}

/** Riepilogo per il salone, sempre in italiano; segnala se il cliente ha scritto dalla versione inglese. */
export function toSummary(input: BookingInput, lang: MessageLang = "it"): BookingSummary {
  const labels = splitServices(input.service).map((id) => serviceLabel(id) ?? id);
  return {
    serviceLabel: labels.join(` ${SERVICE_SEPARATOR} `),
    date: input.date,
    time: input.time,
    name: input.name,
    phone: input.phone,
    notes: input.notes,
    language: lang === "en" ? "inglese" : undefined,
  };
}
