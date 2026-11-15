import { MoreLink } from "@/components/more-link"
import { componentCount } from "@/lib/counts"

const stats = (components: number) => [
  {
    value: String(components),
    note: 1,
    label: "components, from push buttons and menus to windows, sheets and the\u00a0Dock",
  },
  { value: "3", label: "platforms from one codebase: macOS, iPadOS and\u00a0iOS" },
  { value: "4", label: "built-in themes: Ember, System, Nebula and\u00a0Graphite" },
  { value: "12", label: "artwork styles, drawn from a seed for covers and\u00a0placeholders" },
]

/** A spec strip under the hero: numbers that are true of the package today. */
function Highlights() {
  return (
    <section className="lp-highlights" aria-label="macbetter at a glance">
      <ul className="lp-stats lp-reveal">
        {stats(componentCount()).map((stat) => (
          <li key={stat.label} className="lp-stat">
            <span className="type-stat lp-stat-value">
              {stat.value}
              {stat.note ? (
                <a href={`#footnote-${stat.note}`} className="footnote-mark" aria-label={`Footnote ${stat.note}`}>
                  {stat.note}
                </a>
              ) : null}
            </span>
            <span className="lp-stat-label type-body-reduced">{stat.label}</span>
          </li>
        ))}
      </ul>
      <p className="lp-highlights-link type-body lp-reveal">
        <MoreLink href="/docs/introduction">Learn what’s in the box</MoreLink>
      </p>
    </section>
  )
}

export { Highlights }
