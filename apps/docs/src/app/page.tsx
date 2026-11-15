import type { Metadata } from "next"
import { LocalNav } from "@/components/local-nav"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Bento } from "@/components/landing/bento"
import { Closing } from "@/components/landing/closing"
import { Foundation } from "@/components/landing/foundation"
import { Hero } from "@/components/landing/hero"
import { Highlights } from "@/components/landing/highlights"
import { Materials } from "@/components/landing/materials"
import { Reveal } from "@/components/landing/reveal"
import { Platforms } from "@/components/landing/platforms"
import { Themes } from "@/components/landing/themes"
import "@/components/landing/landing.css"
import { componentPageCount } from "@/lib/counts"
import { socialMetadata, tagline } from "@/lib/og/routes"

export const metadata: Metadata = {
  title: { absolute: `macbetter — ${tagline}` },
  description:
    "macbetter is a design system: Apple-grade React components for macOS, iPadOS and iOS, themeable to any brand and built on ui-sdk.",
  alternates: { canonical: "/" },
  ...socialMetadata({ path: "", description: "Apple-grade components for React, themeable to any brand, built on ui-sdk." }),
}

const sections = [
  { id: "overview", label: "Overview" },
  { id: "platforms", label: "Platforms" },
  { id: "themes", label: "Themes" },
  { id: "components", label: "Components" },
  { id: "materials", label: "Materials" },
]

export default function Home() {
  return (
    <>
      <SiteHeader scrolls />
      <main className="lp">
        <LocalNav sections={sections} cta={{ href: "/docs/installation", label: "Get started" }} />
        <Hero />
        <Highlights />
        <Platforms />
        <Themes />
        <Bento />
        <Materials />
        <Foundation />
        <Closing />
        <Reveal />
      </main>
      <SiteFooter path={["Overview"]}>
        <ol className="lp-footnotes">
          <li id="footnote-1">
            1. Counts the component modules in the <code>macbetter</code> package. {componentPageCount()} of them have
            their own page in these docs so far.
          </li>
          <li>
            macbetter is an independent open-source project. Apple, macOS, iPadOS, iOS, Liquid Glass and SF Pro are
            trademarks of Apple Inc. Components draw on the system font; no Apple fonts or artwork are bundled.
          </li>
        </ol>
      </SiteFooter>
    </>
  )
}
