"use client";

import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { ArrowRightIcon, CheckIcon, CircleNotchIcon, PhoneIcon, PlusIcon, WarningCircleIcon, WhatsappLogoIcon } from "@phosphor-icons/react";
import { site, telHref, whatsappChatHref } from "@/config/site";
import { bookingContext, serviceOptions, toSummary } from "@/lib/booking/context";
import {
  FIELD_ORDER,
  LIMITS,
  SERVICE_SEPARATOR,
  addDays,
  normalizeBooking,
  splitServices,
  todayInRome,
  validateBooking,
  validateField,
  type BookingErrors,
  type BookingField,
  type BookingInput,
} from "@/lib/booking/validate";
import { whatsappMessage, whatsappUrl } from "@/lib/booking/message";
import { SERVICE_EVENT, type ServiceRequest } from "@/lib/booking/events";
import { href, intlLocale, type Locale } from "@/i18n/config";
import { getDictionary, timeLabel } from "@/i18n/dictionaries";

type Status =
  | { kind: "editing" }
  | { kind: "submitting" }
  | { kind: "whatsapp"; url: string; opened: boolean }
  | { kind: "sent" }
  | { kind: "error"; message: string; fallback: boolean };

const noopSubscribe = () => () => {};

const EMPTY: BookingInput = { service: "", date: "", time: "", name: "", phone: "", notes: "", consent: false };

/** Campi che seguono il servizio, nell'ordine in cui si compilano. */
const NEXT_FIELDS: BookingField[] = ["date", "time", "name", "phone"];

/** Quanti giorni aperti proporre come scelta rapida (poi "Altra data"). */
const QUICK_DAYS = 6;

/** Canale effettivo: senza numero WhatsApp configurato, il modulo non puo' consegnare. */
function resolveDelivery(): "whatsapp" | "telegram" | "none" {
  if (site.booking.delivery === "telegram") return "telegram";
  return site.contact.whatsapp ? "whatsapp" : "none";
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Prossimi giorni di apertura a partire da oggi (fuso di Milano), saltando i giorni di chiusura. */
function quickDays(today: string): string[] {
  const out: string[] = [];
  for (let i = 0; out.length < QUICK_DAYS && i <= site.booking.maxDaysAhead; i++) {
    const iso = addDays(today, i);
    const weekday = new Date(`${iso}T12:00:00Z`).getUTCDay();
    if (!site.booking.closedWeekdays.includes(weekday)) out.push(iso);
  }
  return out;
}

/**
 * Modulo di richiesta appuntamento, compatto:
 * - servizi a scelta multipla (es. taglio + barba);
 * - giorno scelto con un tocco tra i prossimi giorni aperti, oppure "Altra data";
 * - tre fasce orarie; nome e telefono affiancati; nota facoltativa a scomparsa.
 * La logica di consegna non cambia: WhatsApp (messaggio precompilato) o Telegram.
 */
export function BookingForm({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);
  const f = t.form;
  const uid = useId();
  const id = (field: string) => `${uid}-${field}`;
  const delivery = resolveDelivery();

  const [values, setValues] = useState<BookingInput>(EMPTY);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [touched, setTouched] = useState<Partial<Record<BookingField, boolean>>>({});
  const [showSummary, setShowSummary] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "editing" });
  const [otherDay, setOtherDay] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  // Data odierna calcolata nel browser: la pagina e' statica e la build ha una data vecchia.
  const today = useSyncExternalStore(noopSubscribe, () => todayInRome(), () => null);
  const [honeypot, setHoneypot] = useState("");

  const startedAt = useRef<number>(0);
  const submitting = useRef(false);
  const valuesRef = useRef<BookingInput>(EMPTY);
  const summaryRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);

  const days = useMemo(() => (today ? quickDays(today) : []), [today]);
  const selectedServices = splitServices(values.service);

  useEffect(() => {
    startedAt.current = performance.now();
  }, []);

  useEffect(() => {
    valuesRef.current = values;
  }, [values]);

  // Preselezione dai pulsanti "Prenota" dei servizi: il servizio si aggiunge alla scelta.
  useEffect(() => {
    const onService = (e: Event) => {
      const { serviceId, focusNext } = (e as CustomEvent<ServiceRequest>).detail ?? {};
      if (!serviceOptions.some((s) => s.id === serviceId)) return;
      setValues((v) => {
        const chosen = splitServices(v.service);
        return chosen.includes(serviceId) ? v : { ...v, service: [...chosen, serviceId].join(SERVICE_SEPARATOR) };
      });
      setErrors((errs) => ({ ...errs, service: undefined }));
      setStatus((s) => (s.kind === "editing" || s.kind === "error" ? s : { kind: "editing" }));

      // Focus sul primo campo ancora vuoto, solo con puntatore preciso:
      // su touch aprirebbe tastiera o selettore durante lo scorrimento.
      if (focusNext && window.matchMedia("(pointer: fine)").matches) {
        const next = NEXT_FIELDS.find((field) => !valuesRef.current[field]);
        // Dopo la navigazione all'ancora, che altrimenti riporterebbe il focus al documento.
        if (next) requestAnimationFrame(() => document.getElementById(id(next))?.focus({ preventScroll: true }));
      }
    };
    window.addEventListener(SERVICE_EVENT, onService);
    return () => window.removeEventListener(SERVICE_EVENT, onService);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  useEffect(() => {
    if (status.kind === "whatsapp" || status.kind === "sent") resultRef.current?.focus();
  }, [status.kind]);

  const ctx = () => bookingContext(new Date(), lang);

  function update<K extends BookingField>(field: K, value: BookingInput[K]) {
    const next = { ...values, [field]: value };
    setValues(next);
    // Una volta segnalato un errore, si aggiorna mentre l'utente corregge.
    if (errors[field] || (field === "consent" && touched.consent)) {
      setErrors((e) => ({ ...e, [field]: validateField(field, normalizeBooking(next), ctx()) }));
    }
  }

  function blur(field: BookingField) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const value = values[field];
    if (value === "" || value === false) return; // niente errori su campi solo attraversati
    setErrors((e) => ({ ...e, [field]: validateField(field, normalizeBooking(values), ctx()) }));
  }

  function toggleService(serviceId: string, on: boolean) {
    const chosen = new Set(selectedServices);
    if (on) chosen.add(serviceId);
    else chosen.delete(serviceId);
    // Ordine stabile, quello dell'elenco.
    update("service", serviceOptions.filter((s) => chosen.has(s.id)).map((s) => s.id).join(SERVICE_SEPARATOR));
  }

  function pickDay(iso: string) {
    setOtherDay(false);
    update("date", iso);
  }

  function pickOtherDay() {
    setOtherDay(true);
    if (days.includes(values.date)) update("date", "");
    requestAnimationFrame(() => document.getElementById(id("date-other"))?.focus());
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;

    const input = normalizeBooking(values);
    const found = validateBooking(input, ctx());
    setErrors(found);
    setTouched(Object.fromEntries(FIELD_ORDER.map((field) => [field, true])));
    if (found.notes) setNoteOpen(true);
    if (Object.keys(found).length > 0) {
      setShowSummary(true);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setShowSummary(false);

    if (delivery === "whatsapp" && site.contact.whatsapp) {
      // Apertura sincrona, nello stesso gesto dell'utente, per evitare blocchi popup.
      const url = whatsappUrl(site.contact.whatsapp, whatsappMessage(toSummary(input, lang), site.shortName));
      const win = window.open(url, "_blank");
      if (win) win.opener = null;
      setStatus({ kind: "whatsapp", url, opened: Boolean(win) });
      return;
    }

    if (delivery === "telegram") {
      submitting.current = true;
      setStatus({ kind: "submitting" });
      try {
        const res = await fetch("/api/booking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...input, lang, company: honeypot, elapsedMs: Math.round(performance.now() - startedAt.current) }),
        });
        const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fields?: BookingErrors };
        if (res.ok && data.ok) {
          setStatus({ kind: "sent" });
        } else if (res.status === 422 && data.fields) {
          setErrors(data.fields);
          setShowSummary(true);
          setStatus({ kind: "editing" });
          requestAnimationFrame(() => summaryRef.current?.focus());
        } else if (res.status === 429) {
          setStatus({ kind: "error", message: f.errorRateLimit, fallback: true });
        } else if (res.status === 503) {
          setStatus({ kind: "error", message: f.errorNotConfigured, fallback: true });
        } else {
          setStatus({ kind: "error", message: f.errorGeneric, fallback: true });
        }
      } catch {
        setStatus({ kind: "error", message: f.errorNetwork, fallback: true });
      } finally {
        submitting.current = false;
      }
    }
  }

  function reset(keepValues: boolean) {
    if (!keepValues) {
      setValues(EMPTY);
      setTouched({});
      setOtherDay(false);
      setNoteOpen(false);
      startedAt.current = performance.now();
    }
    setErrors({});
    setShowSummary(false);
    setStatus({ kind: "editing" });
  }

  const errorList = FIELD_ORDER.filter((field) => errors[field]);
  const describedBy = (field: BookingField, helper = false) =>
    [helper && !errors[field] ? id(`${field}-help`) : null, errors[field] ? id(`${field}-error`) : null].filter(Boolean).join(" ") ||
    undefined;

  const panel = "border-t border-line pt-8";

  // ---------- Esiti ----------
  if (status.kind === "whatsapp") {
    return (
      <div className={panel} aria-live="polite">
        <span className="inline-flex size-10 items-center justify-center rounded-full bg-bronze text-charcoal" aria-hidden="true">
          <CheckIcon size={20} weight="bold" />
        </span>
        <h3 ref={resultRef} tabIndex={-1} className="display display-m mt-6 outline-none">
          {f.preparedTitle}
        </h3>
        <p className="mt-4 max-w-[34rem]">
          {status.opened ? f.preparedOpened : f.preparedBlocked} {f.preparedConfirm}
        </p>
        <p className="mt-3 text-[0.9375rem] text-muted">{f.preparedWarning}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a href={status.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            <WhatsappLogoIcon size={20} aria-hidden="true" />
            {status.opened ? f.reopen : f.open}
            <span className="sr-only"> {t.common.newTab}</span>
          </a>
          <button type="button" onClick={() => reset(true)} className="btn btn-secondary">
            {f.edit}
          </button>
        </div>
        <p className="mt-8 border-t border-line pt-6 text-[0.9375rem] text-muted">
          {f.noWhatsapp}{" "}
          <a href={telHref()} className="link whitespace-nowrap text-ink">
            {site.contact.phoneDisplay}
          </a>
          .
        </p>
      </div>
    );
  }

  if (status.kind === "sent") {
    return (
      <div className={panel} aria-live="polite">
        <span className="inline-flex size-10 items-center justify-center rounded-full bg-bronze text-charcoal" aria-hidden="true">
          <CheckIcon size={20} weight="bold" />
        </span>
        <h3 ref={resultRef} tabIndex={-1} className="display display-m mt-6 outline-none">
          {f.sentTitle}
        </h3>
        <p className="mt-4 max-w-[34rem]">{f.sentBody}</p>
        <button type="button" onClick={() => reset(false)} className="btn btn-secondary mt-8">
          {f.newRequest}
        </button>
      </div>
    );
  }

  if (delivery === "none") {
    return (
      <div className={panel}>
        <h3 className="display display-s">{f.phoneOnlyTitle}</h3>
        <p className="mt-4">{f.phoneOnlyBody}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href={telHref()} className="btn btn-primary">
            <PhoneIcon size={18} aria-hidden="true" />
            {site.contact.phoneDisplay}
          </a>
          <a href={site.links.treatwell} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            {f.bookOnTreatwell}
          </a>
        </div>
      </div>
    );
  }

  // ---------- Modulo ----------
  const isSubmitting = status.kind === "submitting";
  const maxDate = today ? addDays(today, site.booking.maxDaysAhead) : undefined;
  const dayFormat = new Intl.DateTimeFormat(intlLocale[lang], { weekday: "short", timeZone: "UTC" });
  const dateFormat = new Intl.DateTimeFormat(intlLocale[lang], { day: "numeric", month: "short", timeZone: "UTC" });
  const customDate = values.date !== "" && !days.includes(values.date);
  const showDateInput = otherDay || customDate || days.length === 0;

  return (
    <form noValidate onSubmit={onSubmit} aria-labelledby="prenota-title" className="relative grid gap-7" aria-busy={isSubmitting}>
      {showSummary && errorList.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          aria-labelledby={id("summary-title")}
          className="border border-error/70 p-4 outline-none focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-ink"
        >
          <p id={id("summary-title")} className="flex items-center gap-2 font-semibold text-error">
            <WarningCircleIcon size={20} weight="bold" aria-hidden="true" />
            {errorList.length === 1 ? f.summaryOne : f.summaryMany(errorList.length)}
          </p>
          <ul className="mt-2 grid gap-1 text-[0.9375rem]">
            {errorList.map((field) => (
              <li key={field}>
                <a href={`#${id(field === "date" && showDateInput ? "date-other" : field)}`} className="link">
                  {f.fieldLabels[field]}: {errors[field]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {status.kind === "error" && (
        <div role="alert" className="border border-error/70 p-4">
          <p className="flex items-start gap-2 font-medium text-error">
            <WarningCircleIcon size={20} weight="bold" className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>{status.message}</span>
          </p>
          {status.fallback && (
            <div className="mt-2 flex flex-wrap gap-x-6 text-[0.9375rem]">
              <a href={telHref()} className="inline-flex min-h-11 items-center">
                <span className="link">{f.callNumber(site.contact.phoneDisplay)}</span>
              </a>
              {whatsappChatHref() && (
                <a href={whatsappChatHref()!} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center">
                  <span className="link">{f.writeWhatsapp}</span>
                </a>
              )}
              <a href={site.links.treatwell} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center">
                <span className="link">{f.bookOnTreatwell}</span>
              </a>
            </div>
          )}
        </div>
      )}

      {/* Campo trappola per i bot: invisibile e fuori dall'ordine di tabulazione. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("company")}>{f.honeypot}</label>
        <input
          id={id("company")}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {/* Servizi: scelta multipla */}
      <Group legend={f.service} hint={f.serviceHint} hintId={id("service-help")} error={errors.service} errorId={id("service-error")} describedBy={describedBy("service", true)}>
        {serviceOptions.map((s, i) => (
          <label key={s.id} className="chip">
            <input
              id={i === 0 ? id("service") : id(`service-${i}`)}
              type="checkbox"
              name="service"
              value={s.id}
              checked={selectedServices.includes(s.id)}
              onChange={(e) => toggleService(s.id, e.target.checked)}
            />
            <span>
              {s.id === "altro" ? f.other : lang === "en" ? s.nameEn : s.name}
            </span>
          </label>
        ))}
      </Group>

      {/* Giorno: prossimi giorni aperti a portata di tocco, oppure una data a scelta */}
      <Group legend={f.day} error={errors.date} errorId={id("date-error")} describedBy={describedBy("date")} scroll>
        {days.map((iso, i) => (
          <label key={iso} className="chip chip-day">
            <input
              id={i === 0 ? id("date") : id(`date-${i}`)}
              type="radio"
              name="date"
              value={iso}
              checked={!showDateInput && values.date === iso}
              onChange={() => pickDay(iso)}
            />
            <span>
              <span className="chip-day-top">{i === 0 ? f.today : i === 1 && iso === addDays(today!, 1) ? f.tomorrow : capitalize(dayFormat.format(new Date(`${iso}T12:00:00Z`)))}</span>
              <span className="chip-day-bottom">{dateFormat.format(new Date(`${iso}T12:00:00Z`))}</span>
            </span>
          </label>
        ))}
        {days.length > 0 && (
          <label className="chip chip-day">
            <input type="radio" name="date" value="" checked={showDateInput} onChange={pickOtherDay} />
            <span>
              <span className="chip-day-top">{f.otherDay}</span>
              <span className="chip-day-bottom" aria-hidden="true">
                …
              </span>
            </span>
          </label>
        )}
      </Group>
      {showDateInput && (
        <div className="-mt-3 grid max-w-[16rem] gap-1">
          <label htmlFor={id("date-other")} className="text-[0.875rem] font-semibold">
            {f.pickDate}
          </label>
          <input
            id={id("date-other")}
            name="date-other"
            type="date"
            value={customDate || otherDay ? values.date : ""}
            min={today ?? undefined}
            max={maxDate}
            onChange={(e) => update("date", e.target.value)}
            onBlur={() => blur("date")}
            aria-invalid={errors.date ? true : undefined}
            aria-describedby={describedBy("date")}
            className="field"
          />
        </div>
      )}

      {/* Fascia oraria */}
      <Group legend={f.time} hint={f.timeHint} hintId={id("time-help")} error={errors.time} errorId={id("time-error")} describedBy={describedBy("time", true)}>
        {site.booking.timePreferences.map((value, i) => (
          <label key={value} className="chip">
            <input
              id={i === 0 ? id("time") : id(`time-${i}`)}
              type="radio"
              name="time"
              value={value}
              checked={values.time === value}
              onChange={() => update("time", value)}
            />
            <span>{timeLabel(lang, value)}</span>
          </label>
        ))}
      </Group>

      <div className="grid gap-6 sm:grid-cols-2 sm:gap-5">
        <Field label={f.name} htmlFor={id("name")} error={errors.name} errorId={id("name-error")}>
          <input
            id={id("name")}
            name="name"
            type="text"
            autoComplete="name"
            autoCapitalize="words"
            enterKeyHint="next"
            maxLength={LIMITS.name}
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            onBlur={() => blur("name")}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy("name")}
            required
            className="field"
          />
        </Field>
        <Field label={f.phone} htmlFor={id("phone")} error={errors.phone} errorId={id("phone-error")}>
          <input
            id={id("phone")}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            enterKeyHint="done"
            maxLength={LIMITS.phone}
            placeholder={f.phonePlaceholder}
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
            onBlur={() => blur("phone")}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={describedBy("phone")}
            required
            className="field"
          />
        </Field>
      </div>

      {/* Nota facoltativa: chiusa finche' non serve */}
      {noteOpen || values.notes ? (
        <Field
          label={f.note}
          optional={f.optional}
          htmlFor={id("notes")}
          error={errors.notes}
          errorId={id("notes-error")}
          helper={f.noteCount(values.notes.length, LIMITS.notes)}
          helperId={id("notes-help")}
        >
          <textarea
            id={id("notes")}
            name="notes"
            rows={2}
            maxLength={LIMITS.notes}
            value={values.notes}
            onChange={(e) => update("notes", e.target.value)}
            onBlur={() => blur("notes")}
            aria-invalid={errors.notes ? true : undefined}
            aria-describedby={describedBy("notes", true)}
            placeholder={f.notePlaceholder}
            className="field min-h-[4.5rem] resize-y"
          />
        </Field>
      ) : (
        <button
          type="button"
          onClick={() => {
            setNoteOpen(true);
            requestAnimationFrame(() => document.getElementById(id("notes"))?.focus());
          }}
          aria-expanded={false}
          className="-my-2 inline-flex min-h-11 items-center gap-2 self-start text-[0.9375rem] text-muted transition-colors hover:text-ink"
        >
          <span aria-hidden="true" className="inline-flex size-6 items-center justify-center rounded-full border border-line-strong">
            <PlusIcon size={12} weight="bold" />
          </span>
          {f.addNote}
        </button>
      )}

      <div className="grid gap-5 border-t border-line pt-6">
        <div>
          <div className="flex items-start gap-3">
            <input
              id={id("consent")}
              name="consent"
              type="checkbox"
              checked={values.consent}
              onChange={(e) => update("consent", e.target.checked)}
              onBlur={() => blur("consent")}
              aria-invalid={errors.consent ? true : undefined}
              aria-describedby={describedBy("consent")}
              required
              className="mt-0.5 size-5 shrink-0 cursor-pointer accent-[var(--color-bronze)]"
            />
            <label htmlFor={id("consent")} className="cursor-pointer text-[0.875rem] leading-snug text-muted">
              {f.consentBefore}
              <a href={href(lang, "/privacy")} className="link text-ink">
                {f.consentLink}
              </a>
              {f.consentAfter}
            </label>
          </div>
          {errors.consent && <ErrorText id={id("consent-error")}>{errors.consent}</ErrorText>}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
          <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full sm:w-auto">
            {isSubmitting ? (
              <>
                <CircleNotchIcon size={18} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
                {f.sending}
              </>
            ) : delivery === "whatsapp" ? (
              <>
                <WhatsappLogoIcon size={20} aria-hidden="true" />
                {f.submitWhatsapp}
              </>
            ) : (
              <>
                {f.submitServer}
                <ArrowRightIcon size={18} className="btn-icon" aria-hidden="true" />
              </>
            )}
          </button>
          <p className="text-[0.8125rem] leading-snug text-muted sm:max-w-[18rem]">{delivery === "whatsapp" ? f.whatsappHint : f.serverHint}</p>
        </div>
      </div>
    </form>
  );
}

function ErrorText({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="mt-2 flex items-start gap-1.5 text-[0.875rem] font-medium text-error">
      <WarningCircleIcon size={16} weight="bold" className="mt-0.5 shrink-0" aria-hidden="true" />
      {children}
    </p>
  );
}

function Field({
  label,
  htmlFor,
  error,
  errorId,
  helper,
  helperId,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  errorId: string;
  helper?: string;
  helperId?: string;
  optional?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid content-start gap-1">
      <label htmlFor={htmlFor} className="text-[0.875rem] font-semibold">
        {label}
        {optional && <span className="font-normal text-muted"> ({optional})</span>}
      </label>
      {children}
      {helper && !error && (
        <p id={helperId} className="text-[0.75rem] text-muted">
          {helper}
        </p>
      )}
      {error && <ErrorText id={errorId}>{error}</ErrorText>}
    </div>
  );
}

/**
 * Gruppo di scelte a chip. Con `scroll` su telefono diventa una riga che
 * scorre di lato (giorni), da tablet in su va a capo.
 */
function Group({
  legend,
  hint,
  hintId,
  error,
  errorId,
  describedBy,
  scroll = false,
  children,
}: {
  legend: string;
  hint?: string;
  hintId?: string;
  error?: string;
  errorId: string;
  describedBy?: string;
  scroll?: boolean;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="grid min-w-0 content-start gap-2" aria-describedby={describedBy} data-invalid={error ? "" : undefined}>
      <legend className="mb-2 flex w-full flex-wrap items-baseline justify-between gap-x-4 text-[0.875rem] font-semibold">
        {legend}
        {hint && !error && (
          <span id={hintId} className="text-[0.75rem] font-normal text-muted">
            {hint}
          </span>
        )}
      </legend>
      <div
        className={
          scroll
            ? "-mx-5 flex snap-x scroll-px-5 gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
            : "flex flex-wrap gap-2"
        }
      >
        {children}
      </div>
      {error && <ErrorText id={errorId}>{error}</ErrorText>}
    </fieldset>
  );
}
