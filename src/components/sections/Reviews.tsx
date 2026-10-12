import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { site, type ReviewSource } from "@/config/site";
import { CountUp } from "@/components/motion/CountUp";

/**
 * Capitolo V, "Dicono di noi". Nessuna testimonianza inventata:
 * - Google e Treatwell restano separati, ciascuno con i propri dati;
 * - le citazioni compaiono solo se inserite in configurazione, copiate alla
 *   lettera da recensioni reali, con il link all'originale.
 */
function formatDate(iso: string) {
  const d = new Date(`${iso}T12:00:00Z`);
  return Number.isNaN(d.getTime())
    ? iso
    : new Intl.DateTimeFormat("it-IT", {
        month: "long",
        year: "numeric",
      }).format(d);
}

function Source({ source, delay }: { source: ReviewSource; delay: number }) {
  const hasRating = source.rating !== null;
  return (
    <div className="rule-top flex flex-col pt-6" data-reveal style={{ "--reveal-delay": delay } as React.CSSProperties}>
      <p className="kicker">Su {source.label}</p>
      {hasRating ? (
        <>
          <p className="mt-6 flex items-end gap-4">
            <CountUp value={source.rating!} className="figure text-[clamp(6rem,16vw,13rem)]" />
            <span className="display display-s pb-[0.35em] whitespace-nowrap text-muted">su 5</span>
          </p>
          <p className="mt-5 max-w-[24rem] text-muted">
            {source.count !== null
              ? `Valutazione media da ${source.count} recensioni su ${source.label}.`
              : `Valutazione media su ${source.label}.`}
          </p>
        </>
      ) : (
        <p className="display display-s mt-6 max-w-[18ch]">
          Le opinioni di chi ha prenotato tramite <em>{source.label}</em>.
        </p>
      )}
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex min-h-11 items-center gap-2 self-start text-[1.0625rem] font-medium"
      >
        <span className="link">Leggi tutte le recensioni</span>
        <ArrowUpRightIcon size={15} aria-hidden="true" />
        <span className="sr-only"> su {source.label} (si apre in una nuova scheda)</span>
      </a>
    </div>
  );
}

export function Reviews() {
  const { google, treatwell, quotes } = site.reviews;

  return (
    <section id="recensioni" aria-labelledby="recensioni-title" className="relative">
      <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 md:py-36 lg:px-12">
        <div className="chapter mb-14 md:mb-20">
          <p className="eyebrow">Dicono di noi</p>
        </div>

        <div className="grid gap-16 md:grid-cols-12 md:gap-6">
          <h2 id="recensioni-title" className="display display-l md:col-span-5" data-split>
            La parola <em>ai clienti.</em>
          </h2>
          <div className="grid gap-14 sm:grid-cols-2 sm:gap-8 md:col-span-7">
            <Source source={google} delay={0} />
            <Source source={treatwell} delay={120} />
          </div>
        </div>

        {quotes.length > 0 && (
          <ul className="mt-24 grid gap-16 md:grid-cols-2 md:gap-x-6">
            {quotes.slice(0, 4).map((q, i) => (
              <li key={`${q.source}-${i}`} className={i % 2 === 1 ? "md:mt-24" : undefined} data-reveal>
                <figure>
                  <blockquote className="display display-s">“{q.text}”</blockquote>
                  <figcaption className="caption mt-5">
                    {q.author ? `${q.author}, ` : ""}
                    <a href={q.url} target="_blank" rel="noopener noreferrer" className="link">
                      recensione su {q.source}
                    </a>
                    {q.date ? `, ${formatDate(q.date)}` : ""}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
