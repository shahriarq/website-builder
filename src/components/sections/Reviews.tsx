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
    <div className="flex flex-col py-8 sm:px-10 sm:py-2 sm:first:pl-0" data-reveal style={{ "--reveal-delay": delay } as React.CSSProperties}>
      <h3 className="text-sm font-semibold text-olive-deep">Su {source.label}</h3>
      {hasRating ? (
        <p className="mt-4 flex items-baseline gap-2">
          <span className="display text-[clamp(4rem,9vw,6rem)] leading-[0.9] text-obsidian">{formatRating(source.rating!)}</span>
          <span className="text-lg text-charcoal">su 5</span>
        </p>
      ) : null}
      <p className={`max-w-[22rem] leading-relaxed text-charcoal ${hasRating ? "mt-3" : "mt-4 text-[1.0625rem]"}`}>
        {hasRating && source.count !== null
          ? `Valutazione media da ${source.count} recensioni su ${source.label}.`
          : `Le opinioni dei clienti che hanno prenotato tramite ${source.label}, pubblicate sulla piattaforma.`}
      </p>
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex min-h-11 items-center gap-1.5 self-start text-[0.9375rem] font-semibold text-obsidian"
      >
        <span className="link-underline">Leggi tutte le recensioni</span>
        <ArrowUpRightIcon size={16} aria-hidden="true" />
        <span className="sr-only"> su {source.label} (si apre in una nuova scheda)</span>
      </a>
    </div>
  );
}

export function Reviews() {
  const { google, treatwell, quotes } = site.reviews;

  return (
    <section id="recensioni" aria-labelledby="recensioni-title" className="surface-light border-t border-obsidian/10 bg-ivory">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-5 py-24 sm:px-8 md:py-32 lg:grid-cols-12 lg:gap-8 lg:px-12">
        <div className="lg:col-span-4">
          <h2 id="recensioni-title" className="display text-[clamp(2.5rem,6vw,4.25rem)]" data-reveal>
            Dicono di noi
          </h2>
          <p className="mt-6 max-w-[26rem] text-[1.0625rem] leading-relaxed text-charcoal" data-reveal>
            Le recensioni dei clienti sono pubblicate su Google e su Treatwell. Le trovi qui separate, così come compaiono
            su ciascuna piattaforma.
          </p>
        </div>

        <div className="grid divide-y divide-obsidian/15 border-y border-obsidian/15 sm:grid-cols-2 sm:divide-x sm:divide-y-0 sm:border-y-0 lg:col-span-7 lg:col-start-6 lg:self-end">
          <SourceBlock source={google} delay={0} />
          <SourceBlock source={treatwell} delay={120} />
        </div>

        {quotes.length > 0 && (
          <ul className="grid gap-10 border-t border-obsidian/15 pt-12 md:grid-cols-3 md:gap-8 lg:col-span-12">
            {quotes.slice(0, 3).map((q, i) => (
              <li key={`${q.source}-${i}`} data-reveal style={{ "--reveal-delay": i * 100 } as React.CSSProperties}>
                <figure>
                  <blockquote className="display text-[1.625rem] leading-snug text-obsidian">“{q.text}”</blockquote>
                  <figcaption className="mt-4 text-sm text-olive-deep">
                    {q.author ? `${q.author}, ` : ""}
                    <a href={q.url} target="_blank" rel="noopener noreferrer" className="link-underline">
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
