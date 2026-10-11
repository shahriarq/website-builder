"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * Ricalcola le posizioni degli ScrollTrigger quando i font web sono pronti
 * (il cambio di carattere modifica le altezze del testo).
 */
export function ScrollRefresh() {
  useEffect(() => {
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}
