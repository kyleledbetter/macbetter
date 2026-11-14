"use client"

import { ChartFrame, ChartLegend, useEvilChart } from "@/components/charts"
import { EChartsLineChart } from "@/components/charts/evil/charts/echarts-line-chart"

/** Average daily high, °F, by month. */
const data = [
  { month: "Jan", cupertino: 59, seattle: 48, austin: 62 },
  { month: "Feb", cupertino: 62, seattle: 51, austin: 66 },
  { month: "Mar", cupertino: 65, seattle: 55, austin: 73 },
  { month: "Apr", cupertino: 69, seattle: 60, austin: 80 },
  { month: "May", cupertino: 74, seattle: 66, austin: 87 },
  { month: "Jun", cupertino: 79, seattle: 71, austin: 93 },
  { month: "Jul", cupertino: 83, seattle: 77, austin: 96 },
  { month: "Aug", cupertino: 83, seattle: 77, austin: 97 },
  { month: "Sep", cupertino: 81, seattle: 71, austin: 91 },
  { month: "Oct", cupertino: 75, seattle: 60, austin: 82 },
  { month: "Nov", cupertino: 66, seattle: 51, austin: 71 },
  { month: "Dec", cupertino: 59, seattle: 46, austin: 63 },
]

const series = {
  cupertino: { label: "Cupertino", color: "series1" },
  seattle: { label: "Seattle", color: "series3" },
  austin: { label: "Austin", color: "series4" },
} as const

export default function AverageHighs() {
  const { ref, config, chartOptions } = useEvilChart(series)
  return (
    <ChartFrame
      ref={ref}
      title="Average daily high by month"
      summary="Austin is warmest all year, peaking at 97°F in August. Seattle is coolest, from 46°F in December to 77°F in summer."
      table={{ columns: ["Month", "Cupertino (°F)", "Seattle (°F)", "Austin (°F)"], rows: data.map((d) => [d.month, d.cupertino, d.seattle, d.austin]) }}
      style={{ width: "100%", maxWidth: 600 }}
    >
      <ChartLegend
        items={[
          { label: "Cupertino", color: "var(--sd-chart-1)", shape: "line" },
          { label: "Seattle", color: "var(--sd-chart-3)", shape: "line" },
          { label: "Austin", color: "var(--sd-chart-4)", shape: "line" },
        ]}
      />
      <div style={{ height: 240 }}>
        {config && chartOptions ? (
          <EChartsLineChart data={data} config={config} chartOptions={chartOptions} xDataKey="month" curveType="monotone" className="h-full w-full">
            <EChartsLineChart.Grid />
            <EChartsLineChart.XAxis dataKey="month" hideDots />
            <EChartsLineChart.YAxis hideDots tickFormatter={(v) => `${v}°`} />
            <EChartsLineChart.Tooltip roundness="lg" position="fixed" />
            <EChartsLineChart.Line dataKey="cupertino" strokeWidth={2.5}>
              <EChartsLineChart.ActiveDot variant="border" />
            </EChartsLineChart.Line>
            <EChartsLineChart.Line dataKey="seattle" strokeWidth={2.5}>
              <EChartsLineChart.ActiveDot variant="border" />
            </EChartsLineChart.Line>
            <EChartsLineChart.Line dataKey="austin" strokeWidth={2.5}>
              <EChartsLineChart.ActiveDot variant="border" />
            </EChartsLineChart.Line>
          </EChartsLineChart>
        ) : null}
      </div>
    </ChartFrame>
  )
}
