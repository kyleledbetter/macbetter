import { Button } from "macbetter/button"
import Link from "next/link"
import { MacbetterMark } from "@/components/logo"

const links = [
  { href: "/docs/introduction", label: "Docs" },
  { href: "/docs/components/button", label: "Components" },
  { href: "/themes", label: "Themes" },
  { href: "https://github.com/kyleledbetter/macbetter", label: "GitHub", external: true },
]

function Closing() {
  return (
    <>
      <section className="lp-section lp-cta" aria-labelledby="lp-cta">
        <div className="lp-cta-inner lp-reveal">
          <MacbetterMark size={56} tone="ember" className="lp-cta-mark" />
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
              Install Macbetter
            </Button>
            <Button variant="bezeled" tone="neutral" size="lg" render={<Link href="/docs/introduction" />}>
              Read the docs
            </Button>
          </div>
        </div>
      </section>
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <a href="https://github.com/kyleledbetter" className="lp-footer-brand">
            <MacbetterMark size={22} className="lp-footer-mark" />
            <span>
              Macbetter is made by <strong>Kyle Ledbetter</strong>.
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
