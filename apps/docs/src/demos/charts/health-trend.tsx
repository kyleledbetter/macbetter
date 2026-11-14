"use client"

import * as React from "react"
import { alpha, baseOption, categoryAxis, ChartFrame, ChartHeader, ChartLegend, EChart, valueAxis, type ChartTheme, type Scrub } from "@/components/charts"

/** Resting heart rate for the 90 days to November 14, 2026, drifting down as fitness improves. */
const days = Array.from({ length: 90 }, (_, i) => {
  const date = new Date(2026, 7, 17 + i)
  const bpm = Math.round(59.5 - i * 0.045 + Math.sin(i * 1.7) * 1.6 + Math.sin(i * 0.31) * 1.1 + (i % 7 === 5 ? 1.5 : 0))
  return { date, bpm }
})
const weekly = days.map((_, i) => {
  const window = days.slice(Math.max(0, i - 6), i + 1)
  return +(window.reduce((sum, d) => sum + d.bpm, 0) / window.length).toFixed(1)
})
const mean = days.reduce((sum, d) => sum + d.bpm, 0) / days.length
const typical = [Math.round(mean - 2.5), Math.round(mean + 2.5)] as const
const short = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" })
const labels = days.map((d) => (d.date.getDate() === 1 ? d.date.toLocaleDateString("en-US", { month: "short" }) : ""))

export default function RestingHeartRateTrend() {
  const [scrub, setScrub] = React.useState<Scrub | null>(null)

  const option = React.useCallback(
    (theme: ChartTheme) => ({
      ...baseOption(theme),
      grid: { left: 0, right: 30, top: 8, bottom: 24 },
      xAxis: categoryAxis(theme, labels, {
        boundaryGap: false,
        axisLabel: { color: theme.colors.axis, fontSize: theme.fontSize, interval: (i: number) => labels[i] !== "", align: "left" },
        splitLine: { show: true, interval: (i: number) => labels[i] !== "", lineStyle: { color: theme.colors.grid, type: [2, 3] } },
      }),
      yAxis: valueAxis(theme, { min: 50, max: 66, interval: 4 }),
      series: [
        {
          id: "days",
          type: "scatter",
          data: days.map((d) => d.bpm),
          symbolSize: 4,
          itemStyle: { color: alpha(theme.colors.pink, 0.45) },
          emphasis: { disabled: true },
          silent: true,
        },
        {
          id: "average",
          type: "line",
          data: weekly,
          smooth: 0.35,
          showSymbol: false,
          symbol: "circle",
          symbolSize: 8,
          lineStyle: { color: theme.colors.pink, width: 2.5, cap: "round" },
          itemStyle: { color: theme.colors.pink, borderColor: theme.colors.bg, borderWidth: 2 },
          emphasis: { scale: 1, lineStyle: { width: 2.5 } },
          markArea: {
            silent: true,
            itemStyle: { color: alpha(theme.colors.pink, theme.dark ? 0.12 : 0.08) },
            data: [[{ yAxis: typical[0] }, { yAxis: typical[1] }]],
          },
          markLine: {
            silent: true,
            symbol: "none",
            label: { show: false },
            lineStyle: { color: theme.colors.label3, type: [3, 3], width: 1 },
            data: [{ yAxis: +mean.toFixed(1) }],
          },
        },
      ],
    }),
    []
  )

  const index = scrub?.index
  return (
    <ChartFrame
      title="Resting heart rate, last 90 days"
      summary={`Your resting heart rate averaged ${Math.round(mean)} BPM and fell from about ${Math.round(weekly[6]!)} to ${Math.round(weekly.at(-1)!)} BPM over 90 days. Your typical range is ${typical[0]} to ${typical[1]} BPM.`}
      table={{
        columns: ["Date", "Resting (BPM)", "7-day average"],
        rows: days.filter((_, i) => i % 7 === 6).map((d, i) => [short.format(d.date), d.bpm, weekly[i * 7 + 6]!]),
      }}
      style={{ width: "100%", maxWidth: 560 }}
    >
      <ChartHeader
        eyebrow={index === undefined ? "Average" : "7-day average"}
        value={index === undefined ? Math.round(mean) : weekly[index]}
        unit="BPM"
        detail={index === undefined ? "Aug 17–Nov 14, 2026" : short.format(days[index]!.date)}
      />
      <EChart
        option={option}
        height={200}
        onScrub={setScrub}
        scrub={{
          label: "Resting heart rate",
          count: days.length,
          valueText: (i) => `${weekly[i]} BPM 7-day average, ${short.format(days[i]!.date)}`,
        }}
      />
      <ChartLegend
        items={[
          { label: "7-day average", color: "var(--mb-pink)", shape: "line" },
          { label: "Daily", color: "color-mix(in oklch, var(--mb-pink) 50%, transparent)" },
          { label: `Typical range, ${typical[0]}–${typical[1]}`, color: "color-mix(in oklch, var(--mb-pink) 20%, transparent)", shape: "bar" },
          { label: "Average", color: "var(--mb-label-tertiary)", shape: "dashed" },
        ]}
      />
    </ChartFrame>
  )
}
