import { site } from "@/config/site";

/** Marchio tipografico in Bodoni: "Style" in tondo, "86" in corsivo bronzo. */
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
