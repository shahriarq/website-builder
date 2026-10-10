/**
 * Formattazione dei messaggi di richiesta appuntamento (WhatsApp e Telegram).
 * Modulo puro, senza dipendenze.
 */

export interface BookingSummary {
  serviceLabel: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  notes: string;
}

/** "2026-10-17" -> "sabato 17 ottobre 2026". */
export function formatDateIt(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return new Intl.DateTimeFormat("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

function lines(b: BookingSummary): string[] {
  const out = [
    `Servizio: ${b.serviceLabel}`,
    `Data preferita: ${formatDateIt(b.date)}`,
    `Orario preferito: ${b.time}`,
    `Nome: ${b.name}`,
    `Telefono: ${b.phone}`,
  ];
  if (b.notes) out.push(`Note: ${b.notes}`);
  return out;
}

/** Messaggio che il cliente invia al salone su WhatsApp. */
export function whatsappMessage(b: BookingSummary, salonName: string): string {
  return [
    `Buongiorno ${salonName}, vorrei richiedere un appuntamento.`,
    "",
    ...lines(b),
    "",
    "Resto in attesa della vostra conferma. Grazie!",
  ].join("\n");
}

/** Notifica che il bot Telegram invia al titolare. */
export function telegramMessage(b: BookingSummary): string {
  return [
    "Nuova richiesta di appuntamento dal sito",
    "",
    ...lines(b),
    "",
    "Stato: da confermare. Contatta il cliente per fissare l'appuntamento.",
  ].join("\n");
}

/**
 * Link ufficiale "click to chat" di WhatsApp.
 * Il numero va in formato internazionale, solo cifre, senza "+".
 */
export function whatsappUrl(number: string, text: string): string {
  const digits = number.replace(/\D/g, "");
  if (!digits) throw new Error("Numero WhatsApp non configurato");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
