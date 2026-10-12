import { ViewTransition } from "react";
import Link from "next/link";
import { BrandMark } from "@/components/brand/BrandMark";

export default function NotFound() {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      <main id="contenuto" className="mx-auto flex min-h-[100dvh] max-w-[1440px] flex-col justify-center px-5 sm:px-8 lg:px-12">
        <Link href="/" transitionTypes={["page"]} className="self-start text-[2rem]" aria-label="Style86, torna alla home">
          <BrandMark />
        </Link>
        <p className="kicker kicker-bronze mt-16">Errore 404</p>
        <h1 className="display display-xl mt-6 max-w-[12ch]">
          Pagina <em>non trovata.</em>
        </h1>
        <p className="lede mt-8 max-w-[30rem]">Il collegamento potrebbe essere vecchio o scritto in modo diverso.</p>
        <Link href="/" transitionTypes={["page"]} className="btn btn-secondary mt-10 self-start">
          Torna alla home
        </Link>
      </main>
    </ViewTransition>
  );
}
