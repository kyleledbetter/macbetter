import { Glass, Material } from "macbetter/glass"
import { SectionHeading } from "./section-heading"
import { SpringDemo } from "./spring-demo"
import { Wallpaper } from "./wallpaper"

const thicknesses = ["ultrathin", "thin", "regular", "thick"] as const

function Materials() {
  return (
    <section className="lp-section" aria-labelledby="lp-materials">
      <SectionHeading id="lp-materials" title="Glass you can see through." muted="Motion with weight.">
        Bars, sidebars and menus are translucent and blur what’s behind them, and turn solid when someone asks for
        less transparency. Movement runs on spring curves tuned to Apple’s damping and response, shipped as CSS
        tokens.
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
          <figcaption className="lp-motion-caption">
            <strong>Materials.</strong> Ultra thin to thick for surfaces, Liquid Glass for floating controls.
          </figcaption>
        </figure>
        <figure className="lp-motion-card" data-platform="macos">
          <SpringDemo />
          <figcaption className="lp-motion-caption">
            <strong>Springs.</strong> Pick one, then tap the track. The curve is read from the token.
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

export { Materials }
