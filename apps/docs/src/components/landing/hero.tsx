import { ButtonLink } from "@/components/button-link"
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
          Macbetter is a set of Apple-grade components for React. Theme it to any brand, ship it to every screen, and
          let ui-sdk handle the keyboard, focus and accessibility.
        </p>
        <div className="lp-hero-actions lp-enter" style={{ "--i": 2 } as React.CSSProperties} data-platform="macos">
          <ButtonLink variant="filled" size="lg" href="/docs/introduction">
            Get started
          </ButtonLink>
          <ButtonLink variant="bezeled" tone="neutral" size="lg" href="/docs/components/button">
            Browse components
          </ButtonLink>
        </div>
      </div>
      <div className="lp-enter lp-enter-scene" style={{ "--i": 3 } as React.CSSProperties}>
        <HeroScene />
      </div>
    </section>
  )
}

export { Hero }
