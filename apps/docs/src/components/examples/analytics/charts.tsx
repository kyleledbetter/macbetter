"use client"

import { SegmentedControl, SegmentedControlItem } from "macbetter/segmented-control"
import * as React from "react"
import { ChartFrame, ChartLegend, useEvilChart, type ChartColor, type Scrub } from "@/components/charts"
import { EChartsPieChart } from "@/components/charts/evil/charts/echarts-pie-chart"

/*
 * Chart pieces, and the range control, that more than one section uses. Each section's own charts live
 * beside it (stocks-charts.tsx, health-charts.tsx…), drawn with the macbetter
 * chart kit in @/components/charts: see /docs/charts/overview.
 */

/** Keeps a scrub callout inside the plot: `start` px from the leading edge, `end` px from the trailing one. */
function calloutLeft(scrub: Scrub, start = 44, end = 64) {
  return Math.min(Math.max(scrub.x, start), scrub.width - end)
}

type DonutPart = { key: string; label: string; value: number; color: ChartColor; css: string; display: string }

type DonutProps = {
  parts: DonutPart[]
  title: string
  summary: string
  /** The column names of the hidden data table, like ["Plan", "MRR"]. */
  columns: [string, string]
  center: React.ReactNode
  centerLabel: string
  size?: number
  className?: string
}

/** Parts of a whole as a ring, the total in its middle and every part named in the legend. */
function Donut({ parts, title, summary, columns, center, centerLabel, size = 150, className }: DonutProps) {
  const series = React.useMemo(
    () => Object.fromEntries(parts.map((part) => [part.key, { label: part.label, color: part.color }])),
    [parts]
  )
  const data = React.useMemo(() => parts.map((part) => ({ key: part.key, value: part.value })), [parts])
  const { ref, config, chartOptions } = useEvilChart(series)
  const total = parts.reduce((acc, part) => acc + part.value, 0)
  return (
    <ChartFrame
      ref={ref}
      title={title}
      summary={summary}
      table={{ columns, rows: parts.map((part) => [part.label, part.display]) }}
      className={className ? `ex-donut ${className}` : "ex-donut"}
    >
      <div className="ex-donut-ring" style={{ width: size, height: size }}>
        {config && chartOptions ? (
          <EChartsPieChart data={data} dataKey="value" nameKey="key" config={config} chartOptions={chartOptions} className="h-full w-full">
            <EChartsPieChart.Tooltip roundness="lg" />
            <EChartsPieChart.Pie innerRadius="72%" outerRadius="98%" cornerRadius={4} paddingAngle={2.5} />
          </EChartsPieChart>
        ) : null}
        <div className="ex-donut-center" aria-hidden="true">
          <strong>{center}</strong>
          <span>{centerLabel}</span>
        </div>
      </div>
      <ChartLegend
        aria-hidden="true"
        className="ex-donut-legend"
        items={parts.map((part) => ({
          label: part.label,
          color: part.css,
          shape: "bar",
          value: `${Math.round((part.value / total) * 100)}%`,
        }))}
      />
    </ChartFrame>
  )
}

type RangeControlProps<R extends string> = {
  ranges: { value: R; label: string; long: string }[]
  value: R
  onValueChange: (value: R) => void
  /** What the ranges are for, like "Steps and heart rate range". */
  label: string
  block?: boolean
  className?: string
}

/** The time range a section's charts show: in the toolbar on the Mac, above the charts on iPhone. */
function RangeControl<R extends string>({ ranges, value, onValueChange, label, block, className }: RangeControlProps<R>) {
  return (
    <SegmentedControl
      size="sm"
      aria-label={label}
      value={value}
      onValueChange={(next) => next && onValueChange(next as R)}
      block={block}
      className={className}
    >
      {ranges.map((range) => (
        <SegmentedControlItem key={range.value} value={range.value} aria-label={range.long}>
          {range.label}
        </SegmentedControlItem>
      ))}
    </SegmentedControl>
  )
}

export { calloutLeft, Donut, RangeControl }
export type { DonutPart }
