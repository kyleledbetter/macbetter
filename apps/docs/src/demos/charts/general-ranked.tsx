"use client"

import { ChartFrame, useEvilChart } from "@/components/charts"
import { EChartsBarChart } from "@/components/charts/evil/charts/echarts-bar-chart"

/** Most used apps this week, in hours, most first. */
const data = [
  { app: "Messages", hours: 6.2 },
  { app: "Safari", hours: 4.7 },
  { app: "Mail", hours: 3.1 },
  { app: "Music", hours: 2.3 },
  { app: "Maps", hours: 1.3 },
  { app: "Notes", hours: 0.8 },
]

const series = { hours: { label: "Hours", color: "series3" } } as const

export default function MostUsedApps() {
  const { ref, config, chartOptions } = useEvilChart(series)
  return (
    <ChartFrame
      ref={ref}
      title="Most used apps this week"
      summary="Messages leads with 6.2 hours, then Safari with 4.7 and Mail with 3.1."
      table={{ columns: ["App", "Hours"], rows: data.map((d) => [d.app, d.hours]) }}
      style={{ width: "100%", maxWidth: 480 }}
    >
      <div style={{ height: 230 }}>
        {config && chartOptions ? (
          <EChartsBarChart data={data} config={config} chartOptions={chartOptions} layout="horizontal" barRadius={5} className="h-full w-full">
            <EChartsBarChart.YAxis dataKey="app" hideDots />
            <EChartsBarChart.XAxis hideDots tickFormatter={(v) => `${v}h`} />
            <EChartsBarChart.Grid />
            <EChartsBarChart.Tooltip roundness="lg" />
            <EChartsBarChart.Bar dataKey="hours" enableHoverHighlight />
          </EChartsBarChart>
        ) : null}
      </div>
    </ChartFrame>
  )
}
