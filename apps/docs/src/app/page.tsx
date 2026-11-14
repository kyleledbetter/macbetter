import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { Bento } from "@/components/landing/bento"
import { Closing } from "@/components/landing/closing"
import { Foundation } from "@/components/landing/foundation"
import { Hero } from "@/components/landing/hero"
import { Materials } from "@/components/landing/materials"
import { Reveal } from "@/components/landing/reveal"
import { Platforms } from "@/components/landing/platforms"
import { Themes } from "@/components/landing/themes"
import "@/components/landing/landing.css"
import { socialMetadata, tagline } from "@/lib/og/routes"

export const metadata: Metadata = {
  title: { absolute: `Macbetter — ${tagline}` },
  description:
    "Macbetter is a design system: Apple-grade React components for macOS, iPadOS and iOS, themeable to any brand and built on ui-sdk.",
  alternates: { canonical: "/" },
  ...socialMetadata({ path: "", description: "Apple-grade components for React, themeable to any brand, built on ui-sdk." }),
}

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="lp">
        <Hero />
        <Platforms />
        <Themes />
        <Bento />
        <Materials />
        <Foundation />
        <Closing />
        <Reveal />
      </main>
    </>
  )
}
