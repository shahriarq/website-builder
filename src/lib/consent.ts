/**
 * Preferenze sui contenuti di terze parti (oggi solo Google Maps).
 * Salvate in localStorage solo se l'utente chiede di ricordarle, mai in
 * cookie. Nessun tracciamento.
 */
export const MAP_CONSENT_KEY = "style86:consent:maps";
export const CONSENT_EVENT = "style86:consent";

/** Consenso valido solo per la visita corrente (non salvato). */
let sessionGranted = false;

function storedConsent(): boolean {
  try {
    return window.localStorage.getItem(MAP_CONSENT_KEY) === "granted";
  } catch {
    return false;
  }
}

export function readMapConsent(): boolean {
  return sessionGranted || storedConsent();
}

/** Carica la mappa per questa visita, senza salvare nulla. */
export function grantMapForSession() {
  sessionGranted = true;
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

/** Salva o revoca la preferenza. La revoca vale anche per la visita corrente. */
export function writeMapConsent(granted: boolean) {
  sessionGranted = granted;
  try {
    if (granted) window.localStorage.setItem(MAP_CONSENT_KEY, "granted");
    else window.localStorage.removeItem(MAP_CONSENT_KEY);
  } catch {
    /* archivio non disponibile: la scelta vale solo per questa visita */
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

export function subscribeConsent(callback: () => void) {
  window.addEventListener(CONSENT_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CONSENT_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
