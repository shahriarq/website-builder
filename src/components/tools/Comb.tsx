import { useId } from "react";

/**
 * Pettine da barbiere in SVG: dentatura fitta a sinistra, larga a destra,
 * filetto in ottone sul dorso. I denti sono generati, non disegnati a mano.
 */
const FINE = Array.from({ length: 50 }, (_, i) => ({ x: 26 + i * 8.6, w: 3.6, h: 86 }));
const COARSE = Array.from({ length: 27 }, (_, i) => ({ x: 470 + i * 15.4, w: 6.8, h: 92 }));

export function Comb({ className = "" }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const body = `comb-body-${uid}`;

  return (
    <svg viewBox="0 0 900 170" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={body} x1="0" y1="0" x2="0" y2="170" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3B3934" />
          <stop offset="0.35" stopColor="#292824" />
          <stop offset="1" stopColor="#171715" />
        </linearGradient>
      </defs>
      <g fill={`url(#${body})`}>
        {[...FINE, ...COARSE].map((t) => (
          <rect key={t.x} x={t.x} y="54" width={t.w} height={t.h} rx={t.w / 2} />
        ))}
        <rect x="8" y="8" width="884" height="54" rx="16" />
      </g>
      <rect x="22" y="22" width="856" height="2" rx="1" fill="#C8A77B" opacity="0.85" />
      <rect x="8" y="8" width="884" height="54" rx="16" fill="none" stroke="#E9E2D7" strokeOpacity="0.08" />
    </svg>
  );
}
