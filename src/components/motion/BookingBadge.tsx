import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { bookingAnchor } from "@/config/navigation";

/**
 * Invito circolare alla prenotazione: il testo gira lentamente attorno alla
 * freccia e accelera al passaggio. Il testo circolare e' decorativo; il
 * nome accessibile del link e' il testo stesso dell'anello, cosi' coincide con
 * cio' che si legge.
 */
export function BookingBadge({ ring }: { ring: string }) {
  return (
    <a
      href={bookingAnchor}
      className="booking-badge group relative hidden size-44 shrink-0 items-center justify-center md:inline-flex lg:size-52"
      aria-label={ring.replace(/ · $/, "")}
    >
      <svg viewBox="0 0 200 200" className="badge-ring absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <path id="badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text className="fill-ink text-[14px] font-medium tracking-[0.08em]" style={{ fontFamily: "var(--font-sans)" }}>
          <textPath href="#badge-circle" textLength="486" lengthAdjust="spacing">
            {ring}
          </textPath>
        </text>
      </svg>
      <span className="relative inline-flex size-24 items-center justify-center rounded-full bg-ink text-paper transition-[background-color,transform] duration-700 ease-[var(--ease-out-expo)] group-hover:scale-110 group-hover:bg-bronze lg:size-28">
        <ArrowRightIcon
          size={26}
          className="transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-1"
          aria-hidden="true"
        />
      </span>
    </a>
  );
}
