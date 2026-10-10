/**
 * Genera le immagini SEGNAPOSTO del sito in src/assets/images/.
 *
 * Sono lastre tonali astratte nella palette del brand, non fotografie:
 * servono solo finche' non arrivano le foto reali del salone.
 * Per sostituire un'immagine basta sovrascrivere il file .jpg con lo stesso
 * nome (qualsiasi dimensione) e impostare `placeholder: false` in
 * src/content/images.ts.
 *
 * Uso: npm run images:placeholders            crea solo i file mancanti
 *      npm run images:placeholders -- --force  rigenera tutto (sovrascrive le foto!)
 */
import sharp from "sharp";
import { existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "src/assets/images");
mkdirSync(outDir, { recursive: true });

const C = {
  obsidian: "#171715",
  charcoal: "#292824",
  brass: "#C8A77B",
  ivory: "#E9E2D7",
  olive: "#77796B",
  stone: "#CFC6B7",
};

/** Piccolo generatore pseudo-casuale deterministico. */
function rng(seed) {
  let s = 0;
  for (const ch of seed) s = (s * 31 + ch.charCodeAt(0)) >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

function plate({ name, w, h, tone = "dark", motif = "arch", light = [0.7, 0.25] }) {
  const r = rng(name);
  const dark = tone === "dark";
  const bgA = dark ? C.obsidian : C.ivory;
  const bgB = dark ? C.charcoal : C.stone;
  const glow = dark ? C.brass : "#B89A6E";
  const [lx, ly] = light;
  const archW = w * (0.34 + r() * 0.12);
  const archH = h * (0.58 + r() * 0.12);
  const archX = w * (0.18 + r() * 0.44);
  const archY = h * 0.2 + r() * h * 0.08;
  const radius = archW / 2;
  const streakX = w * (0.1 + r() * 0.8);
  const shelfY = archY + archH + h * 0.04;

  const arch = `
    <g filter="url(#soft)">
      <path d="M ${archX} ${archY + archH} L ${archX} ${archY + radius}
               A ${radius} ${radius} 0 0 1 ${archX + archW} ${archY + radius}
               L ${archX + archW} ${archY + archH} Z"
            fill="url(#mirror)" stroke="${glow}" stroke-opacity="${dark ? 0.55 : 0.45}" stroke-width="${Math.max(2, w / 600)}"/>
    </g>
    <rect x="${w * 0.06}" y="${shelfY}" width="${w * 0.88}" height="${Math.max(2, h / 700)}" fill="${glow}" opacity="${dark ? 0.35 : 0.3}"/>`;

  const column = `
    <g filter="url(#soft)">
      <rect x="${w * 0.58}" y="0" width="${w * 0.22}" height="${h}" fill="url(#mirror)" opacity="0.8"/>
      <rect x="${w * 0.58}" y="0" width="${Math.max(2, w / 700)}" height="${h}" fill="${glow}" opacity="0.4"/>
    </g>`;

  const motifSvg = motif === "arch" ? arch : motif === "column" ? column : "";

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="${r() > 0.5 ? 1 : 0.2}" y2="1">
      <stop offset="0" stop-color="${bgA}"/>
      <stop offset="1" stop-color="${bgB}"/>
    </linearGradient>
    <radialGradient id="bloom" cx="${lx}" cy="${ly}" r="${0.55 + r() * 0.2}">
      <stop offset="0" stop-color="${glow}" stop-opacity="${dark ? 0.5 : 0.38}"/>
      <stop offset="0.55" stop-color="${glow}" stop-opacity="${dark ? 0.12 : 0.1}"/>
      <stop offset="1" stop-color="${glow}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="mirror" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${dark ? "#3A3832" : "#F3EEE6"}" stop-opacity="0.95"/>
      <stop offset="0.6" stop-color="${dark ? "#22211D" : "#DCD3C5"}" stop-opacity="0.9"/>
      <stop offset="1" stop-color="${dark ? C.olive : C.olive}" stop-opacity="${dark ? 0.35 : 0.25}"/>
    </linearGradient>
    <linearGradient id="streak" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${glow}" stop-opacity="0"/>
      <stop offset="0.5" stop-color="${glow}" stop-opacity="${dark ? 0.16 : 0.12}"/>
      <stop offset="1" stop-color="${glow}" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="vignette" cx="0.5" cy="0.5" r="0.75">
      <stop offset="0.6" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="${dark ? 0.45 : 0.12}"/>
    </radialGradient>
    <filter id="soft" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="${Math.max(1.5, w / 900)}"/>
    </filter>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="${Math.floor(r() * 1000)}" stitchTiles="stitch"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 ${dark ? 0.09 : 0.07} 0"/>
    </filter>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" fill="url(#bloom)"/>
  <rect x="${streakX - w * 0.12}" y="0" width="${w * 0.24}" height="${h}" fill="url(#streak)"/>
  ${motifSvg}
  <rect width="${w}" height="${h}" fill="url(#vignette)"/>
  <rect width="${w}" height="${h}" filter="url(#grain)"/>
</svg>`;
}

/** Elenco degli slot immagine: nome file, dimensioni, tono, motivo. */
const plates = [
  { name: "hero-portrait", w: 1600, h: 2000, tone: "dark", motif: "arch", light: [0.72, 0.22] },
  { name: "intro-detail", w: 1200, h: 1600, tone: "dark", motif: "column", light: [0.3, 0.3] },
  { name: "service-cut", w: 1200, h: 1500, tone: "dark", motif: "arch", light: [0.25, 0.2] },
  { name: "service-styling", w: 1200, h: 1500, tone: "light", motif: "arch", light: [0.7, 0.15] },
  { name: "service-beard", w: 1200, h: 1500, tone: "dark", motif: "column", light: [0.6, 0.35] },
  { name: "service-beauty", w: 1200, h: 1500, tone: "light", motif: "column", light: [0.3, 0.25] },
  { name: "experience-interior", w: 1800, h: 1125, tone: "dark", motif: "arch", light: [0.8, 0.3] },
  { name: "experience-tools", w: 1200, h: 1600, tone: "light", motif: "column", light: [0.4, 0.2] },
  { name: "experience-mirror", w: 1200, h: 1200, tone: "dark", motif: "arch", light: [0.5, 0.15] },
  { name: "gallery-1", w: 1200, h: 1500, tone: "dark", motif: "arch", light: [0.35, 0.2] },
  { name: "gallery-2", w: 1500, h: 1000, tone: "light", motif: "column", light: [0.75, 0.3] },
  { name: "gallery-3", w: 1200, h: 1200, tone: "dark", motif: "column", light: [0.2, 0.6] },
  { name: "gallery-4", w: 1200, h: 1600, tone: "light", motif: "arch", light: [0.6, 0.2] },
  { name: "gallery-5", w: 1200, h: 1500, tone: "dark", motif: "arch", light: [0.8, 0.5] },
  { name: "gallery-6", w: 1500, h: 1000, tone: "dark", motif: "column", light: [0.3, 0.25] },
];

for (const p of plates) {
  const file = join(outDir, `${p.name}.jpg`);
  if (existsSync(file) && !process.argv.includes("--force")) {
    console.log(`salto ${p.name}: il file esiste gia' (usa --force per sovrascriverlo)`);
    continue;
  }
  await sharp(Buffer.from(plate(p)))
    .jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(file);
  console.log(`creato ${file}`);
}
