import type { Metadata } from "next"
import { SettingsExample } from "@/components/examples/settings/settings"

export const metadata: Metadata = {
  title: "Settings example",
  description: "System Settings on the Mac and the Settings app on iPhone and iPad, built with Stardust.",
}

export default function Page() {
  return <SettingsExample />
}
