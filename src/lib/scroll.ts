import { scrollToElement } from "./motion";

/**
 * Porta il focus e la vista su un'ancora interna, rispettando le preferenze
 * di movimento. Usato dai link interni (tramite SmoothScroll) e dal menu.
 */
export function goToAnchor(hash: string) {
  const id = hash.replace(/^#/, "");
  const target = id === "top" ? document.getElementById("top") : document.getElementById(id);
  if (!target) return;
  scrollToElement(target);
  history.replaceState(null, "", `#${id}`);
  const focusTarget = id === "top" ? document.getElementById("contenuto") : target;
  if (focusTarget) {
    if (!focusTarget.hasAttribute("tabindex")) focusTarget.setAttribute("tabindex", "-1");
    focusTarget.focus({ preventScroll: true });
  }
}
