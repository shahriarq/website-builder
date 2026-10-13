import { ViewTransition } from "react";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBookingBar } from "@/components/layout/MobileBookingBar";
import { BackToTop } from "@/components/layout/BackToTop";
import { Marquee } from "@/components/motion/Marquee";
import { ScrollEffects } from "@/components/motion/ScrollEffects";
import { Hero } from "@/components/sections/Hero";
import { Philosophy } from "@/components/sections/Philosophy";
import { Services } from "@/components/sections/Services";
import { Gallery } from "@/components/sections/Gallery";
import { Team } from "@/components/sections/Team";
import { Reviews } from "@/components/sections/Reviews";
import { Visit } from "@/components/sections/Visit";

/**
 * Style86, "Bottega": una bottega italiana raccontata come un film.
 *   Hero  ·  nastro  ·  Filosofia (avorio)  ·  Servizi  ·  Galleria
 *   Team  ·  Recensioni  ·  Visita e prenota  ·  chiusura
 * Prenotare non dipende mai da un'animazione: modulo e contatti sono sempre
 * nel markup, e con movimento ridotto tutto e' statico.
 */
export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <ViewTransition enter="page" exit="page" default="none">
      <Header lang={lang} />
      <main id="contenuto" tabIndex={-1} className="outline-none">
        <Hero lang={lang} />
        <Marquee lang={lang} className="border-y border-line py-8 md:py-12" />
        <Philosophy lang={lang} />
        <Services lang={lang} />
        <Gallery lang={lang} />
        <Team lang={lang} />
        <Reviews lang={lang} />
        <Visit lang={lang} />
      </main>
      <Footer lang={lang} />
      <MobileBookingBar lang={lang} />
      <BackToTop lang={lang} />
      <ScrollEffects />
    </ViewTransition>
  );
}
