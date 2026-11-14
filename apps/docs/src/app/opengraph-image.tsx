import { ImageResponse } from "next/og"
import { ink, markDataUri } from "@/components/brand-art"

export const alt = "Stardust — macOS, iPadOS and iOS for the web"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: ink,
          backgroundImage:
            "radial-gradient(60% 80% at 12% 0%, rgba(246,127,1,0.32), transparent 70%), radial-gradient(55% 75% at 100% 30%, rgba(82,198,160,0.28), transparent 70%)",
          color: "#f4f7f5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          { }
          <img src={markDataUri(76)} width={76} height={76} alt="" />
          <div style={{ fontSize: 60, fontWeight: 700, letterSpacing: "-0.03em" }}>Stardust</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.035em", maxWidth: 900 }}>
            macOS, iPadOS and iOS for the web
          </div>
          <div style={{ fontSize: 30, color: "rgba(244,247,245,0.68)", letterSpacing: "-0.01em" }}>
            Dreambase’s design system · themeable React components built on ui-sdk
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {["#f67f01", "#0071e3", "#9b7bff", "#f2f2f4"].map((color) => (
            <div key={color} style={{ width: 22, height: 22, borderRadius: 11, background: color }} />
          ))}
        </div>
      </div>
    ),
    size
  )
}
