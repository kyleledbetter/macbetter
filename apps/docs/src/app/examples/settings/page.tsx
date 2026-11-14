import type { Metadata } from "next"
import { ExampleSource } from "@/components/examples/example-source"
import { socialMetadata } from "@/lib/og/routes"
import { SettingsExample } from "@/components/examples/settings/settings"

const description =
  "System Settings on the Mac and the Settings app on iPhone and iPad, built with Macbetter."

export const metadata: Metadata = {
  title: "Settings example",
  description,
  alternates: { canonical: "/examples/settings" },
  ...socialMetadata({ path: "examples/settings", title: "Settings example", description }),
}

export default function Page() {
  return (
    <ExampleSource slug="settings">
      <SettingsExample />
    </ExampleSource>
  )
}
