import { Glass, Material } from "macbetter/glass"
import { MoreLink } from "@/components/more-link"
import { SectionHeading } from "./section-heading"
import { SpringDemo } from "./spring-demo"
import { Wallpaper } from "./wallpaper"

const thicknesses = ["ultrathin", "thin", "regular", "thick"] as const

function Materials() {
  return (
    <section id="materials" className="lp-section" aria-labelledby="lp-materials">
      <div className="lp-section-inner">
      <SectionHeading
        id="lp-materials"
        eyebrow="Materials and motion"
        headline={<>Glass materials and motion straight from Swift UI, built for the&nbsp;web.</>}
        links={
          <>
            <MoreLink href="/docs/foundations/materials">Learn more about materials</MoreLink>
            <MoreLink href="/docs/foundations/motion">Learn more about motion</MoreLink>
          </>
        }
      >
        Bars, sidebars and menus are translucent and blur what’s behind them, and turn solid when someone asks for
        less transparency. <strong>Movement runs on spring curves,</strong> shipped as CSS&nbsp;tokens.
      </SectionHeading>
      <div className="lp-motion lp-reveal">
        <figure className="lp-motion-card lp-materials" data-platform="macos">
          <Wallpaper id="materials" />
          <div className="lp-materials-panes">
            {thicknesses.map((thickness, index) => (
              <Material
                key={thickness}
                material={thickness}
                className="lp-materials-pane"
                style={{ "--n": index } as React.CSSProperties}
              >
                <span>{thickness === "ultrathin" ? "Ultra thin" : thickness[0].toUpperCase() + thickness.slice(1)}</span>
              </Material>
            ))}
          </div>
          <Glass shape="capsule" className="lp-materials-glass">
            Liquid Glass
          </Glass>
          <figcaption className="lp-motion-caption type-body-tight type-lead-in">
            <strong>Materials.</strong> Ultra thin to thick for surfaces, Liquid Glass for floating&nbsp;controls.
          </figcaption>
        </figure>
        <figure className="lp-motion-card" data-platform="macos">
          <SpringDemo />
          <figcaption className="lp-motion-caption type-body-tight type-lead-in">
            <strong>Springs.</strong> Pick one, then tap the track. The curve is read from the&nbsp;token.
          </figcaption>
        </figure>
      </div>
      </div>
    </section>
  )
}

export { Materials }
