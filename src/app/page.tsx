import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBookingBar } from "@/components/layout/MobileBookingBar";
import { PoleBand } from "@/components/brand/BarberPole";
import { Marquee } from "@/components/motion/Marquee";
import { ToolsScene } from "@/components/scenes/ToolsScene";
import { Hero } from "@/components/sections/Hero";
import { Facts } from "@/components/sections/Facts";
import { Services } from "@/components/sections/Services";
import { Gallery } from "@/components/sections/Gallery";
import { Reviews } from "@/components/sections/Reviews";
import { Booking } from "@/components/sections/Booking";
import { Contact } from "@/components/sections/Contact";

/**
 * Bottega notturna, raccontata con lo scorrimento:
 *   1 Hero con palo da barbiere e prenotazione rapida, informazioni utili
 *   2 Il mestiere: forbici, rasoio e pettine in 3D (scena fissata)
 *   3 Servizi su binario orizzontale (scena fissata da tablet in su)
 *   4 Ispirazioni, recensioni, prenotazione, contatti (scorrimento libero)
 * Prenotare non dipende mai da un'animazione: il modulo scorre normalmente.
 */
export default function HomePage() {
  return (
    <>
      <Header />
      <main id="contenuto" tabIndex={-1} className="outline-none">
        <Hero />
        <PoleBand />
        <Facts />
        <ToolsScene />
        <Marquee />
        <Services />
        <Gallery />
        <Reviews />
        <PoleBand />
        <Booking />
        <Contact />
      </main>
      <Footer />
      <MobileBookingBar />
    </>
  );
}
