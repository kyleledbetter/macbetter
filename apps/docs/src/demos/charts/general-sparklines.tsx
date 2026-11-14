import { Card } from "@dreambase/stardust/card"
import { ChartFrame, Sparkline, type ChartColor } from "@/components/charts"

/** The last 14 days of four measurements, for summary tiles. */
const tiles: { label: string; value: string; unit: string; color: ChartColor; values: number[]; trend: string }[] = [
  { label: "Steps", value: "8,214", unit: "avg", color: "orange", values: [6.4, 9.8, 7.1, 11.2, 8.5, 8.0, 6.4, 7.9, 9.1, 8.8, 7.7, 10.2, 8.4, 8.2], trend: "Up 6% from the 14 days before" },
  { label: "Resting Heart Rate", value: "55", unit: "BPM", color: "pink", values: [58, 57, 58, 56, 57, 56, 56, 55, 56, 55, 55, 54, 55, 55], trend: "Down 3 BPM" },
  { label: "Sleep", value: "7h 4m", unit: "avg", color: "core", values: [6.8, 7.2, 6.5, 7.4, 7.1, 6.9, 7.6, 7.0, 7.3, 6.6, 7.2, 7.5, 6.9, 7.1], trend: "About the same" },
  { label: "Weight", value: "168.4", unit: "lb", color: "purple", values: [171, 170.6, 170.8, 170.1, 169.9, 170.2, 169.4, 169.1, 169.3, 168.8, 168.9, 168.5, 168.6, 168.4], trend: "Down 2.6 lb" },
]

export default function SummaryTiles() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, width: "100%", maxWidth: 720 }}>
      {tiles.map((tile) => (
        <Card key={tile.label} style={{ display: "grid", gap: 6, padding: "12px 14px" }}>
          <ChartFrame title={`${tile.label}, last 14 days`} summary={`${tile.value} ${tile.unit}. ${tile.trend}.`} style={{ gap: 6 }}>
            <div style={{ color: `var(--sd-${tile.color === "core" ? "chart-core" : tile.color})`, font: "var(--sd-text-subheadline)", fontWeight: 600 }}>{tile.label}</div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8 }}>
              <div style={{ fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                <span style={{ font: "var(--sd-text-title-2)", fontFamily: "var(--sd-font-rounded)" }}>{tile.value}</span>
                <span style={{ color: "var(--sd-label-secondary)", font: "var(--sd-text-footnote)", fontWeight: 600 }}> {tile.unit}</span>
              </div>
              <Sparkline values={tile.values} color={tile.color} area width={64} height={30} />
            </div>
          </ChartFrame>
        </Card>
      ))}
    </div>
  )
}
