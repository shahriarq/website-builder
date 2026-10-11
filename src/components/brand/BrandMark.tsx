import { site } from "@/config/site";

/** Marchio tipografico: "STYLE" e la tessera rossa "86". */
export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <span className={`brand-mark ${className}`} aria-label={site.shortName} role="img">
      <span aria-hidden="true">STYLE</span>
      <span aria-hidden="true" className="brand-num">
        86
      </span>
    </span>
  );
}
