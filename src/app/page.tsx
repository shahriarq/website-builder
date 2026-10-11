import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBookingBar } from "@/components/layout/MobileBookingBar";
import { HeroScene } from "@/components/scenes/HeroScene";
import { CraftScene } from "@/components/scenes/CraftScene";
import { TransformationScene } from "@/components/scenes/TransformationScene";
import { SignatureScene } from "@/components/scenes/SignatureScene";
import { ScrollRefresh } from "@/components/scenes/ScrollRefresh";
import { Services } from "@/components/sections/Services";
import { Experience } from "@/components/sections/Experience";
import { Gallery } from "@/components/sections/Gallery";
import { Reviews } from "@/components/sections/Reviews";
import { Booking } from "@/components/sections/Booking";
import { Contact } from "@/components/sections/Contact";

/**
 * "STYLE86. L'arte del taglio."
 * Racconto a scene legato allo scorrimento:
 *   1 Apertura (forbici)  2 Il mestiere (pettine) + servizi
 *   3 La trasformazione (ritratto)  4 La firma (rasoio) + prenotazione
 *   5 Galleria, recensioni, il salone, contatti
 */
export default function HomePage() {
  return (
    <>
      <Header />
      <main id="contenuto" tabIndex={-1} className="outline-none">
        <HeroScene />
        <CraftScene />
        <Services />
        <TransformationScene />
        <SignatureScene />
        <Booking />
        <Gallery />
        <Reviews />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <MobileBookingBar />
      <ScrollRefresh />
    </>
  );
}
