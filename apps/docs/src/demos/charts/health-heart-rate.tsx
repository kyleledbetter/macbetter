"use client"

import { SegmentedControl, SegmentedControlItem } from "@dreambase/stardust/segmented-control"
import * as React from "react"
import { baseOption, categoryAxis, ChartFrame, ChartHeader, EChart, valueAxis, type ChartTheme, type Scrub } from "@/components/charts"

type Period = "D" | "W"

/** Lowest and highest heart rate, in BPM, for each hour today and each day this week. */
const ranges: Record<Period, { labels: string[]; ticks: number[]; low: number[]; high: number[]; names: string[]; range: string }> = {
  D: {
    labels: ["12 AM", "", "", "", "", "", "6", "", "", "", "", "", "12 PM", "", "", "", "", "", "6", "", "", "", "", ""],
    ticks: [6, 12, 18],
    low: [54, 52, 53, 55, 53, 56, 58, 66, 72, 70, 68, 71, 74, 69, 67, 70, 88, 96, 78, 72, 68, 64, 60, 57],
    high: [61, 58, 60, 62, 59, 63, 74, 112, 104, 88, 92, 96, 102, 94, 90, 98, 142, 148, 118, 96, 88, 80, 72, 64],
    names: Array.from({ length: 24 }, (_, h) => `${h % 12 || 12}–${(h + 1) % 12 || 12} ${h + 1 < 12 || h + 1 === 24 ? "AM" : "PM"}`),
    range: "Today",
  },
  W: {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    ticks: [],
    low: [51, 53, 52, 50, 54, 53, 52],
    high: [138, 152, 121, 164, 146, 129, 148],
    names: ["Sun, Nov 8", "Mon, Nov 9", "Tue, Nov 10", "Wed, Nov 11", "Thu, Nov 12", "Fri, Nov 13", "Today"],
    range: "Nov 8–14, 2026",
  },
}

export default function HeartRateChart() {
  const [period, setPeriod] = React.useState<Period>("D")
  const [scrub, setScrub] = React.useState<Scrub | null>(null)
  const data = ranges[period]
  const low = Math.min(...data.low)
  const high = Math.max(...data.high)

  const option = React.useCallback(
    (theme: ChartTheme) => ({
      ...baseOption(theme),
      grid: { left: 0, right: 34, top: 8, bottom: 24 },
      xAxis: categoryAxis(theme, data.labels, {
        axisLabel: {
          color: theme.colors.axis,
          fontSize: theme.fontSize,
          interval: (i: number) => data.labels[i] !== "",
          align: period === "D" ? "left" : "center",
        },
        splitLine: {
          show: data.ticks.length > 0,
          interval: (i: number) => data.ticks.includes(i),
          lineStyle: { color: theme.colors.grid, type: [2, 3] },
        },
      }),
      yAxis: valueAxis(theme, { min: 40, max: 200, interval: 40, axisLabel: { color: theme.colors.axis, fontSize: theme.fontSize } }),
      series: [
        // An invisible bar lifts each capsule to the hour's lowest reading.
        { id: "base", type: "bar", stack: "range", data: data.low, itemStyle: { color: "transparent" }, emphasis: { disabled: true } },
        {
          id: "range",
          type: "bar",
          stack: "range",
          data: data.high.map((h, i) => h - data.low[i]!),
          barWidth: period === "D" ? 7 : 12,
          itemStyle: { color: theme.colors.pink, borderRadius: 99 },
          emphasis: { disabled: true },
        },
      ],
    }),
    [data, period]
  )

  const index = scrub?.index
  const shown = index === undefined ? { low, high, when: data.range } : { low: data.low[index]!, high: data.high[index]!, when: data.names[index]! }
  return (
    <ChartFrame
      title={`Heart rate, ${data.range}`}
      summary={`Heart rate ranged from ${low} to ${high} beats per minute. The highest readings came during the evening walk.`}
      table={{ columns: ["Time", "Lowest (BPM)", "Highest (BPM)"], rows: data.names.map((name, i) => [name, data.low[i]!, data.high[i]!]) }}
      style={{ width: "100%", maxWidth: 560 }}
    >
      <SegmentedControl size="sm" block aria-label="Period" value={period} onValueChange={(v) => v && setPeriod(v as Period)}>
        <SegmentedControlItem value="D" aria-label="Day">
          D
        </SegmentedControlItem>
        <SegmentedControlItem value="W" aria-label="Week">
          W
        </SegmentedControlItem>
      </SegmentedControl>
      <ChartHeader eyebrow="Range" value={`${shown.low}–${shown.high}`} unit="BPM" detail={shown.when} />
      <EChart
        option={option}
        height={220}
        onScrub={setScrub}
        scrub={{
          label: "Heart rate",
          count: data.low.length,
          valueText: (i) => `${data.low[i]} to ${data.high[i]} BPM, ${data.names[i]}`,
        }}
      />
    </ChartFrame>
  )
}
