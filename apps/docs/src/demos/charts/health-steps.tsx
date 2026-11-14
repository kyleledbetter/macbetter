"use client"

import { SegmentedControl, SegmentedControlItem } from "@dreambase/stardust/segmented-control"
import * as React from "react"
import { baseOption, categoryAxis, ChartFrame, ChartHeader, EChart, formatters, valueAxis, type ChartTheme, type Scrub } from "@/components/charts"

type Period = "D" | "W" | "M" | "6M" | "Y"

/** Steps for Saturday, November 14, 2026 and the periods before it. */
const steps: Record<Period, { labels: string[]; ticks: number[]; values: number[]; dates: string[]; range: string }> = {
  D: {
    labels: ["12 AM", "", "", "", "", "", "6", "", "", "", "", "", "12 PM", "", "", "", "", "", "6", "", "", "", "", ""],
    ticks: [0, 6, 12, 18],
    values: [0, 0, 0, 0, 0, 0, 112, 864, 1420, 388, 210, 642, 1190, 455, 302, 268, 980, 1640, 720, 312, 184, 96, 0, 0],
    dates: Array.from({ length: 24 }, (_, h) => `${h % 12 || 12}–${(h + 1) % 12 || 12} ${h + 1 < 12 || h + 1 === 24 ? "AM" : "PM"}`),
    range: "Today",
  },
  W: {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    ticks: [0, 1, 2, 3, 4, 5, 6],
    values: [6412, 9832, 7120, 11204, 8530, 7980, 6421],
    dates: ["Sun, Nov 8", "Mon, Nov 9", "Tue, Nov 10", "Wed, Nov 11", "Thu, Nov 12", "Fri, Nov 13", "Today"],
    range: "Nov 8–14, 2026",
  },
  M: {
    labels: Array.from({ length: 30 }, (_, i) => (i % 7 === 0 ? String(((i + 15) % 31) + 1) : "")),
    ticks: [0, 7, 14, 21, 28],
    values: [8120, 7311, 9954, 6203, 5480, 10422, 8805, 7650, 9120, 8302, 6127, 12040, 7765, 8410, 9302, 6650, 5980, 11210, 8034, 7480, 9933, 8320, 6412, 9832, 7120, 11204, 8530, 7980, 6421, 4210],
    dates: Array.from({ length: 30 }, (_, i) => {
      const date = new Date(2026, 9, 16 + i)
      return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
    }),
    range: "Oct 16–Nov 14, 2026",
  },
  "6M": {
    labels: Array.from({ length: 26 }, (_, i) => {
      const date = new Date(2026, 4, 17 + i * 7)
      return date.getDate() <= 7 ? date.toLocaleDateString("en-US", { month: "short" }) : ""
    }),
    ticks: [],
    values: [6980, 7210, 7544, 8102, 7720, 8340, 8611, 9020, 8790, 8455, 7980, 8230, 8875, 9310, 9104, 8650, 8220, 7905, 8433, 8701, 8920, 8312, 7840, 8105, 8540, 8214],
    dates: Array.from({ length: 26 }, (_, i) => {
      const start = new Date(2026, 4, 17 + i * 7)
      return `Week of ${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
    }),
    range: "May 17–Nov 14, 2026",
  },
  Y: {
    labels: ["D", "J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N"],
    ticks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    values: [6120, 6480, 6902, 7340, 7810, 8420, 9105, 9380, 8960, 8510, 8302, 8214],
    dates: ["December 2025", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November"],
    range: "Dec 2025–Nov 2026",
  },
}

export default function StepsChart() {
  const [period, setPeriod] = React.useState<Period>("W")
  const [scrub, setScrub] = React.useState<Scrub | null>(null)
  const data = steps[period]
  const total = data.values.reduce((a, b) => a + b, 0)
  const average = Math.round(total / data.values.length)
  // A day's total, or the daily average over a longer period; 6M and Y bars are already averages.
  const headline = period === "D" ? total : average

  const option = React.useCallback(
    (theme: ChartTheme) => ({
      ...baseOption(theme),
      grid: { left: 0, right: 40, top: 8, bottom: 24 },
      xAxis: categoryAxis(theme, data.labels, {
        axisLabel: {
          color: theme.colors.axis,
          fontSize: theme.fontSize,
          interval: (i: number) => data.labels[i] !== "",
          align: period === "W" || period === "Y" ? "center" : "left",
        },
        splitLine: {
          show: true,
          interval: (i: number) => data.ticks.includes(i) && i > 0,
          lineStyle: { color: theme.colors.grid, type: [2, 3] },
        },
      }),
      yAxis: valueAxis(theme, { splitNumber: 3 }),
      series: [
        {
          id: "steps",
          type: "bar",
          data: data.values,
          barWidth: period === "D" ? "58%" : period === "M" ? "62%" : "56%",
          itemStyle: { color: theme.colors.orange, borderRadius: [3, 3, 0, 0] },
          emphasis: { disabled: true },
        },
      ],
    }),
    [data, period]
  )

  const index = scrub?.index
  return (
    <ChartFrame
      title={`Steps, ${data.range}`}
      summary={`${period === "D" ? "Total" : "Daily average"}: ${formatters.integer.format(headline)} steps. Highest: ${formatters.integer.format(Math.max(...data.values))}.`}
      table={{ columns: ["Period", "Steps"], rows: data.values.map((v, i) => [data.dates[i]!, formatters.integer.format(v)]) }}
      style={{ width: "100%", maxWidth: 560 }}
    >
      <SegmentedControl size="sm" block aria-label="Period" value={period} onValueChange={(v) => v && setPeriod(v as Period)}>
        {(["D", "W", "M", "6M", "Y"] as const).map((p) => (
          <SegmentedControlItem key={p} value={p} aria-label={{ D: "Day", W: "Week", M: "Month", "6M": "6 months", Y: "Year" }[p]}>
            {p}
          </SegmentedControlItem>
        ))}
      </SegmentedControl>
      <ChartHeader
        eyebrow={index === undefined ? (period === "D" ? "Total" : "Average") : period === "6M" || period === "Y" ? "Average" : "Total"}
        value={formatters.integer.format(index === undefined ? headline : data.values[index]!)}
        unit="steps"
        detail={index === undefined ? data.range : data.dates[index]}
      />
      <EChart
        option={option}
        height={220}
        onScrub={setScrub}
        scrub={{
          label: "Steps",
          count: data.values.length,
          valueText: (i) => `${formatters.integer.format(data.values[i]!)} steps, ${data.dates[i]}`,
        }}
      />
    </ChartFrame>
  )
}
