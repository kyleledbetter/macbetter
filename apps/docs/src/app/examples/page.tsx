import type { Metadata } from "next"
import { ExamplesGallery } from "@/components/examples/gallery"
import { socialMetadata } from "@/lib/og/routes"

const description =
  "Full app screens built with Macbetter: Settings, Mail, an analytics dashboard and Music, on macOS, iPadOS and iOS."

export const metadata: Metadata = {
  title: "Examples",
  description,
  alternates: { canonical: "/examples" },
  ...socialMetadata({ path: "examples", title: "Examples", description }),
}

export default function Page() {
  return <ExamplesGallery />
}
