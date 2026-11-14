import { ImageResponse } from "next/og"
import { ink, markDataUri } from "@/components/brand-art"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `radial-gradient(circle at 30% 20%, #17372a, ${ink} 70%)`,
        }}
      >
        { }
        <img src={markDataUri(116)} width={116} height={116} alt="" />
      </div>
    ),
    size
  )
}
