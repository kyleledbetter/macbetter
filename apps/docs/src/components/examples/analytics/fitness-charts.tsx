"use client"

import * as React from "react"
import { baseOption, categoryAxis, ChartFrame, ChartHeader, EChart, echarts, useEvilChart, type ChartColor, type ChartTheme, type Scrub } from "@/components/charts"
import { EChartsAreaChart } from "@/components/charts/evil/charts/echarts-area-chart"
import { hourLabel } from "./numbers"
import { clock, heartRate, monthly, months, zoneMinutes, zoneOf, zones, type Day, type Workout } from "./fitness-data"

/* Fitness's charts: the hours of a day, a workout's heart rate by zone, and a year of Exercise. */

const hours = Array.from({ length: 24 }, (_, h) => hourLabel(h))
const tickLabels = hours.map((label, h) => (h % 6 === 0 ? (h % 12 === 0 ? label : String(h % 12)) : ""))

function Strip({ values, color, max, axis, missed }: { values: readonly number[]; color: ChartColor; max: number; axis?: boolean; missed?: boolean }) {
  const option = React.useCallback(
    (theme: ChartTheme) => ({
      ...baseOption(theme),
      grid: { left: 0, right: 0, top: 2, bottom: axis ? 20 : 2 },
      xAxis: categoryAxis(theme, tickLabels, {
        axisLabel: { show: axis, color: theme.colors.axis, fontSize: theme.fontSize, interval: (i: number) => tickLabels[i] !== "", align: "left" },
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
            value: missed && v === 0 && h >= 7 && h <= 21 ? max : Math.min(v, max),
            itemStyle: { color: missed && v === 0 ? theme.colors.fill : theme.colors[color] },
          })),
          itemStyle: { borderRadius: 2 },
          emphasis: { disabled: true },
        },
      ],
    }),
    [values, color, max, axis, missed]
  )
  return <EChart option={option} height={axis ? 58 : 38} />
}

/** Move, Exercise and Stand for each hour of a day, as three strips on one time axis. */
function HourlyStrips({ day }: { day: Day }) {
  const { move, exercise, stood } = day.hourly
  const rows = [
    { label: "Move", total: `${day.move}/${day.rings.move.goal}`, unit: "KCAL", color: "move", values: move, max: Math.max(...move) },
    { label: "Exercise", total: `${day.exercise}/${day.rings.exercise.goal}`, unit: "MIN", color: "exercise", values: exercise, max: Math.max(12, ...exercise) },
    { label: "Stand", total: `${day.stand}/${day.rings.stand.goal}`, unit: "HRS", color: "stand", values: stood, max: 1 },
  ] as const
  const busiest = move.indexOf(Math.max(...move))
  return (
    <ChartFrame
      title={`Activity by hour, ${day.name}`}
      summary={`The busiest hour was ${hourLabel(busiest)}, with ${move[busiest]} kilocalories. You stood in ${day.stand} hours.`}
      table={{
        columns: ["Hour", "Move (kcal)", "Exercise (min)", "Stood"],
        rows: hours.map((hour, h) => [hour, move[h]!, exercise[h]!, stood[h] ? "Yes" : "No"]),
      }}
      className="ex-fit-strips"
    >
      {rows.map((row, i) => (
        <div key={row.label} className="ex-fit-strip">
          <div className="ex-fit-strip-label">
            {row.label} <span style={{ color: `var(--mb-chart-${row.color})` }}>{row.total} {row.unit}</span>
          </div>
          <Strip values={row.values} color={row.color} max={row.max} axis={i === rows.length - 1} missed={row.label === "Stand"} />
        </div>
      ))}
    </ChartFrame>
  )
}

/** A workout's heart rate, the line colored by zone, and the time spent in each zone. */
function WorkoutZones({ workout, compact }: { workout: Workout; compact?: boolean }) {
  const [scrub, setScrub] = React.useState<Scrub | null>(null)
  const series = React.useMemo(() => heartRate(workout), [workout])
  const minutes = React.useMemo(() => zoneMinutes(series), [series])
  const average = Math.round(series.reduce((a, b) => a + b, 0) / series.length)
  const peak = Math.max(...series)
  const most = minutes.indexOf(Math.max(...minutes))

  const line = React.useCallback(
    (theme: ChartTheme) => {
      const low = Math.min(...series)
      const high = Math.max(...series)
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
      const every = Math.max(10, Math.round(workout.minutes / 4 / 5) * 5) * 2
      return {
        ...baseOption(theme),
        grid: { left: 0, right: 34, top: 8, bottom: 22 },
        xAxis: {
          type: "category",
          data: series.map((_, i) => i / 2),
          boundaryGap: false,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: theme.colors.axis, fontSize: theme.fontSize, interval: every - 1, formatter: (m: string) => `${m} min` },
        },
        yAxis: {
          type: "value",
          position: "right",
          min: 60,
          max: 180,
          interval: 40,
          axisLabel: { color: theme.colors.axis, fontSize: theme.fontSize },
          splitLine: { lineStyle: { color: theme.colors.grid } },
        },
        series: [
          {
            id: "heart-rate",
            type: "line",
            data: series,
            smooth: 0.3,
            showSymbol: false,
            lineStyle: { width: 2.5, cap: "round", color: new echarts.graphic.LinearGradient(0, 1, 0, 0, stops) },
          },
        ],
      }
    },
    [series, workout.minutes]
  )

  const bars = React.useCallback(
    (theme: ChartTheme) => ({
      ...baseOption(theme),
      grid: { left: 0, right: 44, top: 0, bottom: 0 },
      xAxis: { type: "value", show: false, max: Math.max(...minutes, 1) * 1.05 },
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
          barWidth: 9,
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
    [minutes]
  )

  return (
    <ChartFrame
      title={`Heart rate zones, ${workout.name}`}
      summary={`A ${workout.minutes}-minute ${workout.name.toLowerCase()} averaging ${average} BPM, peaking at ${peak}. Most of it, ${clock(minutes[most]!)}, was in ${zones[most]!.name}.`}
      table={{ columns: ["Zone", "Heart rate", "Time"], rows: zones.map((z, i) => [z.name, z.range, clock(minutes[i]!)]) }}
      className="ex-fit-zones"
    >
      {scrub ? (
        <ChartHeader eyebrow="Heart rate" value={series[scrub.index]} unit="BPM" detail={`${clock(scrub.index / 2)} into the workout · ${zones[zoneOf(series[scrub.index]!)]!.name}`} />
      ) : (
        <ChartHeader eyebrow="Average heart rate" value={average} unit="BPM" detail={`Peak ${peak} BPM`} />
      )}
      <div className="ex-fit-zones-body">
        <EChart
          option={line}
          height={compact ? 130 : 160}
          onScrub={setScrub}
          scrub={{
            label: "Heart rate during the workout",
            count: series.length,
            valueText: (i) => `${series[i]} BPM at ${clock(i / 2)} into the workout, ${zones[zoneOf(series[i]!)]!.name}`,
          }}
        />
        <EChart option={bars} height={compact ? 170 : 180} />
      </div>
    </ChartFrame>
  )
}

const areaSeries = { exercise: { label: "Exercise minutes a day", color: "exercise" } } as const
const areaData = months.map((month, i) => ({ month, exercise: monthly.exercise[i]! }))

/** The year of Exercise, as daily averages by month. */
function ExerciseYear({ height = 170 }: { height?: number }) {
  const { ref, config, chartOptions } = useEvilChart(areaSeries)
  const first = areaData[0]!
  const last = areaData.at(-1)!
  return (
    <ChartFrame
      ref={ref}
      title="Exercise minutes a day, by month"
      summary={`Daily Exercise rose from ${first.exercise} minutes in December 2025 to ${last.exercise} in November 2026.`}
      table={{ columns: ["Month", "Minutes a day"], rows: areaData.map((d) => [d.month, d.exercise]) }}
      className="ex-fit-year"
    >
      <ChartHeader eyebrow="Exercise, daily average" value={last.exercise} unit="min" detail={`November, up from ${first.exercise} min in December`} />
      <div style={{ height }}>
        {config && chartOptions ? (
          <EChartsAreaChart data={areaData} config={config} chartOptions={chartOptions} xDataKey="month" curveType="monotone" className="h-full w-full">
            <EChartsAreaChart.Grid />
            <EChartsAreaChart.XAxis dataKey="month" hideDots />
            <EChartsAreaChart.YAxis hideDots />
            <EChartsAreaChart.Tooltip roundness="lg" />
            <EChartsAreaChart.Area dataKey="exercise" variant="gradient" strokeVariant="solid" strokeWidth={2.5}>
              <EChartsAreaChart.ActiveDot variant="border" />
            </EChartsAreaChart.Area>
          </EChartsAreaChart>
        ) : null}
      </div>
    </ChartFrame>
  )
}

export { ExerciseYear, HourlyStrips, WorkoutZones }
