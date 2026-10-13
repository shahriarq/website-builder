import { site } from "@/config/site";

/** Marchio tipografico: "Style" in semibold, "86" nel secondo tono bronzo. */
export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <span className={`brand-mark ${className}`} aria-label={site.shortName} role="img">
      <span aria-hidden="true">Style</span>
      <span aria-hidden="true" className="brand-num">
        86
      </span>
    </span>
  );
}
