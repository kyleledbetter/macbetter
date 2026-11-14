"use client"

import * as React from "react"
import { baseOption, ChartFrame, ChartHeader, ChartLegend, EChart, echarts, type ChartColor, type ChartTheme } from "@/components/charts"

const stages = [
  { name: "Deep", color: "deep" },
  { name: "Core", color: "core" },
  { name: "REM", color: "rem" },
  { name: "Awake", color: "awake" },
] as const satisfies { name: string; color: ChartColor }[]

type Stage = (typeof stages)[number]["name"]

/** Thursday night into Friday: each stage with its start and end, in minutes after 10 PM. */
const night: [Stage, number, number][] = [
  ["Awake", 72, 80], ["Core", 80, 110], ["Deep", 110, 150], ["Core", 150, 185], ["REM", 185, 205],
  ["Core", 205, 240], ["Deep", 240, 268], ["Core", 268, 300], ["Awake", 300, 304], ["Core", 304, 340],
  ["REM", 340, 372], ["Core", 372, 410], ["Deep", 410, 425], ["Core", 425, 455], ["REM", 455, 490],
  ["Awake", 490, 494], ["Core", 494, 512], ["REM", 512, 520], ["Awake", 520, 528],
]

const row = (stage: Stage) => stages.findIndex((s) => s.name === stage)
const clock = (minutes: number) => {
  const h = (22 + Math.floor(minutes / 60)) % 24
  return `${h % 12 || 12}:${String(minutes % 60).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`
}
const duration = (minutes: number) => (minutes >= 60 ? `${Math.floor(minutes / 60)} hr ${minutes % 60} min` : `${minutes} min`)
const totals = Object.fromEntries(
  stages.map((s) => [s.name, night.filter(([stage]) => stage === s.name).reduce((sum, [, a, b]) => sum + b - a, 0)])
) as Record<Stage, number>
const asleep = totals.Deep + totals.Core + totals.REM

type Api = { value: (dim: number) => number; coord: (point: number[]) => number[]; size: (point: number[]) => number[] }

export default function SleepStagesChart() {
  const option = React.useCallback((theme: ChartTheme) => {
    const paint = stages.map((s) => theme.colors[s.color])
    return {
      ...baseOption(theme),
      grid: { left: 44, right: 8, top: 4, bottom: 24 },
      xAxis: {
        type: "value",
        min: 60,
        max: 540,
        interval: 120,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: theme.colors.axis, fontSize: theme.fontSize, formatter: (m: number) => clock(m).replace(":00", "") },
        splitLine: { lineStyle: { color: theme.colors.grid, type: [2, 3] } },
      },
      yAxis: {
        type: "category",
        data: stages.map((s) => s.name),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: theme.colors.axis, fontSize: theme.fontSize, align: "left", margin: 44 },
        splitLine: { show: true, lineStyle: { color: theme.colors.grid } },
      },
      series: [
        {
          // Hairlines that join one stage to the next, shaded from one color to the other.
          id: "transitions",
          type: "custom",
          silent: true,
          data: night.slice(1).map(([stage, start], i) => [start, row(night[i]![0]), row(stage)]),
          renderItem: (_: unknown, api: Api) => {
            const from = api.coord([api.value(0), api.value(1)])
            const to = api.coord([api.value(0), api.value(2)])
            return {
              type: "line",
              shape: { x1: from[0], y1: from[1], x2: to[0], y2: to[1] },
              style: {
                lineWidth: 1,
                stroke: new echarts.graphic.LinearGradient(from[0]!, from[1]!, to[0]!, to[1]!, [
                  { offset: 0, color: paint[api.value(1)]! },
                  { offset: 1, color: paint[api.value(2)]! },
                ], true),
                opacity: 0.7,
              },
            }
          },
        },
        {
          id: "stages",
          type: "custom",
          data: night.map(([stage, start, end]) => [start, end, row(stage)]),
          renderItem: (_: unknown, api: Api) => {
            const start = api.coord([api.value(0), api.value(2)])
            const end = api.coord([api.value(1), api.value(2)])
            const height = api.size([0, 1])[1]! * 0.62
            return {
              type: "rect",
              shape: { x: start[0], y: start[1]! - height / 2, width: Math.max(end[0]! - start[0]!, 3), height, r: 4 },
              style: { fill: paint[api.value(2)] },
            }
          },
        },
      ],
    }
  }, [])

  return (
    <ChartFrame
      title="Sleep stages, Thursday night"
      summary={`Asleep ${duration(asleep)}, from ${clock(80)} to ${clock(528)}. Deep ${duration(totals.Deep)}, Core ${duration(totals.Core)}, REM ${duration(totals.REM)}, awake ${duration(totals.Awake)}.`}
      table={{ columns: ["Stage", "From", "To"], rows: night.map(([stage, a, b]) => [stage, clock(a), clock(b)]) }}
      style={{ width: "100%", maxWidth: 560 }}
    >
      <ChartHeader
        eyebrow="Time asleep"
        value={
          <>
            {Math.floor(asleep / 60)}
            <span className="sd-chart-unit"> hr </span>
            {asleep % 60}
          </>
        }
        unit="min"
        detail="Nov 12–13, 2026"
      />
      <EChart option={option} height={200} />
      <ChartLegend
        items={[...stages].reverse().map((s) => ({ label: s.name, color: `var(--sd-chart-${s.color})`, value: duration(totals[s.name]), shape: "bar" }))}
      />
    </ChartFrame>
  )
}
