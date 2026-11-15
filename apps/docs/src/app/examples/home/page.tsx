import type { Metadata } from "next"
import { ExampleSource } from "@/components/examples/example-source"
import { HomeExample } from "@/components/examples/home/home"
import { socialMetadata } from "@/lib/og/routes"

const description =
  "A home app for a house whose kitchen has one of everything: accessory tiles, scenes, cameras, control sheets, automations and adding an accessory, built with macbetter."

export const metadata: Metadata = {
  title: "Home example",
  description,
  alternates: { canonical: "/examples/home" },
  ...socialMetadata({ path: "examples/home", title: "Home example", description }),
}

export default function Page() {
  return (
    <ExampleSource slug="home">
      <HomeExample />
    </ExampleSource>
  )
}
