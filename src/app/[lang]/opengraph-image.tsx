import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/config/site";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export const alt = `${site.shortName}, barbiere a Milano · barber in Milan`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Anteprima per i social, generata alla build con i colori del sito.
 * Carattere: Inter (il generatore non puo' usare SF Pro di sistema).
 */
export default async function OpenGraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = getDictionary(isLocale(lang) ? lang : "it").meta;
  const fonts = join(process.cwd(), "src/assets/fonts");
  const [regular, semibold] = await Promise.all([
    readFile(join(fonts, "Inter-Regular.woff")),
    readFile(join(fonts, "Inter-SemiBold.woff")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#121110",
          padding: "64px 72px",
          color: "#ece5d8",
          fontFamily: "Inter",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, fontWeight: 600, letterSpacing: -0.5 }}>
          <span>
            Style<span style={{ color: "#c4a27a" }}>86</span>
          </span>
          <span style={{ color: "#c4a27a" }}>{t.ogKicker}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 128, fontWeight: 600, lineHeight: 1.04, letterSpacing: -4 }}>
          <span>{t.ogTitle[0]}</span>
          <span style={{ color: "#a59e91" }}>{t.ogTitle[1]}</span>
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#a59e91", letterSpacing: -0.4 }}>{site.address.full}</div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: regular, weight: 400, style: "normal" },
        { name: "Inter", data: semibold, weight: 600, style: "normal" },
      ],
    },
  );
}
