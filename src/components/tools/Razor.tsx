import { useId } from "react";

/**
 * Rasoio a mano libera in SVG.
 * - [data-part="blade"]: lama in acciaio, ruota attorno al rivetto (300, 100).
 *   Aperta = 0 gradi; chiusa (ripiegata nel manico) = 180 gradi.
 * - [data-part="handle"]: manico color avorio con rivetti in ottone.
 */
export const RAZOR_PIVOT = "300 100";

export function Razor({ className = "" }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const steel = `razor-steel-${uid}`;
  const bone = `razor-bone-${uid}`;
  const brass = `razor-brass-${uid}`;

  return (
    <svg viewBox="0 0 760 200" className={className} aria-hidden="true" focusable="false" overflow="visible">
      <defs>
        <linearGradient id={steel} x1="0" y1="76" x2="0" y2="130" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#8B857A" />
          <stop offset="0.3" stopColor="#E9E3D8" />
          <stop offset="0.62" stopColor="#B5AEA2" />
          <stop offset="1" stopColor="#F4EFE7" />
        </linearGradient>
        <linearGradient id={bone} x1="0" y1="70" x2="0" y2="130" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F2ECE2" />
          <stop offset="0.5" stopColor="#E0D7C8" />
          <stop offset="1" stopColor="#B9AE9C" />
        </linearGradient>
        <radialGradient id={brass} cx="0.38" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#F0DDBE" />
          <stop offset="0.55" stopColor="#C8A77B" />
          <stop offset="1" stopColor="#7A5F3A" />
        </radialGradient>
      </defs>

      <g data-part="handle">
        <path
          d="M 282 100 C 282 81 297 72 322 71 L 690 75 C 732 77 754 89 754 100 C 754 111 732 123 690 125 L 322 129 C 297 128 282 119 282 100 Z"
          fill={`url(#${bone})`}
        />
        <path d="M 330 84 L 692 86" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M 330 117 L 692 115" stroke="#8E8370" strokeOpacity="0.35" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="700" cy="100" r="6.5" fill={`url(#${brass})`} />
      </g>

      <g data-part="blade">
        <path
          d="M 336 93 L 300 88 L 298 83 L 54 77 C 30 77 18 92 20 107 C 22 121 35 129 56 128 L 250 118 C 272 117 288 113 298 109 L 336 107 Z"
          fill={`url(#${steel})`}
        />
        {/* Linea di affilatura e dorso. */}
        <path d="M 58 124 C 140 120 220 115 292 106" stroke="#FFFFFF" strokeOpacity="0.75" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <path d="M 56 81 L 292 87" stroke="#5E594F" strokeOpacity="0.5" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M 60 104 C 140 103 220 101 292 99" stroke="#FFFFFF" strokeOpacity="0.28" strokeWidth="6" fill="none" strokeLinecap="round" />
      </g>

      <g data-part="pivot">
        <circle cx="300" cy="100" r="8.5" fill={`url(#${brass})`} />
        <circle cx="300" cy="100" r="3" fill="#7A5F3A" />
      </g>
    </svg>
  );
}
