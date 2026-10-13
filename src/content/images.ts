/**
 * REGISTRO IMMAGINI
 * --------------------------------------------------------------------------
 * Ogni immagine del sito passa da qui. Per sostituirne una:
 *   1. sovrascrivi il file in src/assets/images/ (stesso nome, qualsiasi
 *      dimensione) oppure cambia l'import qui sotto;
 *   2. scrivi un testo alternativo (`alt`) che descriva la foto reale;
 *   3. imposta `placeholder: false`;
 *   4. imposta `illustrative: false` SOLO se la foto ritrae davvero il salone
 *      Style86, il suo staff o lavori realizzati nel salone (con consenso).
 *
 * Stato attuale: foto di repertorio con licenza libera (Unsplash, Pexels,
 * Pixabay), mostrate in monocromia calda sul sito (classe .photo). NON ritraggono il
 * salone Style86, il suo staff o i suoi clienti: restano `illustrative: true`
 * e il sito le segnala come immagini illustrative. Crediti e provenienza in
 * src/assets/images/CREDITS.md.
 */

import type { StaticImageData } from "next/image";

import heroTools from "@/assets/images/hero-tools.webp";
import heroShave from "@/assets/images/hero-shave.webp";
import craftTools from "@/assets/images/craft-tools.webp";
import serviceCut from "@/assets/images/service-cut.webp";
import serviceBeard from "@/assets/images/service-beard.webp";
import serviceStyling from "@/assets/images/service-styling.webp";
import serviceFace from "@/assets/images/service-face.webp";
import teamHands from "@/assets/images/team-hands.webp";
import galleryPompadour from "@/assets/images/gallery-pompadour.webp";
import galleryTailored from "@/assets/images/gallery-tailored.webp";
import galleryGoatee from "@/assets/images/gallery-goatee.webp";
import galleryStubble from "@/assets/images/gallery-stubble.webp";
import galleryInterior from "@/assets/images/gallery-interior.webp";
import galleryStreet from "@/assets/images/gallery-street.webp";
import galleryShop from "@/assets/images/gallery-shop.webp";

export interface PhotoCredit {
  author: string;
  /** Piattaforma d'origine e licenza. */
  license: "Unsplash License" | "Pexels License" | "Pixabay Content License";
  /** Pagina originale, quando l'ID della foto e' noto. */
  url?: string;
}

export interface SiteImage {
  src: StaticImageData;
  /** Testo alternativo: descrive cio' che la foto mostra davvero. */
  alt: string;
  /** Soggetto ideale per lo slot quando arriveranno le foto del salone. */
  brief: string;
  /** true = lastra segnaposto generata, non una fotografia. */
  placeholder: boolean;
  /** true = foto di repertorio, NON ritrae il salone Style86 ne' il suo staff. */
  illustrative: boolean;
  /** Punto focale per i ritagli responsive (CSS object-position). */
  position?: string;
  credit?: PhotoCredit;
}

const unsplash = (author: string, id: string): PhotoCredit => ({
  author,
  license: "Unsplash License",
  url: id ? `https://unsplash.com/photos/${id}` : undefined,
});
const pexels = (author: string): PhotoCredit => ({ author, license: "Pexels License" });
const pixabay = (author: string): PhotoCredit => ({ author, license: "Pixabay Content License" });

/** Foto di repertorio: illustrativa, con credito e punto focale. */
function stock(src: StaticImageData, alt: string, brief: string, credit: PhotoCredit, position?: string): SiteImage {
  return { src, alt, brief, placeholder: false, illustrative: true, position, credit };
}

export const images = {
  heroTools: stock(
    heroTools,
    "Ciotola da barba con pennello, rasoi a mano libera e pettini su un panno scuro",
    "Strumenti del salone su un piano di lavoro, luce radente, orizzontale 3:2.",
    pexels("Nikolaos Dimou"),
    "30% 40%",
  ),
  heroShave: stock(
    heroShave,
    "Barbiere che rifinisce la barba di un cliente con il rasoio a mano libera",
    "Rasatura in corso, verticale 2:3, sfondo del salone sfocato.",
    pexels("Thgusstavo Santana"),
    "60% 35%",
  ),
  craftTools: stock(
    craftTools,
    "Rasoio di sicurezza nella sua custodia, pettino e macchinetta d'epoca su un banco di legno",
    "Dettaglio di strumenti su legno, orizzontale 5:4.",
    pexels("Gonzalo Guzman"),
    "55% 50%",
  ),
  serviceCut: stock(
    serviceCut,
    "Barbiere che rifinisce un taglio sfumato con le dita e le forbici",
    "Taglio in corso, verticale 2:3.",
    pexels("Thgusstavo Santana"),
    "50% 30%",
  ),
  serviceBeard: stock(
    serviceBeard,
    "Barbiere che regola la barba di un cliente disteso in poltrona",
    "Cura della barba in poltrona, verticale 3:4.",
    pexels("Thgusstavo Santana"),
    "45% 45%",
  ),
  serviceStyling: stock(
    serviceStyling,
    "Barbiere che fissa con la lacca un taglio pettinato all'indietro",
    "Finitura dello styling, verticale 2:3.",
    pexels("Thgusstavo Santana"),
    "55% 30%",
  ),
  serviceFace: stock(
    serviceFace,
    "Dettaglio ravvicinato di una barba corta curata e del collo",
    "Dettaglio del viso, verticale 2:3.",
    pexels("Lucas Andrade"),
    "50% 40%",
  ),
  teamHands: stock(
    teamHands,
    "Barbiere che asciuga e modella una barba lunga con spazzola e phon",
    "Il barbiere al lavoro, verticale 2:3.",
    pexels("Alex Urezkov"),
    "50% 30%",
  ),
  galleryPompadour: stock(
    galleryPompadour,
    "Ragazzo con taglio sfumato ai lati e ciuffo pettinato all'indietro, barba corta",
    "Lavoro finito, orizzontale 3:2.",
    unsplash("Nathan Fertig", ""),
    "52% 30%",
  ),
  galleryTailored: stock(
    galleryTailored,
    "Uomo con barba piena e capelli corti laterali, giacca scura e pochette",
    "Ritratto in studio, orizzontale 3:2.",
    pexels("Andrea Piacquadio"),
    "62% 35%",
  ),
  galleryGoatee: stock(
    galleryGoatee,
    "Ritratto in bianco e nero di un uomo con pizzetto grigio e occhiali da sole",
    "Ritratto a contrasto, orizzontale 3:2.",
    pixabay("Autore Pixabay"),
    "55% 40%",
  ),
  galleryStubble: stock(
    galleryStubble,
    "Uomo con barba corta e occhiali da sole, completo grigio",
    "Ritratto, verticale 2:3.",
    pexels("Safa Bakirci"),
    "50% 30%",
  ),
  galleryInterior: stock(
    galleryInterior,
    "Bottega da barbiere d'epoca con due poltrone in legno e cuoio davanti a un mobile a cassetti",
    "Interno del salone, orizzontale 3:2.",
    pixabay("Theo Rivierenlaan"),
    "50% 55%",
  ),
  galleryStreet: stock(
    galleryStreet,
    "Uomo con barba e occhiali in cappotto chiaro, a passeggio in citta'",
    "Ritratto in esterni, orizzontale 3:2.",
    pexels("Andrea Piacquadio"),
    "55% 35%",
  ),
  galleryShop: stock(
    galleryShop,
    "Interno di un salone da barbiere con parete in mattoni, poltrona e piante",
    "Interno, verticale 3:4.",
    pexels("Lisa Fotios"),
    "50% 50%",
  ),
} satisfies Record<string, SiteImage>;

export type ImageKey = keyof typeof images;

/** Testo alternativo effettivo: dichiara il segnaposto finche' non c'e' la foto. */
export function altFor(image: SiteImage): string {
  return image.placeholder ? `Immagine segnaposto. Foto prevista: ${image.alt.toLowerCase()}` : image.alt;
}

/** Stile per il punto focale del ritaglio. */
export function focus(image: SiteImage): React.CSSProperties | undefined {
  return image.position ? { objectPosition: image.position } : undefined;
}

export const galleryImages: ImageKey[] = [
  "galleryTailored",
  "galleryStubble",
  "galleryPompadour",
  "galleryInterior",
  "galleryStreet",
  "galleryGoatee",
];
