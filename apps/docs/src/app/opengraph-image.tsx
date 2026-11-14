import { renderCard } from "@/lib/og/card"
import { ogCard, ogSize, tagline } from "@/lib/og/routes"

export const alt = `Macbetter — ${tagline}`
export const size = ogSize
export const contentType = "image/png"

export default function OpenGraphImage() {
  return renderCard("", ogCard("")!)
}
