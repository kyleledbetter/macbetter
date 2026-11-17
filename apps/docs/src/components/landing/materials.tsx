import { Artwork } from "macbetter/artwork"
import { Glass, Material } from "macbetter/glass"
import { Squircle, squirclePath } from "macbetter/squircle"
import { MoreLink } from "@/components/more-link"
import { SectionHeading } from "./section-heading"
import { SpringDemo } from "./spring-demo"
import { Wallpaper } from "./wallpaper"

const thicknesses = ["ultrathin", "thin", "regular", "thick"] as const

const shape = 120
const radius = shape * 0.2237
/** The overlay zooms into the top-left corner, where the two outlines part. */
const zoom = radius * 1.7

const albums = [
  { title: "Golden Hour Tapes", artist: "The Saltmarsh", variant: "bloom", palette: "sunset" },
  { title: "Low Tide", artist: "Harbor Lights", variant: "strata", palette: "ocean" },
  { title: "Night Garden", artist: "Juniper & Ash", variant: "aurora", palette: "berry" },
  { title: "Field Notes", artist: "Paper Kites Club", variant: "prism", palette: "citrus" },
] as const

function Materials() {
  return (
    <section id="materials" className="lp-section" data-surface="alt" aria-labelledby="lp-materials">
      <div className="lp-section-inner">
      <SectionHeading
        id="lp-materials"
        eyebrow="Guidelines"
        headline={<>The details from Apple’s Human Interface Guidelines, built for the&nbsp;web.</>}
        links={
          <>
            <MoreLink href="/docs/foundations/materials">Learn more about materials</MoreLink>
            <MoreLink href="/docs/foundations/motion">Learn more about motion</MoreLink>
            <MoreLink href="/docs/components/squircle">Learn more about squircles</MoreLink>
            <MoreLink href="/docs/components/artwork">Learn more about artwork</MoreLink>
          </>
        }
      >
        Bars and menus are translucent and turn solid when someone asks for less transparency. Movement runs on spring
        curves, corners are continuous, and album art is drawn for you.{" "}
        <strong>Each one ships as a CSS token or a&nbsp;component.</strong>
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
        <figure className="lp-motion-card lp-corners" data-platform="macos">
          <div className="lp-corners-stage">
            <div className="lp-corners-shape">
              <Squircle size={shape} radius={radius} smoothing={0} exact className="lp-corners-fill" />
              <span>Rounded</span>
            </div>
            <div className="lp-corners-shape">
              <Squircle size={shape} radius={radius} exact className="lp-corners-fill" />
              <span>Continuous</span>
            </div>
            <div className="lp-corners-shape">
              <svg
                width={shape}
                height={shape}
                viewBox={`-2 -2 ${zoom} ${zoom}`}
                role="img"
                aria-label="The top-left corner of both outlines, enlarged: the rounded one dashed, the continuous one solid"
                className="lp-corners-overlay"
              >
                <rect width={shape} height={shape} rx={radius} />
                <path d={squirclePath(shape, shape, radius)} />
              </svg>
              <span>Corner, enlarged</span>
            </div>
          </div>
          <figcaption className="lp-motion-caption type-body-tight type-lead-in">
            <strong>Continuous corners.</strong> A squircle eases into its straight edges, where a plain radius
            starts its curve all at&nbsp;once.
          </figcaption>
        </figure>
        <figure className="lp-motion-card lp-art" data-platform="macos">
          <Artwork seed="Evening drive" variant="horizon" time="dusk" palette="dusk" dim={0.45} className="lp-art-backdrop" />
          <ul className="lp-art-covers" aria-label="Generated album covers">
            {albums.map((album) => (
              <li key={album.title}>
                <Artwork
                  seed={album.title}
                  variant={album.variant}
                  palette={album.palette}
                  title={`Cover art for ${album.title}`}
                />
                <span className="lp-art-title">{album.title}</span>
                <span className="lp-art-artist">{album.artist}</span>
              </li>
            ))}
          </ul>
          <figcaption className="lp-motion-caption type-body-tight type-lead-in">
            <strong>Artwork.</strong> Album covers and wallpapers drawn from a seed. The same name always draws the
            same&nbsp;picture.
          </figcaption>
        </figure>
      </div>
      </div>
    </section>
  )
}

export { Materials }
