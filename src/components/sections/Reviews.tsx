import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { site, type ReviewSource } from "@/config/site";

/**
 * "Dicono di noi". Nessuna testimonianza inventata:
 * - Google e Treatwell sono mostrati separatamente, ciascuno con i propri dati;
 * - le citazioni compaiono solo se inserite in configurazione da fonti reali;
 * - ogni blocco rimanda alle recensioni originali.
 */

const formatRating = (n: number) => n.toLocaleString("it-IT", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

function formatDate(iso: string) {
  const d = new Date(`${iso}T12:00:00Z`);
  return Number.isNaN(d.getTime()) ? iso : new Intl.DateTimeFormat("it-IT", { month: "long", year: "numeric" }).format(d);
}

function SourceBlock({ source, delay }: { source: ReviewSource; delay: number }) {
  const hasRating = source.rating !== null;
  return (
    <div className="rule-top flex flex-col pt-6 pb-2" data-reveal style={{ "--reveal-delay": delay } as React.CSSProperties}>
      <h3 className="type-label">Su {source.label}</h3>
      {hasRating ? (
        <>
          <p className="mt-5 flex items-baseline gap-3">
            <span className="type-figure text-[clamp(4.5rem,10vw,7.5rem)] text-red">{formatRating(source.rating!)}</span>
            <span className="text-lg font-medium">su 5</span>
          </p>
          <p className="mt-4 max-w-[24rem] text-muted">
            {source.count !== null
              ? `Valutazione media da ${source.count} recensioni su ${source.label}.`
              : `Valutazione media su ${source.label}.`}
          </p>
        </>
      ) : (
        <p className="mt-5 max-w-[22rem] text-[1.25rem] leading-snug font-medium">
          Le opinioni di chi ha prenotato tramite {source.label}, pubblicate sulla piattaforma.
        </p>
      )}
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="link mt-5 inline-flex min-h-11 items-center gap-1.5 self-start text-[0.9375rem] font-semibold"
      >
        Leggi tutte le recensioni
        <ArrowUpRightIcon size={15} aria-hidden="true" />
        <span className="sr-only"> su {source.label} (si apre in una nuova scheda)</span>
      </a>
    </div>
  );
}

export function Reviews() {
  const { google, treatwell, quotes } = site.reviews;

  return (
    <section id="recensioni" aria-labelledby="recensioni-title" className="mx-auto max-w-[1360px] px-5 py-20 sm:px-8 md:py-28 lg:px-10">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <h2 id="recensioni-title" className="type-h2" data-reveal>
            Dicono di noi
          </h2>
          <p className="mt-5 max-w-[26rem] text-muted" data-reveal>
            Google e Treatwell raccolgono recensioni diverse: le trovi qui separate, come compaiono su ciascuna
            piattaforma.
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 sm:gap-10 lg:col-span-8">
          <SourceBlock source={google} delay={0} />
          <SourceBlock source={treatwell} delay={100} />
        </div>

        {quotes.length > 0 && (
          <ul className="grid gap-10 md:grid-cols-3 md:gap-10 lg:col-span-8 lg:col-start-5">
            {quotes.slice(0, 3).map((q, i) => (
              <li key={`${q.source}-${i}`} className="rule-top pt-6" data-reveal style={{ "--reveal-delay": i * 100 } as React.CSSProperties}>
                <figure>
                  <blockquote className="text-[1.1875rem] leading-snug font-medium">“{q.text}”</blockquote>
                  <figcaption className="mt-4 text-[0.875rem] text-muted">
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
