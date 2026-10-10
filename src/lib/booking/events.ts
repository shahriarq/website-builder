/**
 * Collegamento leggero tra i pulsanti "Prenota" dei servizi e il modulo:
 * preseleziona il servizio senza passare dati nell'URL.
 */
export const SERVICE_EVENT = "style86:service";

export function requestService(serviceId: string) {
  window.dispatchEvent(new CustomEvent<string>(SERVICE_EVENT, { detail: serviceId }));
}
