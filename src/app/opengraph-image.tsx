import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/config/site";

export const alt = `${site.name}, Milano`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Immagine di anteprima per i social, generata al momento della build. Stessi colori del sito. */
export default async function OpenGraphImage() {
  const fonts = join(process.cwd(), "src/assets/fonts");
  const [expanded, regular] = await Promise.all([
    readFile(join(fonts, "ArchivoExpanded-Bold.ttf")),
    readFile(join(fonts, "Archivo-Regular.ttf")),
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
          background: "#0e0e0d",
          padding: "64px 72px",
          color: "#efede8",
          fontFamily: "Archivo",
        }}
      >
        <div style={{ display: "flex", alignItems: "stretch", fontFamily: "Archivo Expanded", fontSize: 64, lineHeight: 1 }}>
          <span>STYLE</span>
          <span style={{ marginLeft: 12, padding: "8px 12px 6px", background: "#c92a1c", color: "#fafaf8" }}>86</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", borderTop: "2px solid #efede8", paddingTop: 36 }}>
          <div style={{ display: "flex", fontFamily: "Archivo Expanded", fontSize: 84, lineHeight: 1, letterSpacing: -3 }}>
            Il salone di Via Ornato.
          </div>
          <div style={{ display: "flex", marginTop: 26, fontSize: 32, color: "#a3a29b" }}>
            Parrucchieri &amp; Estetica, {site.address.full}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Archivo Expanded", data: expanded, weight: 700, style: "normal" },
        { name: "Archivo", data: regular, weight: 400, style: "normal" },
      ],
    },
  );
}
