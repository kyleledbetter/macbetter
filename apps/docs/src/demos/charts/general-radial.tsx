"use client"

import { ChartFrame, ChartLegend, useEvilChart } from "@/components/charts"
import { EChartsRadialChart } from "@/components/charts/evil/charts/echarts-radial-chart"

/** How much of this month's goals you've met so far, in percent. */
const data = [
  { goal: "sleep", percent: 86 },
  { goal: "mindful", percent: 64 },
  { goal: "water", percent: 92 },
]

const series = {
  sleep: { label: "Sleep", color: "core" },
  mindful: { label: "Mindful minutes", color: "mint" },
  water: { label: "Water", color: "cyan" },
} as const

export default function MonthlyGoals() {
  const { ref, config, chartOptions } = useEvilChart(series)
  return (
    <ChartFrame
      ref={ref}
      title="Goals met this month"
      summary="Water 92%, sleep 86% and mindful minutes 64% of this month's goals."
      table={{ columns: ["Goal", "Met"], rows: data.map((d) => [series[d.goal as keyof typeof series].label, `${d.percent}%`]) }}
      style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 24 }}
    >
      <div style={{ width: 190, height: 190 }}>
        {config && chartOptions ? (
          <EChartsRadialChart data={data} nameKey="goal" config={config} chartOptions={chartOptions} max={100} innerRadius="34%" outerRadius="100%" className="h-full w-full">
            <EChartsRadialChart.Tooltip roundness="lg" />
            <EChartsRadialChart.RadialBar dataKey="percent" showBackground cornerRadius={99} barSize={14} />
          </EChartsRadialChart>
        ) : null}
      </div>
      <ChartLegend
        style={{ display: "grid", gap: 8 }}
        items={[
          { label: "Water", color: "var(--sd-cyan)", value: "92%" },
          { label: "Mindful minutes", color: "var(--sd-mint)", value: "64%" },
          { label: "Sleep", color: "var(--sd-chart-core)", value: "86%" },
        ]}
      />
    </ChartFrame>
  )
}
