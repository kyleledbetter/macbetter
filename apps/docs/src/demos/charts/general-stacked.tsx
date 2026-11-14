"use client"

import { ChartFrame, ChartLegend, useEvilChart } from "@/components/charts"
import { EChartsBarChart } from "@/components/charts/evil/charts/echarts-bar-chart"

/** Screen Time this week, in hours a day, by category. */
const data = [
  { day: "Sun", social: 2.4, productivity: 0.6, entertainment: 1.9 },
  { day: "Mon", social: 1.6, productivity: 2.8, entertainment: 0.7 },
  { day: "Tue", social: 1.8, productivity: 3.1, entertainment: 0.5 },
  { day: "Wed", social: 1.4, productivity: 2.6, entertainment: 0.9 },
  { day: "Thu", social: 2.0, productivity: 2.9, entertainment: 0.6 },
  { day: "Fri", social: 2.6, productivity: 1.9, entertainment: 1.4 },
  { day: "Sat", social: 2.2, productivity: 1.8, entertainment: 1.1 },
]

const series = {
  social: { label: "Social", color: "series3" },
  productivity: { label: "Productivity", color: "series2" },
  entertainment: { label: "Entertainment", color: "series1" },
} as const

const totals = data.map((d) => d.social + d.productivity + d.entertainment)
const average = totals.reduce((a, b) => a + b, 0) / totals.length

export default function ScreenTimeStacked() {
  const { ref, config, chartOptions } = useEvilChart(series)
  return (
    <ChartFrame
      ref={ref}
      title="Screen Time this week, by category"
      summary={`A daily average of ${average.toFixed(1)} hours. Weekdays lean on productivity apps; the weekend on social and entertainment.`}
      table={{ columns: ["Day", "Social (h)", "Productivity (h)", "Entertainment (h)"], rows: data.map((d) => [d.day, d.social, d.productivity, d.entertainment]) }}
      style={{ width: "100%", maxWidth: 560 }}
    >
      <div>
        <div style={{ color: "var(--sd-label-secondary)", font: "var(--sd-text-footnote)", fontWeight: 600, textTransform: "uppercase" }}>Daily average</div>
        <div style={{ font: "var(--sd-text-title-1)", fontFamily: "var(--sd-font-rounded)", fontVariantNumeric: "tabular-nums" }}>
          {Math.floor(average)}h {Math.round((average % 1) * 60)}m
        </div>
      </div>
      <div style={{ height: 220 }}>
        {config && chartOptions ? (
          <EChartsBarChart data={data} config={config} chartOptions={chartOptions} xDataKey="day" stackType="stacked" barRadius={4} className="h-full w-full">
            <EChartsBarChart.Grid />
            <EChartsBarChart.XAxis dataKey="day" hideDots />
            <EChartsBarChart.YAxis hideDots tickFormatter={(v) => `${v}h`} />
            <EChartsBarChart.Tooltip roundness="lg" position="fixed" />
            <EChartsBarChart.Bar dataKey="productivity" />
            <EChartsBarChart.Bar dataKey="social" />
            <EChartsBarChart.Bar dataKey="entertainment" />
          </EChartsBarChart>
        ) : null}
      </div>
      <ChartLegend
        items={[
          { label: "Productivity", color: "var(--sd-chart-2)" },
          { label: "Social", color: "var(--sd-chart-3)" },
          { label: "Entertainment", color: "var(--sd-chart-1)" },
        ]}
      />
    </ChartFrame>
  )
}
