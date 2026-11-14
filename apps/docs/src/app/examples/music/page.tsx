import type { Metadata } from "next"
import { MusicExample } from "@/components/examples/music/music"

export const metadata: Metadata = {
  title: "Music example",
  description: "A music app with a library, a glass mini player and a full-screen Now Playing sheet, built with Stardust.",
}

export default function Page() {
  return <MusicExample />
}
