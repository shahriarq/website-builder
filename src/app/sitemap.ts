import type { MetadataRoute } from "next";
import { site } from "@/config/site";

/** La sitemap richiede URL assoluti: viene popolata quando NEXT_PUBLIC_SITE_URL e' impostato. */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.url) return [];
  return [
    { url: `${site.url}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
