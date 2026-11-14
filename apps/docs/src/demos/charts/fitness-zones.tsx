"use client"

import * as React from "react"
import { baseOption, ChartFrame, ChartHeader, EChart, echarts, type ChartColor, type ChartTheme } from "@/components/charts"

/** Heart rate zones for this runner, with Apple Watch's colors. */
const zones = [
  { name: "Zone 1", range: "<125 BPM", from: 0, color: "cyan" },
  { name: "Zone 2", range: "125–137 BPM", from: 125, color: "green" },
  { name: "Zone 3", range: "138–150 BPM", from: 138, color: "yellow" },
  { name: "Zone 4", range: "151–163 BPM", from: 151, color: "orange" },
  { name: "Zone 5", range: "164+ BPM", from: 164, color: "pink" },
] as const satisfies { name: string; range: string; from: number; color: ChartColor }[]

/** A 42-minute outdoor run, every 30 seconds: warm-up, tempo, two hard intervals, cool-down. */
const heartRate = Array.from({ length: 85 }, (_, i) => {
  const t = i / 2
  const base = t < 6 ? 108 + t * 6 : t < 36 ? 146 + Math.sin(t * 0.8) * 4 : 146 - (t - 36) * 5
  const interval = (t > 20 && t < 24) || (t > 28 && t < 32) ? 18 : 0
  return Math.round(base + interval + Math.sin(i * 1.3) * 2)
})
const zoneOf = (bpm: number) => zones.findLastIndex((z) => bpm >= z.from)
const minutes = zones.map((_, z) => heartRate.filter((bpm) => zoneOf(bpm) === z).length / 2)
const clock = (m: number) => `${Math.floor(m)}:${String(Math.round((m % 1) * 60)).padStart(2, "0")}`
const average = Math.round(heartRate.reduce((a, b) => a + b, 0) / heartRate.length)

export default function WorkoutZones() {
  const line = React.useCallback((theme: ChartTheme) => {
    const low = Math.min(...heartRate)
    const high = Math.max(...heartRate)
    // Hard color stops at each zone boundary, mapped onto the line's own height.
    const stops = zones.flatMap((zone, z) => {
      const start = Math.min(Math.max((zone.from - low) / (high - low), 0), 1)
      const end = z < zones.length - 1 ? Math.min(Math.max((zones[z + 1]!.from - low) / (high - low), 0), 1) : 1
      const color = theme.colors[zone.color]
      return [
        { offset: start, color },
        { offset: end, color },
      ]
    })
    return {
      ...baseOption(theme),
      grid: { left: 0, right: 34, top: 8, bottom: 22 },
      xAxis: {
        type: "category",
        data: heartRate.map((_, i) => i / 2),
        boundaryGap: false,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: theme.colors.axis, fontSize: theme.fontSize, interval: 19, formatter: (m: string) => `${m} min` },
      },
      yAxis: {
        type: "value",
        position: "right",
        min: 100,
        max: 180,
        interval: 40,
        axisLabel: { color: theme.colors.axis, fontSize: theme.fontSize },
        splitLine: { lineStyle: { color: theme.colors.grid } },
      },
      series: [
        {
          id: "heart-rate",
          type: "line",
          data: heartRate,
          smooth: 0.3,
          showSymbol: false,
          lineStyle: { width: 2.5, cap: "round", color: new echarts.graphic.LinearGradient(0, 1, 0, 0, stops) },
        },
      ],
    }
  }, [])

  const bars = React.useCallback(
    (theme: ChartTheme) => ({
      ...baseOption(theme),
      grid: { left: 0, right: 40, top: 0, bottom: 0 },
      xAxis: { type: "value", show: false, max: Math.max(...minutes) * 1.05 },
      yAxis: {
        type: "category",
        inverse: true,
        data: zones.map((z) => z.name),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          margin: 12,
          formatter: (name: string) => `{zone|${name}}\n{range|${zones.find((z) => z.name === name)!.range}}`,
          rich: {
            zone: { color: theme.colors.label, fontSize: theme.fontSize + 2, fontWeight: 600, lineHeight: theme.fontSize + 6 },
            range: { color: theme.colors.axis, fontSize: theme.fontSize, lineHeight: theme.fontSize + 4 },
          },
        },
      },
      series: [
        {
          id: "minutes",
          type: "bar",
          barWidth: 10,
          data: minutes.map((m, z) => ({ value: m, itemStyle: { color: theme.colors[zones[z]!.color] } })),
          itemStyle: { borderRadius: 99 },
          showBackground: true,
          backgroundStyle: { color: theme.colors.fill4, borderRadius: 99 },
          label: {
            show: true,
            position: "right",
            distance: 8,
            color: theme.colors.label,
            fontSize: theme.fontSize + 1,
            fontWeight: 600,
            formatter: ({ value }: { value: number }) => clock(value),
          },
          emphasis: { disabled: true },
        },
      ],
    }),
    []
  )

  return (
    <ChartFrame
      title="Heart rate zones, outdoor run"
      summary={`A 42-minute run averaging ${average} BPM. Most of it, ${clock(Math.max(...minutes))}, was in ${zones[minutes.indexOf(Math.max(...minutes))]!.name}.`}
      table={{ columns: ["Zone", "Heart rate", "Time"], rows: zones.map((z, i) => [z.name, z.range, clock(minutes[i]!)]) }}
      style={{ width: "100%", maxWidth: 520 }}
    >
      <ChartHeader eyebrow="Average heart rate" value={average} unit="BPM" detail="Outdoor Run · 42 min" />
      <EChart option={line} height={150} />
      <EChart option={bars} height={190} />
    </ChartFrame>
  )
}
