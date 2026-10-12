import { ViewTransition } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBookingBar } from "@/components/layout/MobileBookingBar";
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
 * Style86, "Bottega Bodoni": una rivista maschile raccontata come un film.
 *   Hero  ·  nastro  ·  I Filosofia (avorio)  ·  II Servizi  ·  III Galleria
 *   IV Team  ·  V Recensioni  ·  VI Visita e prenota  ·  chiusura
 * Prenotare non dipende mai da un'animazione: modulo e contatti sono sempre
 * nel markup, e con movimento ridotto tutto e' statico.
 */
export default function HomePage() {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      <Header />
      <main id="contenuto" tabIndex={-1} className="outline-none">
        <Hero />
        <Marquee className="border-y border-line py-8 md:py-12" />
        <Philosophy />
        <Services />
        <Gallery />
        <Team />
        <Reviews />
        <Visit />
      </main>
      <Footer />
      <MobileBookingBar />
      <ScrollEffects />
    </ViewTransition>
  );
}
