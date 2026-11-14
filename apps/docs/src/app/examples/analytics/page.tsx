import type { Metadata } from "next"
import { ExampleSource } from "@/components/examples/example-source"
import { AnalyticsExample } from "@/components/examples/analytics/analytics"

export const metadata: Metadata = {
  title: "Analytics example",
  description: "A Dreambase dashboard for Supabase data on the Mac and iPhone, with Apple-style charts drawn by ECharts, built with Stardust.",
}

export default function Page() {
  return (
    <ExampleSource slug="analytics">
      <AnalyticsExample />
    </ExampleSource>
  )
}
