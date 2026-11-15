import { Button } from "macbetter/button"
import { Checkbox } from "macbetter/checkbox"
import { SegmentedControl, SegmentedControlItem } from "macbetter/segmented-control"
import { Slider } from "macbetter/slider"
import { Switch } from "macbetter/switch"
import { MoreLink } from "@/components/more-link"
import { CodeBlock } from "@/components/code-block"
import { SectionHeading } from "./section-heading"

const cards = [
  { theme: "ember", name: "Ember", note: "Orange on racing\u00a0green." },
  { theme: "system", name: "System", note: "Apple’s blue on true\u00a0grays." },
  { theme: "nebula", name: "Nebula", note: "Violet on cool ink, rounder\u00a0corners." },
  { theme: "graphite", name: "Graphite", note: "Monochrome and squared\u00a0off." },
]

const seeds = `[data-theme="acme"] {
  --mb-accent: light-dark(#6d3df5, #9b7bff);
  --mb-accent-secondary: light-dark(#c026a8, #ff7ad9);
  --mb-ink: light-dark(#14102b, #f3f1ff);
  --mb-bg: light-dark(#ffffff, #100c24);
  --mb-tint: light-dark(#66618a, #9a94c9);
  --mb-radius-scale: 1.15;
}`

function ThemeCard({ theme, name, note }: (typeof cards)[number]) {
  return (
    <figure className="lp-theme-card" data-theme={theme} data-platform="macos" data-macbetter="">
      <figcaption className="lp-theme-card-head">
        <span className="lp-theme-card-swatches" aria-hidden="true">
          <span style={{ background: "var(--mb-accent)" }} />
          <span style={{ background: "var(--mb-accent-secondary)" }} />
          <span style={{ background: "var(--mb-ink)" }} />
        </span>
        <span className="lp-theme-card-name type-eyebrow-reduced">{name}</span>
        <span className="lp-theme-card-note type-body-reduced">{note}</span>
      </figcaption>
      <div className="lp-theme-card-controls">
        <SegmentedControl aria-label={`Range, ${name} theme`} defaultValue="week" block size="sm">
          <SegmentedControlItem value="day">Day</SegmentedControlItem>
          <SegmentedControlItem value="week">Week</SegmentedControlItem>
          <SegmentedControlItem value="month">Month</SegmentedControlItem>
        </SegmentedControl>
        <label className="lp-theme-card-row">
          Sync over cellular
          <Switch defaultChecked />
        </label>
        <Checkbox defaultChecked>Include archived</Checkbox>
        <Slider defaultValue={64} thumbLabel={`Opacity, ${name} theme`} size="sm" />
        <div className="lp-theme-card-buttons">
          <Button size="sm">Cancel</Button>
          <Button size="sm" variant="filled">
            Save
          </Button>
        </div>
      </div>
    </figure>
  )
}

function Themes() {
  return (
    <section id="themes" className="lp-section" aria-labelledby="lp-themes">
      <div className="lp-section-inner">
        <div className="lp-split">
          <SectionHeading
            id="lp-themes"
            eyebrow="Themes"
            align="start"
            size="headline"
            headline={<>Easily customize themes for your&nbsp;brand.</>}
            links={
              <>
                <MoreLink href="/themes">Open Theme Studio</MoreLink>
                <MoreLink href="/docs/theming">Read the theming guide</MoreLink>
              </>
            }
          >
            A theme sets about a dozen values: the accent, the text color, the surfaces, a tint for fills, a radius
            scale and a font. <strong>Every other color, shadow and corner derives from those seeds,</strong> in
            light and&nbsp;dark.
          </SectionHeading>
          <div className="lp-reveal lp-seeds">
            <CodeBlock code={seeds} lang="css" title="acme.css" />
          </div>
        </div>
        <div className="lp-theme-grid lp-reveal">
          {cards.map((card) => (
            <ThemeCard key={card.theme} {...card} />
          ))}
        </div>
      </div>
    </section>
  )
}

export { Themes }
