import type { Metadata } from "next"
import { ExampleSource } from "@/components/examples/example-source"
import { MailExample } from "@/components/examples/mail/mail"

export const metadata: Metadata = {
  title: "Mail example",
  description: "A three-column mail client on the Mac and iPad, and the push-navigation Mail app on iPhone, built with Stardust.",
}

export default function Page() {
  return (
    <ExampleSource slug="mail">
      <MailExample />
    </ExampleSource>
  )
}
