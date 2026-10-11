import { useId } from "react";

/**
 * Forbici da barbiere in SVG, con parti animabili separatamente.
 * - [data-part="half-a"]: lama superiore + anello inferiore (con appoggio dito)
 * - [data-part="half-b"]: lama inferiore + anello superiore
 * Ogni meta' ruota attorno al perno (300, 160): aprendo le lame si aprono
 * anche gli anelli, come nelle forbici reali.
 */
export const SCISSORS_PIVOT = "300 160";

export function Scissors({ className = "" }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const steel = `steel-${uid}`;
  const steelDark = `steel-dark-${uid}`;
  const brass = `brass-${uid}`;

  const half = (tang: boolean) => (
    <>
      {/* Lama: filo dritto sull'asse, dorso curvo. */}
      <path
        d="M 288 160 L 612 160 Q 619 159.5 615 156 C 548 146 420 139 302 140.5 C 292 141.5 286.5 149 288 160 Z"
        fill={`url(#${steel})`}
      />
      <path d="M 318 156.5 L 596 158.6" stroke="#F4EFE7" strokeOpacity="0.55" strokeWidth="1.4" strokeLinecap="round" />
      {/* Gambo e anello. */}
      <path d="M 300 163 C 254 172 208 188 168 202" stroke={`url(#${steelDark})`} strokeWidth="15" strokeLinecap="round" fill="none" />
      <ellipse cx="118" cy="212" rx="45" ry="30" transform="rotate(-9 118 212)" fill="none" stroke={`url(#${steelDark})`} strokeWidth="12.5" />
      <ellipse cx="118" cy="212" rx="45" ry="30" transform="rotate(-9 118 212)" fill="none" stroke="#F4EFE7" strokeOpacity="0.25" strokeWidth="1.2" />
      {tang && (
        <path d="M 86 238 C 62 258 52 282 70 296" stroke={`url(#${steelDark})`} strokeWidth="9" strokeLinecap="round" fill="none" />
      )}
    </>
  );

  return (
    <svg viewBox="0 0 640 320" className={className} aria-hidden="true" focusable="false" overflow="visible">
      <defs>
        <linearGradient id={steel} x1="0" y1="138" x2="0" y2="162" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F3EEE6" />
          <stop offset="0.42" stopColor="#C9C2B6" />
          <stop offset="0.58" stopColor="#7B766C" />
          <stop offset="1" stopColor="#D9D2C5" />
        </linearGradient>
        <linearGradient id={steelDark} x1="60" y1="170" x2="300" y2="250" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#D6CFC2" />
          <stop offset="0.5" stopColor="#8E887D" />
          <stop offset="1" stopColor="#CFC8BB" />
        </linearGradient>
        <radialGradient id={brass} cx="0.38" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#F0DDBE" />
          <stop offset="0.55" stopColor="#C8A77B" />
          <stop offset="1" stopColor="#7A5F3A" />
        </radialGradient>
      </defs>

      <g data-part="half-b">
        <g transform="matrix(1 0 0 -1 0 320)">{half(false)}</g>
      </g>
      <g data-part="half-a">{half(true)}</g>

      <g data-part="screw">
        <circle cx="300" cy="160" r="12" fill={`url(#${brass})`} />
        <circle cx="300" cy="160" r="12" fill="none" stroke="#3A2E1E" strokeOpacity="0.5" strokeWidth="1" />
        <path d="M 293 156 L 307 164" stroke="#5B4528" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}
