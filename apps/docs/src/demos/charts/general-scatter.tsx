"use client"

import * as React from "react"
import { alpha, baseOption, ChartFrame, EChart, valueAxis, type ChartTheme } from "@/components/charts"

/** This year's runs: distance in miles and average pace in minutes per mile. */
const runs = [
  [3.1, 9.4], [5.0, 9.1], [2.4, 8.6], [6.2, 9.6], [3.5, 8.9], [8.1, 9.9], [4.0, 8.8], [3.2, 8.5],
  [10.2, 10.1], [5.4, 9.2], [2.0, 8.2], [6.8, 9.5], [4.4, 8.9], [3.1, 8.7], [13.1, 10.3], [5.1, 8.9],
  [3.0, 8.3], [7.2, 9.4], [4.6, 8.6], [3.4, 8.4], [9.0, 9.7], [5.6, 8.8], [2.6, 8.0], [6.0, 9.0],
] as [number, number][]

const pace = (m: number) => `${Math.floor(m)}′${String(Math.round((m % 1) * 60)).padStart(2, "0")}″`

export default function RunsScatter() {
  const option = React.useCallback(
    (theme: ChartTheme) => ({
      ...baseOption(theme),
      grid: { left: 0, right: 40, top: 10, bottom: 24 },
      xAxis: {
        type: "value",
        min: 0,
        max: 14,
        interval: 2,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: theme.colors.axis, fontSize: theme.fontSize, formatter: (v: number) => `${v} mi` },
        splitLine: { lineStyle: { color: theme.colors.grid, type: [2, 3] } },
      },
      yAxis: valueAxis(theme, {
        min: 7.5,
        max: 10.5,
        interval: 1,
        inverse: true,
        axisLabel: { color: theme.colors.axis, fontSize: theme.fontSize, formatter: (v: number) => pace(v) },
      }),
      tooltip: {
        trigger: "item",
        backgroundColor: theme.colors.bg,
        borderWidth: 0,
        textStyle: { color: theme.colors.label, fontFamily: theme.font, fontSize: theme.fontSize + 1 },
        formatter: ({ value }: { value: [number, number] }) => `${value[0]} mi · ${pace(value[1])} /mi`,
      },
      series: [
        {
          id: "runs",
          type: "scatter",
          data: runs,
          symbolSize: 11,
          itemStyle: { color: alpha(theme.colors.green, 0.85), borderColor: theme.colors.bg, borderWidth: 1.5 },
          emphasis: { scale: 1.3 },
        },
      ],
    }),
    []
  )
  return (
    <ChartFrame
      title="Distance and pace, this year's runs"
      summary="Longer runs are slower: short runs average around 8′30″ a mile, and the half marathon was 10′18″."
      table={{ columns: ["Run", "Distance (mi)", "Pace (/mi)"], rows: runs.map(([d, p], i) => [`Run ${i + 1}`, d, pace(p)]) }}
      style={{ width: "100%", maxWidth: 520 }}
    >
      <div style={{ font: "var(--sd-text-headline)" }}>Faster pace is higher</div>
      <EChart option={option} height={230} />
    </ChartFrame>
  )
}
