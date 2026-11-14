import type { Metadata } from "next"
import { ExampleSource } from "@/components/examples/example-source"
import { socialMetadata } from "@/lib/og/routes"
import { MailExample } from "@/components/examples/mail/mail"

const description =
  "A three-column mail client on the Mac and iPad, and the push-navigation Mail app on iPhone, built with Macbetter."

export const metadata: Metadata = {
  title: "Mail example",
  description,
  alternates: { canonical: "/examples/mail" },
  ...socialMetadata({ path: "examples/mail", title: "Mail example", description }),
}

export default function Page() {
  return (
    <ExampleSource slug="mail">
      <MailExample />
    </ExampleSource>
  )
}
