import Link from "next/link";

export default function NotFound() {
  return (
    <main id="contenuto" className="surface-dark flex min-h-[100dvh] flex-col items-start justify-center bg-obsidian px-5 sm:px-12">
      <p className="wordmark text-[2rem] text-ivory">
        STYLE<span className="text-brass">86</span>
      </p>
      <h1 className="display mt-10 max-w-[18ch] text-[clamp(2.5rem,7vw,4.5rem)] text-ivory">Questa pagina non esiste.</h1>
      <Link href="/" className="btn btn-brass mt-10">
        Torna alla home
      </Link>
    </main>
  );
}
