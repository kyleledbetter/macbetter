import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"

/** The last 90 days against the last 365, as Fitness compares them. */
const trends = [
  { label: "Move", color: "var(--sd-chart-move)", now: "512", before: "468", unit: "KCAL/DAY", up: true },
  { label: "Exercise", color: "var(--sd-chart-exercise)", now: "36", before: "29", unit: "MIN/DAY", up: true },
  { label: "Stand", color: "var(--sd-chart-stand)", now: "11", before: "12", unit: "HR/DAY", up: false },
  { label: "Distance", color: "var(--sd-blue)", now: "4.2", before: "3.6", unit: "MI/DAY", up: true },
  { label: "Walking Pace", color: "var(--sd-teal)", now: "17′42″", before: "18′05″", unit: "/MI", up: true, note: "Faster than 18′05″" },
]

export default function FitnessTrends() {
  return (
    <ul aria-label="Trends, last 90 days compared with the last year" style={{ display: "grid", gap: 14, width: "100%", maxWidth: 420, margin: 0, padding: 0, listStyle: "none" }}>
      {trends.map((t) => {
        const Arrow = t.up ? ArrowUpIcon : ArrowDownIcon
        return (
          <li key={t.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              aria-hidden="true"
              style={{
                display: "grid",
                placeItems: "center",
                flex: "none",
                width: 30,
                height: 30,
                borderRadius: "50%",
                // Going down is drawn as an outline, so it doesn't rely on color alone.
                background: t.up ? t.color : "transparent",
                boxShadow: t.up ? "none" : `inset 0 0 0 2px ${t.color}`,
                color: t.up ? "var(--sd-bg)" : t.color,
              }}
            >
              <Arrow style={{ width: 18, height: 18 }} strokeWidth={3} />
            </span>
            <div style={{ display: "grid", gap: 1, minWidth: 0 }}>
              <span style={{ color: t.color, font: "var(--sd-text-subheadline)", fontWeight: 600 }}>{t.label}</span>
              <span style={{ font: "var(--sd-text-title-3)", fontFamily: "var(--sd-font-rounded)", fontVariantNumeric: "tabular-nums" }}>
                {t.now}
                <span style={{ color: "var(--sd-label-secondary)", font: "var(--sd-text-footnote)", fontWeight: 600 }}> {t.unit}</span>
              </span>
            </div>
            <span style={{ marginInlineStart: "auto", color: "var(--sd-label-secondary)", font: "var(--sd-text-footnote)", textAlign: "end" }}>
              {"note" in t ? t.note : `${t.up ? "Up" : "Down"} from ${t.before}`}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
