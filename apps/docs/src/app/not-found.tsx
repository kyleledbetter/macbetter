import type { Metadata } from "next"
import Link from "next/link"
import { MacbetterMark } from "@/components/logo"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = { title: "Page not found" }

const destinations = [
  { href: "/docs/introduction", title: "Introduction", description: "What Macbetter is and how it fits together." },
  { href: "/docs/installation", title: "Installation", description: "Add Macbetter to a React app." },
  { href: "/docs/components/button", title: "Components", description: "Every control, with live examples." },
]

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-5 pt-(--docs-header-height)">
        <div aria-hidden="true" className="docs-grid absolute inset-0 opacity-60" />
        <div className="relative flex w-full max-w-[520px] flex-col items-center py-20 text-center">
          <MacbetterMark size={64} tone="ember" />
          <p className="mt-8 font-mono text-[13px] font-medium tracking-[0.08em] text-accent-text">404</p>
          <h1 className="mt-2 text-[34px] leading-[1.15] font-bold tracking-[-0.03em] text-label text-balance">
            This page drifted off
          </h1>
          <p className="mt-3 text-[16px] leading-[1.55] text-label-secondary text-pretty">
            The address may be mistyped, or the page may have moved. These are good places to pick up again.
          </p>
          <nav aria-label="Suggested pages" className="mt-8 w-full overflow-hidden rounded-[16px] border border-separator bg-bg-secondary text-start">
            {destinations.map((destination) => (
              <Link
                key={destination.href}
                href={destination.href}
                className="flex flex-col gap-0.5 border-b border-separator px-4 py-3 no-underline transition-colors last:border-b-0 hover:bg-fill-quaternary focus-visible:outline-(--mb-focus-ring) focus-visible:outline-[3px] focus-visible:-outline-offset-[3px]"
              >
                <span className="text-[15px] font-semibold text-label">{destination.title}</span>
                <span className="text-[13px] text-label-secondary">{destination.description}</span>
              </Link>
            ))}
          </nav>
          <Link
            href="/"
            className="mb-button mt-8 no-underline"
            data-variant="filled"
            data-tone="accent"
            data-size="lg"
            data-shape="auto"
          >
            Go to the home page
          </Link>
        </div>
      </main>
    </>
  )
}
