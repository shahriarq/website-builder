import Link from "next/link";
import { BrandMark } from "@/components/brand/BrandMark";

export default function NotFound() {
  return (
    <main id="contenuto" className="mx-auto flex min-h-[100dvh] max-w-[1360px] flex-col items-start justify-center px-5 sm:px-8 lg:px-10">
      <BrandMark className="text-[1.75rem]" />
      <h1 className="type-display mt-12 max-w-[14ch]">Questa pagina non esiste.</h1>
      <p className="mt-6 max-w-[30rem] text-muted">Il collegamento potrebbe essere vecchio o scritto in modo diverso.</p>
      <Link href="/" className="btn btn-secondary mt-10">
        Torna alla home
      </Link>
    </main>
  );
}
