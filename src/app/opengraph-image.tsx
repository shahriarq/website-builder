import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/config/site";

export const alt = `${site.name}, Milano`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Immagine di anteprima per i social, generata al momento della build. */
export default async function OpenGraphImage() {
  const cormorant = await readFile(join(process.cwd(), "src/assets/fonts/CormorantGaramond-Medium.ttf"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #171715 0%, #292824 100%)",
          padding: "64px 72px",
          color: "#E9E2D7",
          fontFamily: "Cormorant",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 6, color: "#C8A77B" }}>
          MILANO · PARRUCCHIERI &amp; ESTETICA
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 76, lineHeight: 1.05 }}>Il tuo stile. La tua firma.</div>
          <div style={{ display: "flex", marginTop: 18, fontSize: 30, color: "#A9A397" }}>{site.address.full}</div>
        </div>
        <div style={{ display: "flex", fontSize: 168, lineHeight: 0.8, letterSpacing: 4 }}>
          STYLE<span style={{ color: "#C8A77B" }}>86</span>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Cormorant", data: cormorant, weight: 500, style: "normal" }] },
  );
}
