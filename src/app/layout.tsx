import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import { site } from "@/config/site";
import { hairSalonJsonLd, seo } from "@/lib/seo";
import { RevealController } from "@/components/motion/RevealController";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import "./globals.css";

// Un solo carattere: Archivo variabile, con l'asse della larghezza (wdth)
// per distinguere titoli espansi e testo corrente.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  ...(site.url ? { metadataBase: new URL(site.url), alternates: { canonical: "/" } } : {}),
  title: seo.title,
  description: seo.description,
  applicationName: site.shortName,
  formatDetection: { telephone: false, address: false, email: false },
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: site.name,
    title: seo.title,
    description: seo.description,
    ...(site.url ? { url: site.url } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0e0e0d",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={archivo.variable}>
      <body>
        <script
          type="application/ld+json"
          // I dati provengono solo dalla configurazione statica del sito.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(hairSalonJsonLd()).replace(/</g, "\\u003c") }}
        />
        <a
          href="#contenuto"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-ink focus:px-4 focus:py-3 focus:text-paper"
        >
          Vai al contenuto
        </a>
        {children}
        <RevealController />
        <SmoothScroll />
      </body>
    </html>
  );
}
