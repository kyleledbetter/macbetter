"use client"

import { SegmentedControl, SegmentedControlItem } from "macbetter/segmented-control"
import * as React from "react"
import { alpha, baseOption, ChartFrame, EChart, echarts, formatters, type ChartTheme, type Scrub } from "@/components/charts"

const ranges = ["1D", "1W", "1M", "3M", "6M", "YTD", "1Y", "2Y", "5Y", "10Y", "ALL"] as const
type Range = (typeof ranges)[number]
type Step = "5m" | "30m" | "day" | "week" | "month"

/** How each range is sampled, and where the price stood when it began. */
const spec: Record<Range, { points: number; step: Step; open: number; volatility: number; long: string }> = {
  "1D": { points: 79, step: "5m", open: 228.9, volatility: 0.0011, long: "today" },
  "1W": { points: 70, step: "30m", open: 224.1, volatility: 0.0032, long: "the past week" },
  "1M": { points: 22, step: "day", open: 238.6, volatility: 0.009, long: "the past month" },
  "3M": { points: 63, step: "day", open: 214.0, volatility: 0.011, long: "the past 3 months" },
  "6M": { points: 126, step: "day", open: 196.3, volatility: 0.012, long: "the past 6 months" },
  YTD: { points: 219, step: "day", open: 188.2, volatility: 0.012, long: "this year" },
  "1Y": { points: 252, step: "day", open: 171.5, volatility: 0.013, long: "the past year" },
  "2Y": { points: 104, step: "week", open: 148.0, volatility: 0.026, long: "the past 2 years" },
  "5Y": { points: 260, step: "week", open: 82.4, volatility: 0.03, long: "the past 5 years" },
  "10Y": { points: 120, step: "month", open: 24.6, volatility: 0.06, long: "the past 10 years" },
  ALL: { points: 200, step: "month", open: 3.1, volatility: 0.07, long: "since it listed" },
}

const last = 231.4
const previousClose = 228.28

/** Repeatable noise, so the chart draws the same way on every load. */
function random(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Trading times, oldest first, ending at Friday's close. */
function times(range: Range) {
  const { points, step } = spec[range]
  const close = new Date(2026, 10, 13, 16, 0)
  const out: Date[] = []
  const cursor = new Date(close)
  if (step === "5m") cursor.setHours(9, 30)
  while (out.length < points) {
    out.push(new Date(cursor))
    if (step === "5m") cursor.setMinutes(cursor.getMinutes() + 5)
    else if (step === "30m") {
      cursor.setMinutes(cursor.getMinutes() - 30)
      if (cursor.getHours() < 9 || (cursor.getHours() === 9 && cursor.getMinutes() < 30)) {
        do cursor.setDate(cursor.getDate() - 1)
        while (cursor.getDay() === 0 || cursor.getDay() === 6)
        cursor.setHours(16, 0)
      }
    } else if (step === "day") {
      do cursor.setDate(cursor.getDate() - 1)
      while (cursor.getDay() === 0 || cursor.getDay() === 6)
    } else if (step === "week") cursor.setDate(cursor.getDate() - 7)
    else cursor.setMonth(cursor.getMonth() - 1)
  }
  return step === "5m" ? out : out.reverse()
}

/** A random walk pinned to the range's opening price and today's last price. */
function history(range: Range) {
  const { points, open, volatility } = spec[range]
  const next = random(ranges.indexOf(range) * 7919 + 17)
  const walk = [0]
  for (let i = 1; i < points; i++) walk.push(walk[i - 1]! + (next() - 0.5) * 2 * volatility * 1.7)
  const drift = Math.log(last / open)
  const prices = walk.map((w, i) => {
    const t = i / (points - 1)
    return +(open * Math.exp(w - t * walk[points - 1]! + t * drift)).toFixed(2)
  })
  const volumes = prices.map((_, i) => {
    const t = i / (points - 1)
    const shape = range === "1D" ? 1 + 1.6 * (Math.abs(t - 0.5) * 2) ** 3 : 1
    return Math.round((0.45 + next() * 0.9) * shape * 1_000_000)
  })
  return { times: times(range), prices, volumes }
}

const time = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" })
const weekday = new Intl.DateTimeFormat("en-US", { weekday: "short", hour: "numeric", minute: "2-digit" })
const day = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" })
const month = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" })

function calloutDate(range: Range, date: Date) {
  const { step } = spec[range]
  if (step === "5m") return time.format(date)
  if (step === "30m") return weekday.format(date)
  if (step === "month") return month.format(date)
  return day.format(date)
}

/** Which points get an x label: the first of each hour, day, month or year, thinned to fit. */
function ticks(range: Range, dates: Date[]) {
  const { step } = spec[range]
  const key = (d: Date) =>
    step === "5m"
      ? d.getHours()
      : step === "30m"
        ? d.getDate()
        : range === "1M"
          ? Math.floor((d.getTime() - 4 * 86_400_000) / (7 * 86_400_000))
          : step === "day"
            ? d.getMonth()
            : d.getFullYear()
  const every = range === "1Y" || range === "YTD" ? 2 : range === "ALL" ? 4 : range === "10Y" ? 2 : 1
  const marks = new Map<number, string>()
  let seen = 0
  dates.forEach((d, i) => {
    if (i === 0 || key(d) === key(dates[i - 1]!)) return
    if (seen++ % every) return
    marks.set(
      i,
      step === "5m"
        ? String(d.getHours() % 12 || 12)
        : step === "30m"
          ? String(d.getDate())
          : range === "1M"
            ? `${d.toLocaleString("en-US", { month: "short" })} ${d.getDate()}`
            : step === "day"
              ? d.toLocaleString("en-US", { month: "short" })
              : String(d.getFullYear())
    )
  })
  return marks
}

export default function StockChart() {
  const [range, setRange] = React.useState<Range>("1D")
  const [scrub, setScrub] = React.useState<Scrub | null>(null)
  const data = React.useMemo(() => history(range), [range])
  const reference = range === "1D" ? previousClose : data.prices[0]!
  const change = last - reference
  const up = change >= 0
  const marks = React.useMemo(() => ticks(range, data.times), [range, data.times])

  const option = React.useCallback(
    (theme: ChartTheme) => {
      const color = up ? theme.colors.up : theme.colors.down
      const low = Math.min(...data.prices, range === "1D" ? previousClose : Infinity)
      const high = Math.max(...data.prices, range === "1D" ? previousClose : -Infinity)
      const pad = (high - low) * 0.1
      const labels = data.times.map((_, i) => marks.get(i) ?? "")
      return {
        ...baseOption(theme),
        axisPointer: { link: [{ xAxisIndex: "all" }] },
        grid: [
          { left: 0, right: 44, top: 44, bottom: 74 },
          { left: 0, right: 44, height: 34, bottom: 24 },
        ],
        xAxis: [0, 1].map((gridIndex) => ({
          type: "category",
          gridIndex,
          data: labels,
          boundaryGap: false,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            show: gridIndex === 1,
            interval: (index: number) => marks.has(index),
            color: theme.colors.axis,
            fontSize: theme.fontSize,
            margin: 8,
          },
          splitLine: { show: false },
        })),
        yAxis: [
          {
            type: "value",
            position: "right",
            min: +(low - pad).toFixed(2),
            max: +(high + pad).toFixed(2),
            splitNumber: 4,
            axisLabel: {
              color: theme.colors.axis,
              fontSize: theme.fontSize,
              margin: 8,
              formatter: (value: number) => (high > 1000 ? formatters.compact : formatters.price).format(value),
              showMinLabel: false,
              showMaxLabel: false,
            },
            splitLine: { showMinLine: false, showMaxLine: false, lineStyle: { color: theme.colors.grid, type: [2, 3] } },
          },
          { type: "value", gridIndex: 1, show: false, max: (v: { max: number }) => v.max * 1.1 },
        ],
        series: [
          {
            id: "price",
            type: "line",
            data: data.prices,
            showSymbol: false,
            symbol: "circle",
            symbolSize: 9,
            emphasis: { scale: 1, lineStyle: { width: 2 } },
            lineStyle: { color, width: 2, join: "round", cap: "round" },
            itemStyle: { color, borderColor: theme.colors.bg, borderWidth: 2 },
            areaStyle: {
              origin: "start",
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: alpha(color, 0.3) },
                { offset: 1, color: alpha(color, 0) },
              ]),
            },
            universalTransition: true,
            markLine:
              range === "1D"
                ? {
                    silent: true,
                    symbol: "none",
                    animation: false,
                    label: { show: false },
                    lineStyle: { color: theme.colors.label3, type: [2, 3], width: 1 },
                    data: [{ yAxis: previousClose }],
                  }
                : undefined,
          },
          {
            id: "volume",
            type: "bar",
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: data.volumes,
            barWidth: "62%",
            itemStyle: { color: theme.colors.fill, borderRadius: [1, 1, 0, 0] },
            emphasis: { disabled: true },
          },
        ],
      }
    },
    [data, range, up, marks]
  )

  const index = scrub?.index
  const shown = index === undefined ? null : { price: data.prices[index]!, date: data.times[index]! }
  const summary = `MCBT ${up ? "rose" : "fell"} ${Math.abs((change / reference) * 100).toFixed(2)}% ${spec[range].long}, from ${formatters.price.format(reference)} to ${formatters.price.format(last)}. Low ${formatters.price.format(Math.min(...data.prices))}, high ${formatters.price.format(Math.max(...data.prices))}.`
  const sample = Math.ceil(data.prices.length / 12)

  return (
    <div style={{ width: "100%", maxWidth: 640, minWidth: 0, display: "grid", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ font: "var(--mb-text-title-1)", fontWeight: 700 }}>MCBT</div>
          <div style={{ color: "var(--mb-label-secondary)", font: "var(--mb-text-subheadline)" }}>Macbetter Inc.</div>
        </div>
        <div style={{ textAlign: "end", fontVariantNumeric: "tabular-nums" }}>
          <div style={{ font: "var(--mb-text-title-2)" }}>{formatters.price.format(last)}</div>
          <div style={{ font: "var(--mb-text-subheadline)", fontWeight: 600, color: up ? "var(--mb-chart-up, var(--mb-green))" : "var(--mb-chart-down, var(--mb-red))" }}>
            {up ? "+" : "−"}
            {formatters.price.format(Math.abs(change))} ({up ? "+" : "−"}
            {Math.abs((change / reference) * 100).toFixed(2)}%)
          </div>
        </div>
      </div>
      {/* Eleven ranges don't fit a phone at control size; the row scrolls sideways there. */}
      <div style={{ overflowX: "auto", minWidth: 0, scrollbarWidth: "none" }}>
      <SegmentedControl size="sm" block aria-label="Range" value={range} onValueChange={(v) => v && setRange(v as Range)}>
        {ranges.map((r) => (
          <SegmentedControlItem key={r} value={r}>
            {r}
          </SegmentedControlItem>
        ))}
      </SegmentedControl>
      </div>
      <ChartFrame
        title={`MCBT price, ${spec[range].long}`}
        summary={summary}
        table={{
          columns: ["Time", "Price", "Volume"],
          rows: data.prices
            .map((price, i) => [calloutDate(range, data.times[i]!), formatters.price.format(price), formatters.compact.format(data.volumes[i]!)])
            .filter((_, i) => i % sample === 0 || i === data.prices.length - 1),
        }}
        style={{ position: "relative" }}
      >
        {shown && scrub ? (
          <div className="mb-chart-callout" style={{ left: Math.min(Math.max(scrub.x, 44), scrub.width - 60) }}>
            <strong>{formatters.price.format(shown.price)}</strong>
            <span>{calloutDate(range, shown.date)}</span>
          </div>
        ) : null}
        <EChart
          option={option}
          height={260}
          onScrub={setScrub}
          scrub={{
            label: "Price",
            count: data.prices.length,
            valueText: (i) => `${formatters.price.format(data.prices[i]!)}, ${calloutDate(range, data.times[i]!)}`,
          }}
        />
      </ChartFrame>
    </div>
  )
}
