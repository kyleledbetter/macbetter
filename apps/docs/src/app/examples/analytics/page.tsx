import type { Metadata } from "next"
import { AnalyticsExample } from "@/components/examples/analytics/analytics"

export const metadata: Metadata = {
  title: "Analytics example",
  description: "A Dreambase dashboard for Supabase data on the Mac and iPhone, with hand-drawn charts, built with Stardust.",
}

export default function Page() {
  return <AnalyticsExample />
}
