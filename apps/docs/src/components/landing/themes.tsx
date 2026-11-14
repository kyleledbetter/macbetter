import { Button } from "macbetter/button"
import { Checkbox } from "macbetter/checkbox"
import { SegmentedControl, SegmentedControlItem } from "macbetter/segmented-control"
import { Slider } from "macbetter/slider"
import { Switch } from "macbetter/switch"
import Link from "next/link"
import { CodeBlock } from "@/components/code-block"
import { SectionHeading } from "./section-heading"

const cards = [
  { theme: "ember", name: "Ember", note: "Orange on racing green." },
  { theme: "system", name: "System", note: "Apple’s blue on true grays." },
  { theme: "nebula", name: "Nebula", note: "Violet on cool ink, rounder corners." },
  { theme: "graphite", name: "Graphite", note: "Monochrome and squared off." },
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
        <span className="lp-theme-card-name">{name}</span>
        <span className="lp-theme-card-note">{note}</span>
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
    <section className="lp-section" aria-labelledby="lp-themes">
      <div className="lp-split">
        <SectionHeading
          id="lp-themes"
          title="Any brand."
          muted="Still Apple."
          actions={
            <>
              <Button variant="tinted" render={<Link href="/themes" />}>
                Browse themes
              </Button>
              <Button variant="plain" render={<Link href="/docs/theming" />}>
                Read the theming guide
              </Button>
            </>
          }
        >
          A theme answers about a dozen questions: the accent, the ink, the surfaces, a tint for fills, a radius
          scale and a font. Every other color, shadow and corner derives from those seeds, in light and dark.
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
    </section>
  )
}

export { Themes }
