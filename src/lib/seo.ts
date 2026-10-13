import { site, type DayKey } from "@/config/site";

const schemaDay: Record<DayKey, string> = {
  lun: "Monday",
  mar: "Tuesday",
  mer: "Wednesday",
  gio: "Thursday",
  ven: "Friday",
  sab: "Saturday",
  dom: "Sunday",
};

/**
 * Dati strutturati HairSalon. Include solo campi verificati: valutazione e
 * orari compaiono solo quando sono confermati in src/config/site.ts.
 */
export function hairSalonJsonLd() {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    name: site.name,
    telephone: site.contact.phoneE164,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressRegion: site.address.province,
      addressCountry: site.address.country,
    },
    hasMap: site.links.directions,
  };

  if (site.url) {
    data.url = site.url;
    data["@id"] = `${site.url}/#salone`;
  }

  const sameAs = [site.links.treatwell, ...site.social.map((s) => s.href)];
  data.sameAs = sameAs;

  if (site.openingHours) {
    data.openingHoursSpecification = site.openingHours.flatMap((entry) =>
      entry.ranges.map(([opens, closes]) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${schemaDay[entry.day]}`,
        opens,
        closes,
      })),
    );
  }

  // Solo il dato Google, solo dopo verifica. Mai sommare piattaforme diverse.
  const google = site.reviews.google;
  if (site.reviews.verified && google.rating !== null && google.count !== null) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: google.rating,
      reviewCount: google.count,
      bestRating: 5,
    };
  }

  return data;
}
