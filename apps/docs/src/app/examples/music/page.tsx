import type { Metadata } from "next"
import { ExampleSource } from "@/components/examples/example-source"
import { socialMetadata } from "@/lib/og/routes"
import { MusicExample } from "@/components/examples/music/music"

const description =
  "A music app with a library, a glass mini player and a full-screen Now Playing sheet, built with Macbetter."

export const metadata: Metadata = {
  title: "Music example",
  description,
  alternates: { canonical: "/examples/music" },
  ...socialMetadata({ path: "examples/music", title: "Music example", description }),
}

export default function Page() {
  return (
    <ExampleSource slug="music">
      <MusicExample />
    </ExampleSource>
  )
}
