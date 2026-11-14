import { Button } from "@dreambase/stardust/button"
import Link from "next/link"
import { StardustMark } from "@/components/logo"

const links = [
  { href: "/docs/introduction", label: "Docs" },
  { href: "/docs/components/button", label: "Components" },
  { href: "/themes", label: "Themes" },
  { href: "https://github.com/DreambaseAI/stardust", label: "GitHub", external: true },
]

function Closing() {
  return (
    <>
      <section className="lp-section lp-cta" aria-labelledby="lp-cta">
        <div className="lp-cta-inner lp-reveal">
          <StardustMark size={44} className="lp-cta-mark" />
          <h2 id="lp-cta" className="lp-h2">
            Start with one component.
            {" "}<span className="lp-muted">Keep going.</span>
          </h2>
          <p className="lp-lead">
            Install the package, import a button, and add the rest as you need them. Every component has a page with
            live examples for all three platforms.
          </p>
          <div className="lp-heading-actions" data-platform="macos">
            <Button variant="filled" size="lg" render={<Link href="/docs/installation" />}>
              Install Stardust
            </Button>
            <Button variant="bezeled" tone="neutral" size="lg" render={<Link href="/docs/introduction" />}>
              Read the docs
            </Button>
          </div>
        </div>
      </section>
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <a href="https://dreambase.ai" className="lp-footer-brand">
            {/* biome-ignore lint/performance/noImgElement: a tiny static SVG */}
            <img src="/dreambase-logo-mark.svg" alt="" width={24} height={24} />
            <span>
              Stardust is made by <strong>Dreambase</strong>.
            </span>
          </a>
          <nav aria-label="Footer" className="lp-footer-links">
            {links.map((link) =>
              link.external ? (
                <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              ) : (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              )
            )}
          </nav>
        </div>
      </footer>
    </>
  )
}

export { Closing }
