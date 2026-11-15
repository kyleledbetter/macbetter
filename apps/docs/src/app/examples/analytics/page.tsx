import type { Metadata } from "next"
import { ExampleSource } from "@/components/examples/example-source"
import { socialMetadata } from "@/lib/og/routes"
import { AnalyticsExample } from "@/components/examples/analytics/analytics"

const description =
  "Four dashboards on the Mac and iPhone, one per family of macbetter charts: Stocks, Health, Fitness and a general business report, drawn with ECharts."

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
