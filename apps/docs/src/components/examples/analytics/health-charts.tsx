"use client"

import * as React from "react"
import {
  alpha,
  baseOption,
  categoryAxis,
  ChartFrame,
  ChartHeader,
  ChartLegend,
  EChart,
  echarts,
  formatters,
  valueAxis,
  type ChartTheme,
  type Scrub,
} from "@/components/charts"
import {
  asleep,
  clock,
  duration,
  healthPeriods,
  heartFor,
  night,
  stageTotals,
  stages,
  stepsFor,
  trendDays,
  trendMean,
  trendWeekly,
  typical,
  type HealthPeriod,
  type Stage,
} from "./health-data"

/*
 * Health's charts: a header that follows the scrub (what, how much, when),
 * the drawing under it, and nothing on the plot but the marks.
 */

const periodName = (period: HealthPeriod) => healthPeriods.find((p) => p.value === period)!.long

/** Category axis labels for a period: hours lead their tick, days and months sit under their bar. */
function periodAxis(theme: ChartTheme, labels: string[], ticks: number[], period: HealthPeriod) {
  return categoryAxis(theme, labels, {
    axisLabel: {
      color: theme.colors.axis,
      fontSize: theme.fontSize,
      interval: (i: number) => labels[i] !== "",
      align: period === "W" || period === "Y" ? "center" : "left",
    },
    splitLine: {
      show: ticks.length > 0,
      interval: (i: number) => ticks.includes(i),
      lineStyle: { color: theme.colors.grid, type: [2, 3] },
    },
  })
}

function StepsChart({ period, height = 220 }: { period: HealthPeriod; height?: number }) {
  const [scrub, setScrub] = React.useState<Scrub | null>(null)
  const data = React.useMemo(() => stepsFor(period), [period])
  const total = data.values.reduce((a, b) => a + b, 0)
  // A day's total, or the daily average over a longer period; 6M and Y bars are already averages.
  const headline = period === "D" ? total : Math.round(total / data.values.length)

  const option = React.useCallback(
    (theme: ChartTheme) => ({
      ...baseOption(theme),
      grid: { left: 0, right: 40, top: 8, bottom: 24 },
      xAxis: periodAxis(theme, data.labels, data.ticks, period),
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
  const longPeriod = period === "6M" || period === "Y"
  return (
    <ChartFrame
      title={`Steps, ${data.range}`}
      summary={`${period === "D" ? "Total" : "Daily average"}: ${formatters.integer.format(headline)} steps. Highest ${longPeriod ? "average" : period === "D" ? "hour" : "day"}: ${formatters.integer.format(Math.max(...data.values))}.`}
      table={{ columns: [period === "D" ? "Hour" : "Period", longPeriod ? "Average steps a day" : "Steps"], rows: data.values.map((v, i) => [data.names[i]!, formatters.integer.format(v)]) }}
    >
      <ChartHeader
        eyebrow={index === undefined ? (period === "D" ? "Total" : "Average") : longPeriod ? "Average" : "Total"}
        value={formatters.integer.format(index === undefined ? headline : data.values[index]!)}
        unit="steps"
        detail={index === undefined ? data.range : data.names[index]}
      />
      <EChart
        option={option}
        height={height}
        onScrub={setScrub}
        scrub={{ label: `Steps by ${periodName(period).toLowerCase()}`, count: data.values.length, valueText: (i) => `${formatters.integer.format(data.values[i]!)} steps, ${data.names[i]}` }}
      />
    </ChartFrame>
  )
}

function HeartRateChart({ period, height = 200 }: { period: HealthPeriod; height?: number }) {
  const [scrub, setScrub] = React.useState<Scrub | null>(null)
  const data = React.useMemo(() => heartFor(period), [period])
  const low = Math.min(...data.low)
  const high = Math.max(...data.high)

  const option = React.useCallback(
    (theme: ChartTheme) => ({
      ...baseOption(theme),
      grid: { left: 0, right: 34, top: 8, bottom: 24 },
      xAxis: periodAxis(theme, data.labels, data.ticks, period),
      yAxis: valueAxis(theme, { min: 40, max: 200, interval: 40, axisLabel: { color: theme.colors.axis, fontSize: theme.fontSize } }),
      series: [
        // An invisible bar lifts each capsule to the period's lowest reading.
        { id: "base", type: "bar", stack: "range", data: data.low, itemStyle: { color: "transparent" }, emphasis: { disabled: true } },
        {
          id: "range",
          type: "bar",
          stack: "range",
          data: data.high.map((h, i) => h - data.low[i]!),
          barWidth: period === "D" || period === "M" ? 6 : period === "6M" ? 7 : 11,
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
      summary={`Heart rate ranged from ${low} to ${high} beats per minute. The highest readings came during workouts.`}
      table={{ columns: ["Period", "Lowest (BPM)", "Highest (BPM)"], rows: data.names.map((name, i) => [name, data.low[i]!, data.high[i]!]) }}
    >
      <ChartHeader eyebrow="Range" value={`${shown.low}–${shown.high}`} unit="BPM" detail={shown.when} />
      <EChart
        option={option}
        height={height}
        onScrub={setScrub}
        scrub={{ label: "Heart rate", count: data.low.length, valueText: (i) => `${data.low[i]} to ${data.high[i]} BPM, ${data.names[i]}` }}
      />
    </ChartFrame>
  )
}

const row = (stage: Stage) => stages.findIndex((s) => s.name === stage)

type Api = { value: (dim: number) => number; coord: (point: number[]) => number[]; size: (point: number[]) => number[] }

function SleepChart({ height = 180 }: { height?: number }) {
  const option = React.useCallback((theme: ChartTheme) => {
    const paint = stages.map((s) => theme.colors[s.color])
    return {
      ...baseOption(theme),
      grid: { left: 48, right: 8, top: 4, bottom: 24 },
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
        axisLabel: { color: theme.colors.axis, fontSize: theme.fontSize, align: "left", margin: 48 },
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
            const size = api.size([0, 1])[1]! * 0.62
            return {
              type: "rect",
              shape: { x: start[0], y: start[1]! - size / 2, width: Math.max(end[0]! - start[0]!, 3), height: size, r: 4 },
              style: { fill: paint[api.value(2)] },
            }
          },
        },
      ],
    }
  }, [])

  return (
    <ChartFrame
      title="Sleep stages, Friday night"
      summary={`Asleep ${duration(asleep)}, from ${clock(68)} to ${clock(528)}. Deep ${duration(stageTotals.Deep)}, Core ${duration(stageTotals.Core)}, REM ${duration(stageTotals.REM)}, awake ${duration(stageTotals.Awake)}.`}
      table={{ columns: ["Stage", "From", "To"], rows: night.map(([stage, a, b]) => [stage, clock(a), clock(b)]) }}
    >
      <ChartHeader
        eyebrow="Time asleep"
        value={
          <>
            {Math.floor(asleep / 60)}
            <span className="mb-chart-unit"> hr </span>
            {asleep % 60}
          </>
        }
        unit="min"
        detail="Nov 13–14, 2026"
      />
      <EChart option={option} height={height} />
      <ChartLegend
        items={[...stages].reverse().map((s) => ({ label: s.name, color: `var(--mb-chart-${s.color})`, value: duration(stageTotals[s.name]), shape: "bar" }))}
      />
    </ChartFrame>
  )
}

const short = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" })
const trendLabels = trendDays.map((d) => (d.date.getDate() === 1 ? d.date.toLocaleDateString("en-US", { month: "short" }) : ""))

function RestingTrend({ height = 180 }: { height?: number }) {
  const [scrub, setScrub] = React.useState<Scrub | null>(null)
  const option = React.useCallback(
    (theme: ChartTheme) => ({
      ...baseOption(theme),
      grid: { left: 0, right: 30, top: 8, bottom: 24 },
      xAxis: categoryAxis(theme, trendLabels, {
        boundaryGap: false,
        axisLabel: { color: theme.colors.axis, fontSize: theme.fontSize, interval: (i: number) => trendLabels[i] !== "", align: "left" },
        splitLine: { show: true, interval: (i: number) => trendLabels[i] !== "", lineStyle: { color: theme.colors.grid, type: [2, 3] } },
      }),
      yAxis: valueAxis(theme, { min: 50, max: 66, interval: 4 }),
      series: [
        {
          id: "days",
          type: "scatter",
          data: trendDays.map((d) => d.bpm),
          symbolSize: 4,
          itemStyle: { color: alpha(theme.colors.pink, 0.45) },
          emphasis: { disabled: true },
          silent: true,
        },
        {
          id: "average",
          type: "line",
          data: trendWeekly,
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
            data: [{ yAxis: +trendMean.toFixed(1) }],
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
      summary={`Your resting heart rate averaged ${Math.round(trendMean)} BPM and fell from about ${Math.round(trendWeekly[6]!)} to ${Math.round(trendWeekly.at(-1)!)} BPM over 90 days. Your typical range is ${typical[0]} to ${typical[1]} BPM.`}
      table={{
        columns: ["Week ending", "Resting (BPM)", "7-day average"],
        rows: trendDays.flatMap((d, i) => (i % 7 === 6 ? [[short.format(d.date), d.bpm, trendWeekly[i]!]] : [])),
      }}
    >
      <ChartHeader
        eyebrow={index === undefined ? "Average" : "7-day average"}
        value={index === undefined ? Math.round(trendMean) : trendWeekly[index]}
        unit="BPM"
        detail={index === undefined ? `${short.format(trendDays[0]!.date)}–${short.format(trendDays.at(-1)!.date)}, 2026` : short.format(trendDays[index]!.date)}
      />
      <EChart
        option={option}
        height={height}
        onScrub={setScrub}
        scrub={{ label: "Resting heart rate", count: trendDays.length, valueText: (i) => `${trendWeekly[i]} BPM 7-day average, ${short.format(trendDays[i]!.date)}` }}
      />
      <ChartLegend
        items={[
          { label: "7-day average", color: "var(--mb-pink)", shape: "line" },
          { label: "Daily", color: "color-mix(in oklch, var(--mb-pink) 50%, transparent)" },
          { label: `Typical, ${typical[0]}–${typical[1]}`, color: "color-mix(in oklch, var(--mb-pink) 22%, transparent)", shape: "bar" },
          { label: "Average", color: "var(--mb-label-tertiary)", shape: "dashed" },
        ]}
      />
    </ChartFrame>
  )
}

export { HeartRateChart, RestingTrend, SleepChart, StepsChart }
