/**
 * Porta il focus e la vista su un'ancora interna, rispettando le preferenze
 * di movimento. Usato quando un dialogo si chiude prima della navigazione.
 */
export function goToAnchor(hash: string) {
  const id = hash.replace(/^#/, "");
  const target = id === "top" ? document.body : document.getElementById(id);
  if (!target) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (id === "top") {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  } else {
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }
  history.replaceState(null, "", `#${id}`);
  const focusTarget = id === "top" ? document.getElementById("contenuto") : target;
  if (focusTarget) {
    if (!focusTarget.hasAttribute("tabindex")) focusTarget.setAttribute("tabindex", "-1");
    focusTarget.focus({ preventScroll: true });
  }
}
