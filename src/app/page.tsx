import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBookingBar } from "@/components/layout/MobileBookingBar";
import { Hero } from "@/components/sections/Hero";
import { Facts } from "@/components/sections/Facts";
import { Services } from "@/components/sections/Services";
import { Gallery } from "@/components/sections/Gallery";
import { Reviews } from "@/components/sections/Reviews";
import { Booking } from "@/components/sections/Booking";
import { Contact } from "@/components/sections/Contact";

/**
 * Pagina unica, ordinata sul percorso del cliente:
 * chi e dove (hero + informazioni), cosa (servizi, ispirazioni),
 * fiducia (recensioni), azione (prenotazione), come arrivare (contatti).
 */
export default function HomePage() {
  return (
    <>
      <Header />
      <main id="contenuto" tabIndex={-1} className="outline-none">
        <Hero />
        <Facts />
        <Services />
        <Gallery />
        <Reviews />
        <Booking />
        <Contact />
      </main>
      <Footer />
      <MobileBookingBar />
    </>
  );
}
