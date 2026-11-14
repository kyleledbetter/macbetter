import type { Metadata } from "next"
import { ExamplesGallery } from "@/components/examples/gallery"

export const metadata: Metadata = {
  title: "Examples",
  description: "Full app screens built with Stardust: Settings, Mail, an analytics dashboard and Music, on macOS, iPadOS and iOS.",
}

export default function Page() {
  return <ExamplesGallery />
}
