/**
 * Collegamento leggero tra i punti di prenotazione (hero, servizi) e il
 * modulo: preseleziona il servizio senza passare dati nell'URL.
 */
export const SERVICE_EVENT = "style86:service";

export interface ServiceRequest {
  serviceId: string;
  /** true = dopo la preselezione il focus va al primo campo ancora da compilare. */
  focusNext?: boolean;
}

export function requestService(serviceId: string, focusNext = false) {
  window.dispatchEvent(new CustomEvent<ServiceRequest>(SERVICE_EVENT, { detail: { serviceId, focusNext } }));
}
