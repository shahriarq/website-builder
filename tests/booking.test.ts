import { test } from "node:test";
import assert from "node:assert/strict";
import {
  addDays,
  normalizeBooking,
  phoneDigits,
  sanitizeText,
  todayInRome,
  validateBooking,
  type ValidationContext,
} from "../src/lib/booking/validate.ts";
import { formatDateIt, telegramMessage, whatsappMessage, whatsappUrl } from "../src/lib/booking/message.ts";
import { createRateLimiter } from "../src/lib/booking/rate-limit.ts";

const ctx: ValidationContext = {
  serviceIds: ["taglio", "styling", "barba", "estetica", "altro"],
  timeOptions: ["Mattina", "Primo pomeriggio", "Nessuna preferenza"],
  today: "2026-10-10",
  maxDaysAhead: 90,
  closedWeekdays: [],
};

const valid = {
  service: "taglio",
  date: "2026-10-17",
  time: "Mattina",
  name: "Giulia Bianchi",
  phone: "+39 333 123 4567",
  notes: "",
  consent: true,
};

test("una richiesta completa è valida", () => {
  assert.deepEqual(validateBooking(normalizeBooking(valid), ctx), {});
});

test("i campi obbligatori vuoti producono errori in italiano", () => {
  const errors = validateBooking(normalizeBooking({}), ctx);
  assert.equal(errors.service, "Scegli almeno un servizio.");
  assert.equal(errors.date, "Scegli un giorno.");
  assert.equal(errors.time, "Scegli una fascia oraria.");
  assert.equal(errors.name, "Inserisci il tuo nome.");
  assert.equal(errors.phone, "Inserisci un numero di telefono.");
  assert.match(errors.consent ?? "", /informativa privacy/);
  assert.equal(errors.notes, undefined);
});

test("con lang: \"en\" gli errori sono in inglese", () => {
  const errors = validateBooking(normalizeBooking({}), { ...ctx, lang: "en" });
  assert.equal(errors.service, "Choose at least one service.");
  assert.equal(errors.date, "Choose a day.");
  assert.equal(errors.phone, "Enter a phone number.");
  assert.match(errors.consent ?? "", /privacy notice/);
});

test("piu' servizi insieme sono validi, senza duplicati; un servizio estraneo li invalida", () => {
  const combo = normalizeBooking({ ...valid, service: "taglio+barba+taglio" });
  assert.equal(combo.service, "taglio+barba");
  assert.deepEqual(validateBooking(combo, ctx), {});
  assert.ok(validateBooking(normalizeBooking({ ...valid, service: "taglio+massaggio" }), ctx).service);
  assert.ok(validateBooking(normalizeBooking({ ...valid, service: "+" }), ctx).service);
});

test("servizi e fasce fuori elenco vengono rifiutati", () => {
  const errors = validateBooking(normalizeBooking({ ...valid, service: "massaggio", time: "Alle 3 di notte" }), ctx);
  assert.ok(errors.service);
  assert.ok(errors.time);
});

test("le date passate, troppo lontane o inesistenti vengono rifiutate", () => {
  assert.match(validateBooking(normalizeBooking({ ...valid, date: "2026-10-09" }), ctx).date ?? "", /passato/);
  assert.match(validateBooking(normalizeBooking({ ...valid, date: "2027-03-01" }), ctx).date ?? "", /90 giorni/);
  assert.match(validateBooking(normalizeBooking({ ...valid, date: "2026-02-30" }), ctx).date ?? "", /valida/);
  assert.equal(validateBooking(normalizeBooking({ ...valid, date: "2026-10-10" }), ctx).date, undefined);
});

test("i giorni di chiusura configurati vengono rifiutati", () => {
  // 2026-10-18 e' una domenica.
  const closed = { ...ctx, closedWeekdays: [0] };
  assert.match(validateBooking(normalizeBooking({ ...valid, date: "2026-10-18" }), closed).date ?? "", /chiuso/);
});

test("validazione del telefono", () => {
  assert.equal(phoneDigits("+39 333 123 4567"), "393331234567");
  assert.equal(phoneDigits("0039 (02) 1234-567"), "39021234567");
  assert.equal(phoneDigits("333abc"), null);
  assert.ok(validateBooking(normalizeBooking({ ...valid, phone: "123" }), ctx).phone);
  assert.equal(validateBooking(normalizeBooking({ ...valid, phone: "02 1234567" }), ctx).phone, undefined);
});

test("la pulizia rimuove caratteri di controllo e limita la lunghezza", () => {
  assert.equal(sanitizeText("  Mario\u0000 \u202ERossi  ", 80), "Mario Rossi");
  assert.equal(sanitizeText("riga1\r\n\r\n\r\n\r\nriga2", 500, true), "riga1\n\nriga2");
  assert.equal(sanitizeText("x".repeat(900), 500, true).length, 500);
  assert.equal(sanitizeText(42, 10), "");
  assert.equal(normalizeBooking({ consent: "true" }).consent, true);
  assert.equal(normalizeBooking({ consent: "yes" }).consent, false);
});

test("date di supporto", () => {
  assert.equal(addDays("2026-12-30", 3), "2027-01-02");
  assert.match(todayInRome(new Date("2026-10-10T23:30:00Z")), /^2026-10-11$/);
  assert.equal(formatDateIt("2026-10-17"), "sabato 17 ottobre 2026");
});

const summary = {
  serviceLabel: "Taglio",
  date: "2026-10-17",
  time: "Mattina",
  name: "Giulia Bianchi",
  phone: "+39 333 123 4567",
  notes: "Capelli lunghi & mossi? Sì #1",
};

test("messaggio WhatsApp leggibile in italiano", () => {
  const text = whatsappMessage(summary, "Style86");
  assert.match(text, /^Buongiorno Style86, vorrei richiedere un appuntamento\./);
  assert.match(text, /Servizio: Taglio/);
  assert.match(text, /Data preferita: sabato 17 ottobre 2026/);
  assert.match(text, /Orario preferito: Mattina/);
  assert.match(text, /Note: Capelli lunghi & mossi\? Sì #1/);
  assert.match(text, /attesa della vostra conferma/);
  assert.doesNotMatch(whatsappMessage({ ...summary, notes: "" }, "Style86"), /Note:/);
});

test("URL WhatsApp ufficiale con testo codificato", () => {
  const url = whatsappUrl("39 366 305 7307", whatsappMessage(summary, "Style86"));
  assert.ok(url.startsWith("https://wa.me/393663057307?text="));
  const decoded = decodeURIComponent(new URL(url).search.slice("?text=".length));
  assert.equal(decoded, whatsappMessage(summary, "Style86"));
  assert.ok(!url.includes(" ") && !url.includes("#") && !url.includes("&m"));
  assert.throws(() => whatsappUrl("", "x"));
});

test("notifica Telegram segnala lo stato da confermare", () => {
  const text = telegramMessage(summary);
  assert.match(text, /Nuova richiesta di appuntamento dal sito/);
  assert.match(text, /da confermare/);
});

test("limitatore di frequenza", () => {
  const check = createRateLimiter({ limit: 2, windowMs: 1000 });
  assert.equal(check("ip", 0).ok, true);
  assert.equal(check("ip", 100).ok, true);
  const blocked = check("ip", 200);
  assert.equal(blocked.ok, false);
  assert.equal(blocked.retryAfterSeconds, 1);
  assert.equal(check("altro-ip", 200).ok, true);
  assert.equal(check("ip", 1200).ok, true);
});
