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
 * Pixabay), elaborate con una gradazione calda comune. NON ritraggono il
 * salone Style86, il suo staff o i suoi clienti: restano `illustrative: true`
 * e il sito le segnala come immagini illustrative. Crediti e provenienza in
 * src/assets/images/CREDITS.md.
 */

import type { StaticImageData } from "next/image";

import heroPortrait from "@/assets/images/hero-portrait.jpg";
import introDetail from "@/assets/images/intro-detail.jpg";
import serviceCut from "@/assets/images/service-cut.jpg";
import serviceStyling from "@/assets/images/service-styling.jpg";
import serviceBeard from "@/assets/images/service-beard.jpg";
import serviceBeauty from "@/assets/images/service-beauty.jpg";
import experienceInterior from "@/assets/images/experience-interior.jpg";
import experienceTools from "@/assets/images/experience-tools.jpg";
import experienceMirror from "@/assets/images/experience-mirror.jpg";
import gallery1 from "@/assets/images/gallery-1.jpg";
import gallery2 from "@/assets/images/gallery-2.jpg";
import gallery3 from "@/assets/images/gallery-3.jpg";
import gallery4 from "@/assets/images/gallery-4.jpg";
import gallery5 from "@/assets/images/gallery-5.jpg";
import gallery6 from "@/assets/images/gallery-6.jpg";

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
  url: `https://unsplash.com/photos/${id}`,
});
const pexels = (author: string): PhotoCredit => ({ author, license: "Pexels License" });

/** Foto di repertorio: illustrativa, con credito e punto focale. */
function stock(src: StaticImageData, alt: string, brief: string, credit: PhotoCredit, position?: string): SiteImage {
  return { src, alt, brief, placeholder: false, illustrative: true, position, credit };
}

export const images = {
  heroPortrait: stock(
    heroPortrait,
    "Donna con lunghi capelli ricci in movimento, occhi chiusi, in luce naturale",
    "Ritratto verticale 4:5, luce calda laterale, sfondo scuro e pulito.",
    unsplash("Omid Armin", "jvjZuJ9Inc8"),
    "72% 22%",
  ),
  introDetail: stock(
    introDetail,
    "Rasoio a mano libera, pennello da barba e strumenti da barbiere su un panno scuro",
    "Dettaglio verticale 3:4 di strumenti professionali: forbici, pettine, rasoio.",
    pexels("Nikolaos Dimou"),
    "40% 50%",
  ),
  serviceCut: stock(
    serviceCut,
    "Barbiere che rifinisce un taglio sfumato con pettine e forbici",
    "Taglio in corso, inquadratura ravvicinata 4:5.",
    pexels("Thgusstavo Santana"),
    "50% 35%",
  ),
  serviceStyling: stock(
    serviceStyling,
    "Donna con lunghi capelli biondi mossi, acconciati in onde morbide",
    "Piega o styling finito, luce morbida 4:5.",
    unsplash("Averie Woodard", "4nulm-JUYFo"),
    "50% 30%",
  ),
  serviceBeard: stock(
    serviceBeard,
    "Barbiere che rifinisce la barba di un cliente con il rasoio",
    "Rifinitura barba, dettaglio 4:5 su sfondo scuro.",
    pexels("Thgusstavo Santana"),
    "45% 45%",
  ),
  serviceBeauty: stock(
    serviceBeauty,
    "Ritratto sorridente con lentiggini, rossetto rosso e capelli raccolti",
    "Trattamento estetico, ambiente luminoso 4:5.",
    unsplash("Gabriel Silvério", "u3WmDyKGsrY"),
    "50% 30%",
  ),
  experienceInterior: stock(
    experienceInterior,
    "Interno di una barberia d'epoca con poltrone, specchi e arredi in legno",
    "Interno del salone, orizzontale 16:10, postazioni e specchi.",
    { author: "Theo Rivierenlaan", license: "Pixabay Content License" },
    "50% 55%",
  ),
  experienceTools: stock(
    experienceTools,
    "Tagliacapelli, pettine e accessori da barbiere su un piano in legno",
    "Strumenti e prodotti ordinati, verticale 3:4.",
    pexels("Gonzalo Guzman"),
    "35% 50%",
  ),
  experienceMirror: stock(
    experienceMirror,
    "Postazione con specchio, piante e luce naturale in un salone con mattoni a vista",
    "Riflesso nello specchio, quadrato 1:1.",
    pexels("Lisa Fotios"),
    "50% 45%",
  ),
  gallery1: stock(
    gallery1,
    "Donna sorridente con lunghe trecce box braids",
    "Lavoro finito, verticale 4:5.",
    unsplash("Gustavo Spindula", "K2D7muBun1A"),
    "50% 18%",
  ),
  gallery2: stock(
    gallery2,
    "Barbiere che fissa con la lacca un taglio corto pettinato all'indietro",
    "Gesto tecnico, orizzontale 3:2.",
    pexels("Thgusstavo Santana"),
    "60% 30%",
  ),
  gallery3: stock(
    gallery3,
    "Ragazza sorridente con frangia piena e capelli raccolti",
    "Lavoro finito, quadrato 1:1.",
    unsplash("Salha Frija", "dsQoLK2N7DQ2"),
    "40% 30%",
  ),
  gallery4: stock(
    gallery4,
    "Barbiere che asciuga e modella una barba lunga con spazzola e phon",
    "Gesto tecnico, verticale 3:4.",
    pexels("Alex Urezkov"),
    "50% 30%",
  ),
  gallery5: stock(
    gallery5,
    "Ritratto di una ragazza con capelli afro voluminosi",
    "Lavoro finito, verticale 4:5.",
    unsplash("Jessica Felicio", "_cvwXhGqG-o"),
    "50% 35%",
  ),
  gallery6: stock(
    gallery6,
    "Lunghi capelli rosa in movimento, donna di profilo",
    "Capelli in movimento, orizzontale 3:2.",
    unsplash("George Bohunicky", "qJKT2rMU0VU"),
    "60% 40%",
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

export const galleryImages: ImageKey[] = ["gallery1", "gallery2", "gallery3", "gallery4", "gallery5", "gallery6"];
