"use client"

import { ChartFrame, useEvilChart } from "@/components/charts"
import { EChartsAreaChart } from "@/components/charts/evil/charts/echarts-area-chart"

const data = [
  { month: "Jun", minutes: 812 },
  { month: "Jul", minutes: 944 },
  { month: "Aug", minutes: 901 },
  { month: "Sep", minutes: 1036 },
  { month: "Oct", minutes: 988 },
  { month: "Nov", minutes: 1120 },
]

// Colors are macbetter chart colors, not hex: the adapter resolves them for this chart's theme and scheme.
const series = { minutes: { label: "Exercise minutes", color: "exercise" } } as const

export default function ExerciseByMonth() {
  const { ref, config, chartOptions } = useEvilChart(series)
  return (
    <ChartFrame
      ref={ref}
      title="Exercise minutes by month"
      summary="Exercise rose from 812 minutes in June to 1,120 in November."
      table={{ columns: ["Month", "Minutes"], rows: data.map((d) => [d.month, d.minutes]) }}
      style={{ width: "100%", maxWidth: 420 }}
    >
      <div style={{ height: 180 }}>
        {config && chartOptions ? (
          <EChartsAreaChart data={data} config={config} chartOptions={chartOptions} xDataKey="month" curveType="monotone" className="h-full w-full">
            <EChartsAreaChart.Grid />
            <EChartsAreaChart.XAxis dataKey="month" hideDots />
            <EChartsAreaChart.YAxis hideDots />
            <EChartsAreaChart.Tooltip roundness="lg" />
            <EChartsAreaChart.Area dataKey="minutes" variant="gradient" strokeWidth={2.5}>
              <EChartsAreaChart.ActiveDot variant="border" />
            </EChartsAreaChart.Area>
          </EChartsAreaChart>
        ) : null}
      </div>
    </ChartFrame>
  )
}
