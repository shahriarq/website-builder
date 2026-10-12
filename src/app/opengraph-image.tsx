import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/config/site";

export const alt = `${site.shortName}, barbiere a Milano`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Anteprima per i social, generata alla build con gli stessi colori e caratteri del sito. */
export default async function OpenGraphImage() {
  const fonts = join(process.cwd(), "src/assets/fonts");
  const [bodoni, bodoniItalic, archivo] = await Promise.all([
    readFile(join(fonts, "BodoniModa-Regular.woff")),
    readFile(join(fonts, "BodoniModa-Italic.woff")),
    readFile(join(fonts, "Archivo-Regular.ttf")),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#121110",
        padding: "60px 72px",
        color: "#ece5d8",
        fontFamily: "Archivo",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 22,
          letterSpacing: 5,
          color: "#a59e91",
        }}
      >
        <span>BARBIERE</span>
        <span>VIA ORNATO 59, MILANO</span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontFamily: "Bodoni",
          fontSize: 150,
          lineHeight: 0.9,
          letterSpacing: -4,
        }}
      >
        <span>Il rito</span>
        <span style={{ display: "flex", paddingLeft: 140 }}>
          del&nbsp;
          <span style={{ fontFamily: "Bodoni Italic", color: "#c4a27a" }}>taglio.</span>
        </span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          borderTop: "1px solid rgba(236,229,216,0.25)",
          paddingTop: 22,
          fontFamily: "Bodoni",
          fontSize: 44,
        }}
      >
        Style
        <span style={{ fontFamily: "Bodoni Italic", color: "#c4a27a" }}>86</span>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Bodoni", data: bodoni, weight: 400, style: "normal" },
        {
          name: "Bodoni Italic",
          data: bodoniItalic,
          weight: 400,
          style: "normal",
        },
        { name: "Archivo", data: archivo, weight: 400, style: "normal" },
      ],
    },
  );
}
