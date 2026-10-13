"use client";

import { useEffect, useRef } from "react";

/**
 * Numero che sale da zero al valore reale quando entra nel viewport.
 * Il valore finale e' gia' nel markup (server e senza JavaScript) ed e'
 * l'unico letto dalle tecnologie assistive.
 */
export function CountUp({
  value,
  decimals = 1,
  locale = "it-IT",
  className = "",
}: {
  value: number;
  decimals?: number;
  locale?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const format = (n: number) =>
    n.toLocaleString(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const duration = 1400;
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 4);
          el.textContent = format(value * eased);
          if (t < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, decimals, locale]);

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
