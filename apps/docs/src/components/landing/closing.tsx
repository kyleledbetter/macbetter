import { ButtonLink } from "@/components/button-link"
import { CopyAgentInstructions } from "@/components/copy-agent-instructions"
import { MacbetterMark } from "@/components/logo"

function Closing() {
  return (
    <section className="lp-section lp-cta" data-surface="alt" aria-labelledby="lp-cta">
      <div className="lp-section-inner">
        <div className="lp-cta-inner stack lp-reveal" data-align="center">
          <MacbetterMark size={64} tone="ember" className="lp-cta-mark" />
          <h2 id="lp-cta" className="stack-eyebrow type-eyebrow-reduced">
            Get started
          </h2>
          <p className="stack-headline type-headline-elevated">
            Extremely easy to&nbsp;implement
          </p>
          <p className="stack-copy type-intro type-two-tone">
            Install the package, import a button, and add the rest as you need them.{" "}
            <strong>Every component has a page with live examples for all three&nbsp;platforms.</strong>
          </p>
          <div className="lp-hero-actions" data-platform="macos">
            <CopyAgentInstructions variant="filled" shape="capsule" className="pill" data-pill="elevated" />
            <ButtonLink
              href="/docs/introduction"
              variant="plain"
              shape="capsule"
              className="pill"
              data-pill="elevated"
              data-pill-style="outline"
            >
              Read the docs
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  )
}

export { Closing }
