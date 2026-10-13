import { NextResponse, type NextRequest } from "next/server";

/**
 * Lingue negli indirizzi: l'italiano (principale) resta senza prefisso e
 * viene servito internamente da /it; l'inglese vive sotto /en.
 * - "/..."      -> riscrittura interna su "/it/..."
 * - "/it/..."   -> reindirizzamento permanente a "/..." (un solo indirizzo per pagina)
 * - "/en/..."   -> nessun intervento
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/en" || pathname.startsWith("/en/")) return;

  if (pathname === "/it" || pathname.startsWith("/it/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/it${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Esclusi: API, file interni di Next, immagini ottimizzate e file con estensione
  // (icon.svg, robots.txt, sitemap.xml, immagini). Le immagini Open Graph hanno
  // percorsi senza estensione e passano dal proxy come le pagine.
  matcher: ["/((?!api|_next/static|_next/image|.*\\.[a-zA-Z0-9]+$).*)"],
};
