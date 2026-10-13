import { site, telHref } from "@/config/site";
import type { Locale } from "./config";

/**
 * Testo dell'informativa privacy (GDPR, art. 13), in italiano e in inglese.
 * DA FAR VERIFICARE AL TITOLARE. Descrive il comportamento reale del sito:
 * se cambi canali di prenotazione, strumenti di analisi o contenuti esterni,
 * aggiorna entrambe le lingue. In caso di differenze prevale l'italiano.
 */
export function PrivacyBody({ lang }: { lang: Locale }) {
  const controller = site.privacy.controllerName ?? site.name;
  const contactEmail = site.privacy.contactEmail ?? site.contact.email;
  const telegram = site.booking.delivery === "telegram";
  const phone = <a href={telHref()}>{site.contact.phoneDisplay}</a>;
  const email = contactEmail ? <a href={`mailto:${contactEmail}`}>{contactEmail}</a> : null;

  if (lang === "en") {
    return (
      <>
        <p className="mt-3 text-muted">This is an English translation; the Italian version prevails in case of discrepancies.</p>
        <section>
          <h2>Data controller</h2>
          <p className="mt-3">
            {controller}, {site.address.full}. Phone {phone}
            {email ? <>, email {email}</> : null}.
          </p>
        </section>
        <section>
          <h2>What data we collect</h2>
          <p className="mt-3">
            Through the appointment request form we only collect what we need to reply to you: the services you want, your preferred
            day and time of day, your name, phone number and any note you choose to write. Please don&apos;t include health information or
            other sensitive data in the note.
          </p>
        </section>
        <section>
          <h2>How it is sent</h2>
          {telegram ? (
            <p className="mt-3">
              When you submit the form, the request passes through our server and is forwarded as a message to the salon&apos;s private
              Telegram chat. The site does not keep the request in its own archive. The message stays in the salon&apos;s Telegram chat,
              operated by Telegram Messenger Inc., until it is deleted.
            </p>
          ) : (
            <p className="mt-3">
              The site neither sends nor stores the request. The button opens WhatsApp with a pre-filled message: you decide whether to
              send it. Once sent, the message is processed through WhatsApp, a service of WhatsApp Ireland Limited, under its own privacy
              policy.
            </p>
          )}
        </section>
        <section>
          <h2>Purpose and legal basis</h2>
          <p className="mt-3">
            We use the data only to reply to your request and arrange the appointment. The legal basis is the consent you give with the
            form checkbox (Art. 6(1)(a) of Regulation (EU) 2016/679) and steps taken at your request before entering into a contract
            (Art. 6(1)(b)). We do not use the data for marketing and do not pass it on to third parties.
          </p>
        </section>
        <section>
          <h2>Retention</h2>
          <p className="mt-3">We keep messages only as long as needed to handle the appointment and any follow-up, then delete them.</p>
        </section>
        <section>
          <h2>Cookies and external content</h2>
          <ul>
            <li>The site uses no profiling cookies or visitor analytics.</li>
            <li>Fonts are served from our own server: your visit does not contact Google Fonts.</li>
            <li>
              The Google Maps map loads only if you ask for it. If you choose to remember that preference, it is stored in your
              browser&apos;s local storage and you can withdraw it from “Cookie preferences” in the footer.
            </li>
            <li>Links to Google, WhatsApp and Treatwell open external services with their own privacy policies.</li>
          </ul>
        </section>
        <section>
          <h2>Your rights</h2>
          <p className="mt-3">
            You can ask at any time for access to, correction, erasure or restriction of your data, object to its processing and withdraw
            your consent, by contacting the controller at the details above. You also have the right to lodge a complaint with the Italian
            Data Protection Authority (garanteprivacy.it).
          </p>
        </section>
      </>
    );
  }

  return (
    <>
      <section>
        <h2>Titolare del trattamento</h2>
        <p className="mt-3">
          {controller}, {site.address.full}. Telefono {phone}
          {email ? <>, email {email}</> : null}.
        </p>
      </section>
      <section>
        <h2>Quali dati raccogliamo</h2>
        <p className="mt-3">
          Tramite il modulo di richiesta appuntamento raccogliamo solo i dati necessari a risponderti: servizi desiderati, giorno e
          fascia oraria preferiti, nome, numero di telefono ed eventuale nota che scegli di scrivere. Ti chiediamo di non inserire nella
          nota informazioni sulla salute o altri dati sensibili.
        </p>
      </section>
      <section>
        <h2>Come vengono trasmessi</h2>
        {telegram ? (
          <p className="mt-3">
            Quando invii il modulo, la richiesta passa dal nostro server e viene inoltrata come messaggio alla chat Telegram privata del
            salone. Il sito non salva la richiesta in un proprio archivio. Il messaggio resta nella chat Telegram del salone, gestita da
            Telegram Messenger Inc., fino alla sua cancellazione.
          </p>
        ) : (
          <p className="mt-3">
            Il sito non invia né salva la richiesta. Premendo il pulsante si apre WhatsApp con un messaggio già compilato: sei tu a
            decidere se inviarlo. Una volta inviato, il messaggio è trattato tramite WhatsApp, servizio di WhatsApp Ireland Limited,
            secondo la sua informativa.
          </p>
        )}
      </section>
      <section>
        <h2>Finalità e base giuridica</h2>
        <p className="mt-3">
          Usiamo i dati esclusivamente per rispondere alla tua richiesta e organizzare l&apos;appuntamento. La base giuridica è il
          consenso che esprimi con la casella del modulo (art. 6, par. 1, lett. a del Regolamento UE 2016/679) e l&apos;esecuzione di misure
          precontrattuali da te richieste (art. 6, par. 1, lett. b). Non usiamo i dati per finalità di marketing e non li cediamo a terzi.
        </p>
      </section>
      <section>
        <h2>Conservazione</h2>
        <p className="mt-3">
          Conserviamo i messaggi solo per il tempo necessario a gestire l&apos;appuntamento e gli eventuali seguiti, poi li cancelliamo.
        </p>
      </section>
      <section>
        <h2>Cookie e contenuti esterni</h2>
        <ul>
          <li>Il sito non usa cookie di profilazione né strumenti di analisi delle visite.</li>
          <li>I caratteri tipografici sono ospitati sul nostro server: la visita non contatta Google Fonts.</li>
          <li>
            La mappa di Google Maps si carica solo se lo chiedi. Se scegli di ricordare la preferenza, la salviamo nella memoria locale del
            tuo browser e puoi revocarla da “Preferenze cookie” nel piè di pagina.
          </li>
          <li>I link a Google, WhatsApp e Treatwell aprono servizi esterni con proprie informative.</li>
        </ul>
      </section>
      <section>
        <h2>I tuoi diritti</h2>
        <p className="mt-3">
          Puoi chiedere in ogni momento accesso, rettifica, cancellazione o limitazione dei tuoi dati, opporti al trattamento e revocare il
          consenso, contattando il titolare ai recapiti indicati sopra. Hai anche il diritto di proporre reclamo al Garante per la
          protezione dei dati personali (garanteprivacy.it).
        </p>
      </section>
    </>
  );
}
