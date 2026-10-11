import { site } from "@/config/site";
import { otherServiceOption, serviceLabel, services } from "@/content/services";
import { todayInRome, type BookingInput, type ValidationContext } from "./validate.ts";
import type { BookingSummary } from "./message.ts";

export const serviceOptions = [
  ...services.map((s) => ({ id: s.id, name: s.name })),
  { id: otherServiceOption.id, name: otherServiceOption.name },
];

export function bookingContext(now: Date = new Date()): ValidationContext {
  return {
    serviceIds: serviceOptions.map((s) => s.id),
    timeOptions: site.booking.timePreferences,
    today: todayInRome(now),
    maxDaysAhead: site.booking.maxDaysAhead,
    closedWeekdays: site.booking.closedWeekdays,
  };
}

export function toSummary(input: BookingInput): BookingSummary {
  return {
    serviceLabel: serviceLabel(input.service) ?? input.service,
    date: input.date,
    time: input.time,
    name: input.name,
    phone: input.phone,
    notes: input.notes,
  };
}
