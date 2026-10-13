/**
 * POST /api/booking
 * Inoltra una richiesta di appuntamento alla chat Telegram privata del titolare.
 *
 * Variabili d'ambiente (solo server, mai esposte al browser):
 *   TELEGRAM_BOT_TOKEN  token del bot creato con @BotFather
 *   TELEGRAM_CHAT_ID    ID della chat che riceve le richieste
 *
 * Protezioni: controllo origine, limite dimensione, honeypot, tempo minimo di
 * compilazione, limite di frequenza per IP, validazione e pulizia dei campi.
 * I dati del cliente non vengono salvati ne' scritti nei log.
 */
import { NextResponse, type NextRequest } from "next/server";
import { normalizeBooking, validateBooking } from "@/lib/booking/validate.ts";
import { telegramMessage } from "@/lib/booking/message.ts";
import { createRateLimiter } from "@/lib/booking/rate-limit.ts";
import { bookingContext, toSummary } from "@/lib/booking/context.ts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 4096;
const MIN_FILL_MS = 2500;
const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

type ErrorCode = "not_configured" | "forbidden" | "too_large" | "bad_request" | "invalid" | "rate_limited" | "delivery_failed";

function fail(error: ErrorCode, status: number, extra: Record<string, unknown> = {}, headers: HeadersInit = {}) {
  return NextResponse.json({ ok: false, error, ...extra }, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function sameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // alcuni browser non inviano Origin sulle richieste same-origin
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return fail("not_configured", 503);

  if (!sameOrigin(req)) return fail("forbidden", 403);
  if (!(req.headers.get("content-type") ?? "").includes("application/json")) return fail("bad_request", 415);

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return fail("too_large", 413);

  let payload: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") throw new Error("not an object");
    payload = parsed as Record<string, unknown>;
  } catch {
    return fail("bad_request", 400);
  }

  const rate = limiter(clientIp(req));
  if (!rate.ok) {
    return fail("rate_limited", 429, { retryAfter: rate.retryAfterSeconds }, { "Retry-After": String(rate.retryAfterSeconds) });
  }

  // Honeypot e tempo minimo: ai bot rispondiamo "ok" senza inoltrare nulla.
  const honeypot = typeof payload.company === "string" ? payload.company.trim() : "";
  const elapsed = typeof payload.elapsedMs === "number" ? payload.elapsedMs : 0;
  if (honeypot || elapsed < MIN_FILL_MS) {
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  }

  const input = normalizeBooking(payload);
  // Lingua della pagina da cui arriva la richiesta: solo per i messaggi d'errore e la nota al salone.
  const lang = payload.lang === "en" ? "en" : "it";
  const errors = validateBooking(input, bookingContext(new Date(), lang));
  if (Object.keys(errors).length > 0) return fail("invalid", 422, { fields: errors });

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: telegramMessage(toSummary(input, lang)),
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!res.ok) {
      // Nel log solo lo stato HTTP: mai il contenuto della richiesta.
      console.error(`[booking] Telegram ha risposto con stato ${res.status}`);
      return fail("delivery_failed", 502);
    }
  } catch (err) {
    console.error(`[booking] Invio a Telegram non riuscito: ${err instanceof Error ? err.name : "errore"}`);
    return fail("delivery_failed", 502);
  }

  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
