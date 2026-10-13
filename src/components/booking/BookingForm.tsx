"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { ArrowRightIcon, CheckIcon, CircleNotchIcon, PhoneIcon, WarningCircleIcon, WhatsappLogoIcon } from "@phosphor-icons/react";
import { site, telHref, whatsappChatHref } from "@/config/site";
import { bookingContext, serviceOptions, toSummary } from "@/lib/booking/context";
import {
  FIELD_ORDER,
  LIMITS,
  addDays,
  normalizeBooking,
  todayInRome,
  validateBooking,
  validateField,
  type BookingErrors,
  type BookingField,
  type BookingInput,
} from "@/lib/booking/validate";
import { whatsappMessage, whatsappUrl } from "@/lib/booking/message";
import { SERVICE_EVENT, type ServiceRequest } from "@/lib/booking/events";

type Status =
  | { kind: "editing" }
  | { kind: "submitting" }
  | { kind: "whatsapp"; url: string; opened: boolean }
  | { kind: "sent" }
  | { kind: "error"; message: string; fallback: boolean };

const noopSubscribe = () => () => {};

const EMPTY: BookingInput = { service: "", date: "", time: "", name: "", phone: "", notes: "", consent: false };

const FIELD_LABELS: Record<BookingField, string> = {
  service: "Servizio",
  date: "Data preferita",
  time: "Orario preferito",
  name: "Nome e cognome",
  phone: "Numero di telefono",
  notes: "Note",
  consent: "Consenso privacy",
};

/** Campi che seguono il servizio, nell'ordine in cui si compilano. */
const NEXT_FIELDS: BookingField[] = ["date", "time", "name", "phone"];

/** Canale effettivo: senza numero WhatsApp configurato, il modulo non puo' consegnare. */
function resolveDelivery(): "whatsapp" | "telegram" | "none" {
  if (site.booking.delivery === "telegram") return "telegram";
  return site.contact.whatsapp ? "whatsapp" : "none";
}

export function BookingForm() {
  const uid = useId();
  const id = (field: string) => `${uid}-${field}`;
  const delivery = resolveDelivery();

  const [values, setValues] = useState<BookingInput>(EMPTY);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [touched, setTouched] = useState<Partial<Record<BookingField, boolean>>>({});
  const [showSummary, setShowSummary] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "editing" });
  // Data odierna calcolata nel browser: la pagina e' statica e la build ha una data vecchia.
  const today = useSyncExternalStore(noopSubscribe, () => todayInRome(), () => null);
  const [honeypot, setHoneypot] = useState("");

  const startedAt = useRef<number>(0);
  const submitting = useRef(false);
  const valuesRef = useRef<BookingInput>(EMPTY);
  const summaryRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    startedAt.current = performance.now();
  }, []);

  useEffect(() => {
    valuesRef.current = values;
  }, [values]);

  // Preselezione dai pulsanti "Prenota" (hero, servizi).
  useEffect(() => {
    const onService = (e: Event) => {
      const { serviceId, focusNext } = (e as CustomEvent<ServiceRequest>).detail ?? {};
      if (!serviceOptions.some((s) => s.id === serviceId)) return;
      setValues((v) => ({ ...v, service: serviceId }));
      setErrors((errs) => ({ ...errs, service: undefined }));
      setStatus((s) => (s.kind === "editing" || s.kind === "error" ? s : { kind: "editing" }));

      // Focus sul primo campo ancora vuoto, solo con puntatore preciso:
      // su touch aprirebbe tastiera o selettore durante lo scorrimento.
      if (focusNext && window.matchMedia("(pointer: fine)").matches) {
        const next = NEXT_FIELDS.find((f) => !valuesRef.current[f]);
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

  const ctx = () => bookingContext();

  function update<K extends BookingField>(field: K, value: BookingInput[K]) {
    const next = { ...values, [field]: value };
    setValues(next);
    // Una volta segnalato un errore, si aggiorna mentre l'utente corregge.
    if (errors[field] || (field === "consent" && touched.consent)) {
      setErrors((e) => ({ ...e, [field]: validateField(field, normalizeBooking(next), ctx()) }));
    }
  }

  function blur(field: BookingField) {
    setTouched((t) => ({ ...t, [field]: true }));
    const value = values[field];
    if (value === "" || value === false) return; // niente errori su campi solo attraversati
    setErrors((e) => ({ ...e, [field]: validateField(field, normalizeBooking(values), ctx()) }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;

    const input = normalizeBooking(values);
    const found = validateBooking(input, ctx());
    setErrors(found);
    setTouched(Object.fromEntries(FIELD_ORDER.map((f) => [f, true])));
    if (Object.keys(found).length > 0) {
      setShowSummary(true);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setShowSummary(false);

    if (delivery === "whatsapp" && site.contact.whatsapp) {
      // Apertura sincrona, nello stesso gesto dell'utente, per evitare blocchi popup.
      const url = whatsappUrl(site.contact.whatsapp, whatsappMessage(toSummary(input), site.shortName));
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
          body: JSON.stringify({ ...input, company: honeypot, elapsedMs: Math.round(performance.now() - startedAt.current) }),
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
          setStatus({
            kind: "error",
            message: "Hai inviato diverse richieste in poco tempo. Riprova tra qualche minuto oppure chiamaci.",
            fallback: true,
          });
        } else if (res.status === 503) {
          setStatus({
            kind: "error",
            message: "L'invio automatico delle richieste non è ancora attivo. Contattaci per telefono o su WhatsApp.",
            fallback: true,
          });
        } else {
          setStatus({
            kind: "error",
            message: "Non è stato possibile inviare la richiesta. Riprova tra poco oppure contattaci direttamente.",
            fallback: true,
          });
        }
      } catch {
        setStatus({
          kind: "error",
          message: "Connessione non riuscita. Controlla la rete e riprova, oppure contattaci direttamente.",
          fallback: true,
        });
      } finally {
        submitting.current = false;
      }
    }
  }

  function reset(keepValues: boolean) {
    if (!keepValues) {
      setValues(EMPTY);
      setTouched({});
      startedAt.current = performance.now();
    }
    setErrors({});
    setShowSummary(false);
    setStatus({ kind: "editing" });
  }

  const errorList = FIELD_ORDER.filter((f) => errors[f]);
  const describedBy = (field: BookingField, helper = false) =>
    [helper && !errors[field] ? id(`${field}-help`) : null, errors[field] ? id(`${field}-error`) : null].filter(Boolean).join(" ") || undefined;

  const panel = "border-t border-line pt-8";

  // ---------- Esiti ----------
  if (status.kind === "whatsapp") {
    return (
      <div className={panel} aria-live="polite">
        <span className="inline-flex size-10 items-center justify-center bg-bronze text-charcoal" aria-hidden="true">
          <CheckIcon size={22} weight="bold" />
        </span>
        <h3 ref={resultRef} tabIndex={-1} className="display display-m mt-6 outline-none">
          La tua richiesta è stata preparata.
        </h3>
        <p className="mt-4 max-w-[34rem]">
          {status.opened
            ? "Abbiamo aperto WhatsApp con il messaggio già compilato. Per completare la richiesta premi Invia nella chat."
            : "Apri WhatsApp per trovare il messaggio già compilato, poi premi Invia nella chat."}{" "}
          L&apos;appuntamento sarà confermato dal salone.
        </p>
        <p className="mt-3 text-[0.9375rem] text-muted">Finché il messaggio non viene inviato, il salone non riceve la tua richiesta.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a href={status.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            <WhatsappLogoIcon size={20} aria-hidden="true" />
            {status.opened ? "Riapri WhatsApp" : "Apri WhatsApp"}
            <span className="sr-only"> (si apre in una nuova scheda)</span>
          </a>
          <button type="button" onClick={() => reset(true)} className="btn btn-secondary">
            Modifica la richiesta
          </button>
        </div>
        <p className="mt-8 border-t border-line pt-6 text-[0.9375rem] text-muted">
          Non usi WhatsApp? Chiama il salone al{" "}
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
        <span className="inline-flex size-10 items-center justify-center bg-bronze text-charcoal" aria-hidden="true">
          <CheckIcon size={22} weight="bold" />
        </span>
        <h3 ref={resultRef} tabIndex={-1} className="display display-m mt-6 outline-none">
          Richiesta inviata al salone.
        </h3>
        <p className="mt-4 max-w-[34rem]">
          L&apos;appuntamento non è ancora confermato: il salone ti contatterà al numero indicato per confermare giorno e orario.
        </p>
        <button type="button" onClick={() => reset(false)} className="btn btn-secondary mt-8">
          Nuova richiesta
        </button>
      </div>
    );
  }

  if (delivery === "none") {
    return (
      <div className={panel}>
        <h3 className="display display-s">Prenota per telefono</h3>
        <p className="mt-4">La richiesta online sarà presto disponibile. Nel frattempo chiamaci o prenota su Treatwell.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href={telHref()} className="btn btn-primary">
            <PhoneIcon size={18} aria-hidden="true" />
            {site.contact.phoneDisplay}
          </a>
          <a href={site.links.treatwell} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            Prenota su Treatwell
          </a>
        </div>
      </div>
    );
  }

  // ---------- Modulo ----------
  const isSubmitting = status.kind === "submitting";
  const maxDate = today ? addDays(today, site.booking.maxDaysAhead) : undefined;

  return (
    <form noValidate onSubmit={onSubmit} aria-labelledby="prenota-title" className="relative grid gap-8" aria-busy={isSubmitting}>
      {showSummary && errorList.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          aria-labelledby={id("summary-title")}
          className="border-2 border-error bg-raised p-5 outline-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ink"
        >
          <p id={id("summary-title")} className="flex items-center gap-2 font-semibold text-error">
            <WarningCircleIcon size={20} weight="bold" aria-hidden="true" />
            {errorList.length === 1 ? "C'è un campo da correggere" : `Ci sono ${errorList.length} campi da correggere`}
          </p>
          <ul className="mt-3 grid gap-1.5 text-[0.9375rem]">
            {errorList.map((f) => (
              <li key={f}>
                <a href={`#${id(f)}`} className="link">
                  {FIELD_LABELS[f]}: {errors[f]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {status.kind === "error" && (
        <div role="alert" className="border-2 border-error bg-raised p-5">
          <p className="flex items-start gap-2 font-medium text-error">
            <WarningCircleIcon size={20} weight="bold" className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>{status.message}</span>
          </p>
          {status.fallback && (
            <div className="mt-3 flex flex-wrap gap-x-6 text-[0.9375rem]">
              <a href={telHref()} className="link inline-flex min-h-11 items-center">
                Chiama {site.contact.phoneDisplay}
              </a>
              {whatsappChatHref() && (
                <a href={whatsappChatHref()!} target="_blank" rel="noopener noreferrer" className="link inline-flex min-h-11 items-center">
                  Scrivi su WhatsApp
                </a>
              )}
              <a href={site.links.treatwell} target="_blank" rel="noopener noreferrer" className="link inline-flex min-h-11 items-center">
                Prenota su Treatwell
              </a>
            </div>
          )}
        </div>
      )}

      {/* Campo trappola per i bot: invisibile e fuori dall'ordine di tabulazione. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("company")}>Azienda</label>
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

      <ChoiceGroup
        legend="Servizio"
        name="service"
        optionId={(i) => (i === 0 ? id("service") : id(`service-${i}`))}
        options={serviceOptions.map((s) => ({ value: s.id, label: s.name }))}
        value={values.service}
        onChange={(v) => update("service", v)}
        error={errors.service}
        errorId={id("service-error")}
        describedBy={describedBy("service")}
      />

      <div className="grid gap-8 md:grid-cols-[minmax(0,15rem)_1fr] md:gap-6">
        <Field
          label="Data preferita"
          htmlFor={id("date")}
          error={errors.date}
          errorId={id("date-error")}
          helper="Il salone ti conferma la disponibilità."
          helperId={id("date-help")}
        >
          <input
            id={id("date")}
            name="date"
            type="date"
            value={values.date}
            min={today ?? undefined}
            max={maxDate}
            onChange={(e) => update("date", e.target.value)}
            onBlur={() => blur("date")}
            aria-invalid={errors.date ? true : undefined}
            aria-describedby={describedBy("date", true)}
            required
            className="field"
          />
        </Field>

        <ChoiceGroup
          legend="Orario preferito"
          name="time"
          optionId={(i) => (i === 0 ? id("time") : id(`time-${i}`))}
          options={site.booking.timePreferences.map((t) => ({ value: t, label: t }))}
          value={values.time}
          onChange={(v) => update("time", v)}
          error={errors.time}
          errorId={id("time-error")}
          helper="È una preferenza, non un orario garantito."
          helperId={id("time-help")}
          describedBy={describedBy("time", true)}
        />
      </div>

      <div className="grid gap-8 sm:grid-cols-2 sm:gap-6">
        <Field label="Nome e cognome" htmlFor={id("name")} error={errors.name} errorId={id("name-error")}>
          <input
            id={id("name")}
            name="name"
            type="text"
            autoComplete="name"
            autoCapitalize="words"
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

        <Field label="Numero di telefono" htmlFor={id("phone")} error={errors.phone} errorId={id("phone-error")}>
          <input
            id={id("phone")}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={LIMITS.phone}
            placeholder="333 123 4567"
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

      <Field
        label="Note"
        optional
        htmlFor={id("notes")}
        error={errors.notes}
        errorId={id("notes-error")}
        helper={`${values.notes.length} di ${LIMITS.notes} caratteri`}
        helperId={id("notes-help")}
      >
        <textarea
          id={id("notes")}
          name="notes"
          rows={3}
          maxLength={LIMITS.notes}
          value={values.notes}
          onChange={(e) => update("notes", e.target.value)}
          onBlur={() => blur("notes")}
          aria-invalid={errors.notes ? true : undefined}
          aria-describedby={describedBy("notes", true)}
          placeholder="Ad esempio: lunghezza attuale, idea di taglio, esigenze particolari."
          className="field min-h-[6.5rem] resize-y"
        />
      </Field>

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
            className="mt-0.5 size-5 shrink-0 cursor-pointer accent-ink"
          />
          <label htmlFor={id("consent")} className="cursor-pointer text-[0.9375rem] leading-relaxed">
            Acconsento al trattamento dei dati inseriti al solo scopo di ricevere una risposta alla mia richiesta di
            appuntamento, come descritto nell&apos;
            <a href="/privacy" className="link">
              informativa privacy
            </a>
            .
          </label>
        </div>
        {errors.consent && <ErrorText id={id("consent-error")}>{errors.consent}</ErrorText>}
      </div>

      <div className="grid gap-4 border-t border-line pt-6">
        <p className="max-w-[36rem] text-[0.9375rem] text-muted">
          {delivery === "whatsapp"
            ? "Si apre WhatsApp con il messaggio già compilato: per completare la richiesta premi Invia nella chat."
            : "La richiesta arriva direttamente al salone, che ti ricontatta per confermare."}
        </p>
        <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full sm:w-auto sm:justify-self-start">
          {isSubmitting ? (
            <>
              <CircleNotchIcon size={18} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
              Invio in corso
            </>
          ) : delivery === "whatsapp" ? (
            <>
              <WhatsappLogoIcon size={20} aria-hidden="true" />
              Continua su WhatsApp
            </>
          ) : (
            <>
              Invia la richiesta
              <ArrowRightIcon size={18} className="btn-icon" aria-hidden="true" />
            </>
          )}
        </button>
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
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="grid content-start gap-2">
      <label htmlFor={htmlFor} className="text-[0.9375rem] font-semibold">
        {label}
        {optional && <span className="font-normal text-muted"> (facoltativo)</span>}
      </label>
      {children}
      {helper && !error && (
        <p id={helperId} className="text-[0.8125rem] text-muted">
          {helper}
        </p>
      )}
      {error && <ErrorText id={errorId}>{error}</ErrorText>}
    </div>
  );
}

/**
 * Gruppo di scelte a chip (radio). Le opzioni sono poche e brevi: tutte
 * visibili in un colpo d'occhio, piu' rapide da toccare di un menu a tendina.
 */
function ChoiceGroup({
  legend,
  name,
  optionId,
  options,
  value,
  onChange,
  error,
  errorId,
  helper,
  helperId,
  describedBy,
}: {
  legend: string;
  name: string;
  optionId: (index: number) => string;
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  errorId: string;
  helper?: string;
  helperId?: string;
  describedBy?: string;
}) {
  return (
    <fieldset className="grid content-start gap-2" aria-describedby={describedBy} data-invalid={error ? "" : undefined}>
      <legend className="mb-2 text-[0.9375rem] font-semibold">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option, i) => (
          <label key={option.value} className="chip">
            <input
              id={optionId(i)}
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              required
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {helper && !error && (
        <p id={helperId} className="text-[0.8125rem] text-muted">
          {helper}
        </p>
      )}
      {error && <ErrorText id={errorId}>{error}</ErrorText>}
    </fieldset>
  );
}
