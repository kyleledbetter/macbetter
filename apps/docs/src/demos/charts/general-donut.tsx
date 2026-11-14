"use client"

import { ChartFrame, ChartLegend, useEvilChart } from "@/components/charts"
import { EChartsPieChart } from "@/components/charts/evil/charts/echarts-pie-chart"

/** Screen Time today, in minutes, by category. */
const data = [
  { category: "social", minutes: 130 },
  { category: "productivity", minutes: 105 },
  { category: "entertainment", minutes: 65 },
  { category: "other", minutes: 40 },
]

const series = {
  social: { label: "Social", color: "series3" },
  productivity: { label: "Productivity", color: "series2" },
  entertainment: { label: "Entertainment", color: "series1" },
  other: { label: "Other", color: "fill" },
} as const

const total = data.reduce((sum, d) => sum + d.minutes, 0)
const time = (m: number) => `${Math.floor(m / 60)}h ${m % 60}m`
const swatches = ["var(--sd-chart-3)", "var(--sd-chart-2)", "var(--sd-chart-1)", "var(--sd-fill)"]

export default function ScreenTimeDonut() {
  const { ref, config, chartOptions } = useEvilChart(series)
  return (
    <ChartFrame
      ref={ref}
      title="Screen Time today, by category"
      summary={`${time(total)} in all. Social took the most, ${time(130)}.`}
      table={{ columns: ["Category", "Time"], rows: data.map((d) => [series[d.category as keyof typeof series].label, time(d.minutes)]) }}
      style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 24 }}
    >
      <div style={{ position: "relative", width: 200, height: 200 }}>
        {config && chartOptions ? (
          <EChartsPieChart data={data} dataKey="minutes" nameKey="category" config={config} chartOptions={chartOptions} className="h-full w-full">
            <EChartsPieChart.Tooltip roundness="lg" />
            <EChartsPieChart.Pie innerRadius="70%" outerRadius="96%" cornerRadius={5} paddingAngle={2} />
          </EChartsPieChart>
        ) : null}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, display: "grid", placeContent: "center", textAlign: "center", pointerEvents: "none" }}>
          <span style={{ font: "var(--sd-text-title-2)", fontFamily: "var(--sd-font-rounded)", fontVariantNumeric: "tabular-nums" }}>{time(total)}</span>
          <span style={{ color: "var(--sd-label-secondary)", font: "var(--sd-text-footnote)" }}>Today</span>
        </div>
      </div>
      <ChartLegend
        style={{ display: "grid", gap: 8 }}
        items={data.map((d, i) => ({ label: series[d.category as keyof typeof series].label, color: swatches[i]!, value: time(d.minutes) }))}
      />
    </ChartFrame>
  )
}
