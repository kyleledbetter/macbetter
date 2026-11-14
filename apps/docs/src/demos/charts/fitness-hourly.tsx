"use client"

import * as React from "react"
import { baseOption, categoryAxis, ChartFrame, EChart, type ChartColor, type ChartTheme } from "@/components/charts"

/** Today, hour by hour. Stand is whether you stood for a minute in that hour. */
const move = [0, 0, 0, 0, 0, 0, 8, 46, 62, 18, 12, 24, 38, 16, 14, 12, 58, 84, 41, 22, 15, 9, 4, 0]
const exercise = [0, 0, 0, 0, 0, 0, 0, 9, 11, 0, 0, 2, 4, 0, 0, 0, 5, 7, 0, 0, 0, 0, 0, 0]
const stood = [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0]
const hours = Array.from({ length: 24 }, (_, h) => `${h % 12 || 12} ${h < 12 ? "AM" : "PM"}`)
const labels = hours.map((label, h) => (h % 6 === 0 ? (h % 12 === 0 ? label : String(h % 12)) : ""))

function Strip({ values, color, max, axis, missed }: { values: readonly number[]; color: ChartColor; max: number; axis?: boolean; missed?: boolean }) {
  const option = React.useCallback(
    (theme: ChartTheme) => ({
      ...baseOption(theme),
      grid: { left: 0, right: 0, top: 2, bottom: axis ? 20 : 2 },
      xAxis: categoryAxis(theme, labels, {
        axisLabel: { show: axis, color: theme.colors.axis, fontSize: theme.fontSize, interval: (i: number) => labels[i] !== "", align: "left" },
        splitLine: { show: true, interval: (i: number) => i > 0 && i % 6 === 0, lineStyle: { color: theme.colors.grid, type: [2, 3] } },
      }),
      yAxis: { type: "value", show: false, max },
      series: [
        {
          id: "hours",
          type: "bar",
          barWidth: "56%",
          // A missed stand hour during the day still gets a gray bar, so the gaps read as gaps.
          data: values.map((v, h) => ({
            value: missed && v === 0 && h >= 7 && h <= 21 ? max : v,
            itemStyle: { color: missed && v === 0 ? theme.colors.fill : theme.colors[color] },
          })),
          itemStyle: { borderRadius: 2 },
          emphasis: { disabled: true },
        },
      ],
    }),
    [values, color, max, axis, missed]
  )
  return <EChart option={option} height={axis ? 62 : 42} />
}

const rows = [
  { label: "Move", total: "486/600", unit: "KCAL", color: "move", values: move, max: 90 },
  { label: "Exercise", total: "38/30", unit: "MIN", color: "exercise", values: exercise, max: 12 },
  { label: "Stand", total: "10/12", unit: "HRS", color: "stand", values: stood, max: 1 },
] as const

export default function HourlyActivity() {
  return (
    <ChartFrame
      title="Activity by hour, today"
      summary="Most of today's Move and Exercise came from walks at 8 AM and 5 PM. You stood in 10 of 12 hours."
      table={{
        columns: ["Hour", "Move (kcal)", "Exercise (min)", "Stood"],
        rows: hours.map((hour, h) => [hour, move[h]!, exercise[h]!, stood[h] ? "Yes" : "No"]),
      }}
      style={{ width: "100%", maxWidth: 520, gap: 14 }}
    >
      {rows.map((row, i) => (
        <div key={row.label} style={{ display: "grid", gap: 4 }}>
          <div style={{ font: "var(--mb-text-subheadline)", fontWeight: 600 }}>
            {row.label}{" "}
            <span style={{ color: `var(--mb-chart-${row.color})`, fontFamily: "var(--mb-font-rounded)", fontVariantNumeric: "tabular-nums" }}>
              {row.total} {row.unit}
            </span>
          </div>
          <Strip values={row.values} color={row.color} max={row.max} axis={i === rows.length - 1} missed={row.label === "Stand"} />
        </div>
      ))}
    </ChartFrame>
  )
}
