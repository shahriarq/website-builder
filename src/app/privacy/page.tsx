import type { Metadata } from "next";
import Link from "next/link";
import { site, telHref } from "@/config/site";

export const metadata: Metadata = {
  title: `Informativa privacy | ${site.name}`,
  description: `Come ${site.name} tratta i dati inviati tramite il sito.`,
  robots: { index: true, follow: true },
};

/**
 * Informativa privacy (GDPR, art. 13). DA FAR VERIFICARE AL TITOLARE.
 * Il testo descrive il comportamento reale del sito: se cambi canali di
 * prenotazione, strumenti di analisi o contenuti esterni, aggiorna anche
 * questa pagina.
 */
export default function PrivacyPage() {
  const controller = site.privacy.controllerName ?? site.name;
  const contactEmail = site.privacy.contactEmail ?? site.contact.email;
  const lastUpdated = new Intl.DateTimeFormat("it-IT", { dateStyle: "long" }).format(new Date(site.privacy.lastUpdated));
  const telegram = site.booking.delivery === "telegram";

  return (
    <main id="contenuto" className="surface-light min-h-[100dvh] bg-ivory">
      <div className="mx-auto max-w-[46rem] px-5 py-16 sm:px-8 md:py-24">
        <Link href="/" className="wordmark text-[1.75rem]">
          STYLE<span className="text-brass-deep">86</span>
        </Link>
        <h1 className="display mt-12 text-[clamp(2.5rem,7vw,4rem)]">Informativa privacy</h1>
        <p className="mt-4 text-sm text-olive-deep">Ultimo aggiornamento: {lastUpdated}</p>

        <div className="mt-12 grid gap-10 text-[1.0625rem] leading-relaxed text-charcoal [&_h2]:font-display [&_h2]:font-normal [&_h2]:text-[1.875rem] [&_h2]:leading-tight [&_h2]:text-obsidian [&_a]:text-obsidian [&_a]:underline [&_a]:decoration-1 [&_a]:underline-offset-4 [&_ul]:mt-3 [&_ul]:grid [&_ul]:list-disc [&_ul]:gap-2 [&_ul]:pl-5">
          <section>
            <h2>Titolare del trattamento</h2>
            <p className="mt-3">
              {controller}, {site.address.full}. Telefono <a href={telHref()}>{site.contact.phoneDisplay}</a>
              {contactEmail ? (
                <>
                  , email <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
                </>
              ) : null}
              .
            </p>
          </section>

          <section>
            <h2>Quali dati raccogliamo</h2>
            <p className="mt-3">
              Tramite il modulo di richiesta appuntamento raccogliamo solo i dati necessari a risponderti: servizio
              desiderato, data e fascia oraria preferite, nome e cognome, numero di telefono ed eventuali note che scegli
              di scrivere. Ti chiediamo di non inserire nelle note informazioni sulla salute o altri dati sensibili.
            </p>
          </section>

          <section>
            <h2>Come vengono trasmessi</h2>
            {telegram ? (
              <p className="mt-3">
                Quando invii il modulo, la richiesta passa dal nostro server e viene inoltrata come messaggio alla chat
                Telegram privata del salone. Il sito non salva la richiesta in un proprio archivio. Il messaggio resta
                nella chat Telegram del salone, gestita da Telegram Messenger Inc., fino alla sua cancellazione.
              </p>
            ) : (
              <p className="mt-3">
                Il sito non invia né salva la richiesta. Premendo il pulsante si apre WhatsApp con un messaggio già
                compilato: sei tu a decidere se inviarlo. Una volta inviato, il messaggio è trattato tramite WhatsApp,
                servizio di WhatsApp Ireland Limited, secondo la sua informativa.
              </p>
            )}
          </section>

          <section>
            <h2>Finalità e base giuridica</h2>
            <p className="mt-3">
              Usiamo i dati esclusivamente per rispondere alla tua richiesta e organizzare l&apos;appuntamento. La base
              giuridica è il consenso che esprimi con la casella del modulo (art. 6, par. 1, lett. a del Regolamento UE
              2016/679) e l&apos;esecuzione di misure precontrattuali da te richieste (art. 6, par. 1, lett. b). Non usiamo
              i dati per finalità di marketing e non li cediamo a terzi.
            </p>
          </section>

          <section>
            <h2>Conservazione</h2>
            <p className="mt-3">
              Conserviamo i messaggi solo per il tempo necessario a gestire l&apos;appuntamento e gli eventuali seguiti,
              poi li cancelliamo.
            </p>
          </section>

          <section>
            <h2>Cookie e contenuti esterni</h2>
            <ul>
              <li>Il sito non usa cookie di profilazione né strumenti di analisi delle visite.</li>
              <li>I caratteri tipografici sono ospitati sul nostro server: la visita non contatta Google Fonts.</li>
              <li>
                La mappa di Google Maps si carica solo se lo chiedi. Se scegli di ricordare la preferenza, la salviamo
                nella memoria locale del tuo browser e puoi revocarla da “Preferenze cookie” nel piè di pagina.
              </li>
              <li>I link a Google, WhatsApp e Treatwell aprono servizi esterni con proprie informative.</li>
            </ul>
          </section>

          <section>
            <h2>I tuoi diritti</h2>
            <p className="mt-3">
              Puoi chiedere in ogni momento accesso, rettifica, cancellazione o limitazione dei tuoi dati, opporti al
              trattamento e revocare il consenso, contattando il titolare ai recapiti indicati sopra. Hai anche il
              diritto di proporre reclamo al Garante per la protezione dei dati personali (garanteprivacy.it).
            </p>
          </section>
        </div>

        <Link href="/" className="btn btn-ink mt-16">
          Torna al sito
        </Link>
      </div>
    </main>
  );
}
