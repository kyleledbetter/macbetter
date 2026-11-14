"use client"

import { ChartFrame, useEvilChart } from "@/components/charts"
import { EChartsHeatmapChart, type HeatmapDatum } from "@/components/charts/evil/charts/echarts-heatmap-chart"

/** A year of Exercise minutes, one per day, seeded so it draws the same every time. */
function exerciseYear(): HeatmapDatum[] {
  let seed = 11
  const random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  const end = Date.UTC(2026, 10, 14)
  return Array.from({ length: 364 }, (_, i) => {
    const day = new Date(end - (363 - i) * 86_400_000)
    const weekend = day.getUTCDay() === 0 || day.getUTCDay() === 6
    const summer = day.getUTCMonth() >= 4 && day.getUTCMonth() <= 8
    const rest = random() < (weekend ? 0.15 : 0.22)
    const minutes = rest ? 0 : Math.round(12 + random() * (weekend ? 70 : 40) + (summer ? 12 : 0))
    return { date: day.toISOString().slice(0, 10), value: minutes }
  }).filter((d) => d.value > 0)
}

const data = exerciseYear()
const series = { exercise: { label: "Exercise", color: ["exercise/25", "exercise/50", "exercise/75", "exercise"] } } as const
const closed = data.filter((d) => d.value >= 30).length

export default function ExerciseYear() {
  const { ref, config, chartOptions } = useEvilChart(series)
  return (
    <ChartFrame
      ref={ref}
      title="Exercise minutes, last 12 months"
      summary={`You exercised on ${data.length} days and closed your Exercise ring on ${closed}. Summer weekends were the most active.`}
      table={{
        columns: ["Month", "Days with exercise", "Minutes"],
        rows: Array.from({ length: 12 }, (_, m) => {
          const month = new Date(Date.UTC(2025, 11 + m, 1))
          const days = data.filter((d) => d.date.startsWith(month.toISOString().slice(0, 7)))
          return [month.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" }), days.length, days.reduce((s, d) => s + d.value, 0)]
        }),
      }}
      style={{ width: "100%", maxWidth: 760 }}
    >
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
        <span style={{ font: "var(--sd-text-headline)" }}>{closed} days with your Exercise ring closed</span>
        <span style={{ color: "var(--sd-label-secondary)", font: "var(--sd-text-footnote)" }}>Nov 2025–Nov 2026</span>
      </div>
      <div style={{ height: 150 }}>
        {config && chartOptions ? (
          <EChartsHeatmapChart data={data} config={config} chartOptions={chartOptions} range={["2025-11-16", "2026-11-14"]} thresholds={[20, 30, 45]} className="h-full w-full">
            <EChartsHeatmapChart.Cell dataKey="exercise" radius={3} gap={3} />
            <EChartsHeatmapChart.MonthLabel />
            <EChartsHeatmapChart.DayLabel labels={["", "Mon", "", "Wed", "", "Fri", ""]} />
            <EChartsHeatmapChart.Tooltip roundness="lg" valueFormatter={(v) => `${v} min`} />
            <EChartsHeatmapChart.Legend />
          </EChartsHeatmapChart>
        ) : null}
      </div>
    </ChartFrame>
  )
}
