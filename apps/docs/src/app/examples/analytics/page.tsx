import type { Metadata } from "next"
import { ExampleSource } from "@/components/examples/example-source"
import { socialMetadata } from "@/lib/og/routes"
import { AnalyticsExample } from "@/components/examples/analytics/analytics"

const description =
  "A Macbetter dashboard for Supabase data on the Mac and iPhone, with Apple-style charts drawn by ECharts, built with Macbetter."

export const metadata: Metadata = {
  title: "Analytics example",
  description,
  alternates: { canonical: "/examples/analytics" },
  ...socialMetadata({ path: "examples/analytics", title: "Analytics example", description }),
}

export default function Page() {
  return (
    <ExampleSource slug="analytics">
      <AnalyticsExample />
    </ExampleSource>
  )
}
