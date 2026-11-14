import { Button } from "@dreambase/stardust/button"
import Link from "next/link"
import { HeroScene } from "./hero-scene"

function Hero() {
  return (
    <section className="lp-hero" aria-labelledby="lp-hero-title">
      <div className="lp-hero-copy">
        <h1 id="lp-hero-title" className="lp-hero-title lp-enter" style={{ "--i": 0 } as React.CSSProperties}>
          macOS, iPadOS and iOS.
          {" "}<span className="lp-muted">One web framework.</span>
        </h1>
        <p className="lp-hero-lead lp-enter" style={{ "--i": 1 } as React.CSSProperties}>
          Stardust is a set of Apple-grade components for React. Theme it to any brand, ship it to every screen, and
          let ui-sdk handle the keyboard, focus and accessibility.
        </p>
        <div className="lp-hero-actions lp-enter" style={{ "--i": 2 } as React.CSSProperties} data-platform="macos">
          <Button variant="filled" size="lg" render={<Link href="/docs/introduction" />}>
            Get started
          </Button>
          <Button variant="bezeled" tone="neutral" size="lg" render={<Link href="/docs/components/button" />}>
            Browse components
          </Button>
        </div>
      </div>
      <div className="lp-enter lp-enter-scene" style={{ "--i": 3 } as React.CSSProperties}>
        <HeroScene />
      </div>
    </section>
  )
}

export { Hero }
