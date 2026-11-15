"use client"

import { useEffect, useRef, useState } from "react"

const styles = [
  { name: "Headline super", className: "type-headline-super", sample: "Ship it everywhere." },
  { name: "Headline elevated", className: "type-headline-elevated", sample: "A section headline" },
  { name: "Headline", className: "type-headline", sample: "Any brand." },
  { name: "Headline reduced", className: "type-headline-reduced", sample: "Explore the docs." },
  { name: "Eyebrow", className: "type-eyebrow", sample: "Materials and motion" },
  { name: "Intro", className: "type-intro type-two-tone", sample: "Bars and menus blur what’s behind them.", strong: " They turn solid when asked." },
  { name: "Body", className: "type-body", sample: "Put data-platform on any element and the components inside adapt." },
  { name: "Body reduced", className: "type-body-reduced", sample: "Every tile below works." },
  { name: "Caption", className: "type-caption", sample: "Copyright © 2026 Kyle Ledbetter. Apache 2.0." },
]

type Metrics = { size: number; leading: number; weight: string; tracking: string }

function Row({ name, className, sample, strong }: (typeof styles)[number]) {
  const ref = useRef<HTMLParagraphElement>(null)
  const [metrics, setMetrics] = useState<Metrics>()

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const read = () => {
      const style = getComputedStyle(element)
      const size = parseFloat(style.fontSize)
      const tracking = style.letterSpacing === "normal" ? 0 : parseFloat(style.letterSpacing) / size
      setMetrics({
        size,
        leading: Math.round(parseFloat(style.lineHeight)),
        weight: style.fontWeight,
        tracking: `${tracking.toFixed(3)}em`,
      })
    }
    read()
    window.addEventListener("resize", read)
    return () => window.removeEventListener("resize", read)
  }, [])

  return (
    <li style={{ display: "grid", gap: 6, padding: "18px 0", borderBottom: "1px solid var(--site-hairline)" }}>
      <span className="type-caption" style={{ color: "var(--site-label-secondary)" }}>
        {name}
        {metrics ? ` · ${metrics.size}/${metrics.leading} · ${metrics.weight} · ${metrics.tracking}` : null}
      </span>
      <p ref={ref} className={className} style={{ margin: 0, overflowWrap: "anywhere" }}>
        {sample}
        {strong ? <strong>{strong}</strong> : null}
      </p>
    </li>
  )
}

export default function WebTypeSpecimen() {
  return (
    <div style={{ width: "100%", maxWidth: 880, padding: "8px 32px 32px", color: "var(--site-label)" }}>
      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
        {styles.map((style) => (
          <Row key={style.name} {...style} />
        ))}
      </ul>
      <p className="type-body" style={{ marginTop: 24 }}>
        <a href="#the-scale" className="more-link">
          Learn more about the scale
        </a>
      </p>
    </div>
  )
}
