import { ImageResponse } from "next/og"
import { tileDataUri } from "@/components/brand-art"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

/** Full bleed: iOS rounds the corners itself. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex" }}>
        <img src={tileDataUri(180, { radius: 0, scale: 0.66 })} width={180} height={180} alt="" />
      </div>
    ),
    size
  )
}
