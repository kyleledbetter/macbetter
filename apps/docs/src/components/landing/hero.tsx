import { ButtonLink } from "@/components/button-link"
import { CopyAgentInstructions } from "@/components/copy-agent-instructions"
import { HeroScene } from "./hero-scene"

function Hero() {
  return (
    <section id="overview" className="lp-hero" aria-labelledby="lp-hero-title">
      <div className="lp-hero-copy stack" data-align="center">
        <h1
          id="lp-hero-title"
          className="stack-headline lp-hero-headline type-headline-super lp-enter"
          style={{ "--i": 1 } as React.CSSProperties}
        >
          macOS, iPadOS and&nbsp;iOS.
          <br />
          One web framework.
        </h1>
        <p
          className="stack-copy lp-hero-intro type-intro-elevated type-two-tone lp-enter"
          style={{ "--i": 2 } as React.CSSProperties}
        >
          A set of React components that look and behave like Apple’s own controls.{" "}
          <strong>Theme it to any brand, ship it to every screen,</strong> and let ui-sdk handle the keyboard, focus
          and&nbsp;accessibility.
        </p>
        <div className="lp-hero-actions lp-enter" style={{ "--i": 3 } as React.CSSProperties} data-platform="macos">
          <ButtonLink href="/docs/introduction" variant="filled" shape="capsule" className="pill" data-pill="elevated">
            Get started
          </ButtonLink>
          <ButtonLink
            href="/docs/components"
            variant="plain"
            shape="capsule"
            className="pill"
            data-pill="elevated"
            data-pill-style="outline"
          >
            Browse components
          </ButtonLink>
          <CopyAgentInstructions variant="plain" shape="capsule" className="pill" data-pill="elevated" data-pill-style="outline" />
        </div>
      </div>
      <div className="lp-enter lp-enter-scene" style={{ "--i": 4 } as React.CSSProperties}>
        <HeroScene />
      </div>
    </section>
  )
}

export { Hero }
