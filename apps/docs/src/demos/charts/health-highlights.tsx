import { Card } from "@dreambase/stardust/card"
import { FootprintsIcon, HeartIcon } from "lucide-react"
import { ChartFrame } from "@/components/charts"

const highlights = [
  {
    category: "Steps",
    icon: FootprintsIcon,
    color: "var(--sd-orange)",
    when: "Today",
    headline: "You’re averaging more steps this year than you did last year.",
    unit: "steps/day",
    bars: [
      { label: "2026", value: 8214 },
      { label: "2025", value: 7102 },
    ],
  },
  {
    category: "Resting Heart Rate",
    icon: HeartIcon,
    color: "var(--sd-pink)",
    when: "Yesterday",
    headline: "Your resting heart rate was lower this month than last month.",
    unit: "BPM",
    bars: [
      { label: "November", value: 55 },
      { label: "October", value: 58 },
    ],
  },
]

/** Health's Highlights: a sentence, then the two numbers it compares, as capsules. */
export default function HealthHighlights() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, width: "100%", maxWidth: 680 }}>
      {highlights.map((h) => {
        const max = Math.max(...h.bars.map((b) => b.value))
        return (
          <Card key={h.category} style={{ display: "grid", gap: 12, alignContent: "start" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: h.color, font: "var(--sd-text-subheadline)", fontWeight: 600 }}>
              <h.icon aria-hidden="true" style={{ width: "1.1em", height: "1.1em" }} fill="currentColor" strokeWidth={1.5} />
              {h.category}
              <span style={{ marginInlineStart: "auto", color: "var(--sd-label-secondary)", fontWeight: 400 }}>{h.when}</span>
            </div>
            <p style={{ margin: 0, font: "var(--sd-text-headline)" }}>{h.headline}</p>
            <ChartFrame
              title={`${h.category}: ${h.bars[0]!.label} compared with ${h.bars[1]!.label}`}
              summary={h.bars.map((b) => `${b.label}: ${b.value.toLocaleString("en-US")} ${h.unit}`).join(". ")}
              style={{ gap: 10 }}
            >
              {h.bars.map((bar, i) => (
                <div key={bar.label} aria-hidden="true" style={{ display: "grid", gap: 4 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, fontVariantNumeric: "tabular-nums" }}>
                    <span style={{ font: "var(--sd-text-title-3)", fontFamily: "var(--sd-font-rounded)", color: i === 0 ? h.color : "var(--sd-label)" }}>
                      {bar.value.toLocaleString("en-US")}
                    </span>
                    <span style={{ color: "var(--sd-label-secondary)", font: "var(--sd-text-footnote)", fontWeight: 600 }}>{h.unit}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: `${(bar.value / max) * 100}%`,
                      height: 26,
                      paddingInline: 10,
                      borderRadius: 7,
                      background: i === 0 ? h.color : "var(--sd-fill)",
                      color: i === 0 ? `oklch(from ${h.color} 0.26 0.06 h)` : "var(--sd-label)",
                      font: "var(--sd-text-footnote)",
                      fontWeight: 600,
                    }}
                  >
                    {bar.label}
                  </div>
                </div>
              ))}
            </ChartFrame>
          </Card>
        )
      })}
    </div>
  )
}
