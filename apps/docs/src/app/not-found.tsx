import type { Metadata } from "next"
import { MacbetterMark } from "@/components/logo"
import { MoreLink } from "@/components/more-link"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = { title: "Page not found" }

const destinations = [
  { href: "/docs/introduction", label: "Read the introduction" },
  { href: "/docs/installation", label: "Install macbetter" },
  { href: "/docs/components", label: "Browse components" },
]

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="relative flex min-h-dvh items-center justify-center overflow-hidden pt-(--docs-header-height)">
        <div aria-hidden="true" className="docs-grid absolute inset-0 opacity-40" />
        <div className="stack relative w-(--site-content) py-24" data-align="center">
          <MacbetterMark size={64} tone="ember" />
          <p className="stack-eyebrow type-eyebrow-reduced mt-8">Page not found</p>
          <h1 className="stack-headline type-headline-elevated">
            This page drifted&nbsp;off.
          </h1>
          <p className="stack-copy type-intro type-two-tone">
            The address may be mistyped, or the page may have moved.{" "}
            <strong>These are good places to pick up&nbsp;again.</strong>
          </p>
          <nav aria-label="Suggested pages" className="stack-links type-body">
            {destinations.map((destination) => (
              <MoreLink key={destination.href} href={destination.href}>
                {destination.label}
              </MoreLink>
            ))}
            <MoreLink href="/">Go to the home page</MoreLink>
          </nav>
        </div>
      </main>
    </>
  )
}
