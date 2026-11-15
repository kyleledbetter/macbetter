"use client"

import * as React from "react"
import {
  alpha,
  baseOption,
  ChartFrame as Frame,
  EChart,
  echarts,
  formatters,
  Sparkline as KitSparkline,
  useEvilChart,
  type ChartColor,
  type ChartTheme,
  type Scrub,
} from "@/components/charts"
import { EChartsBarChart } from "@/components/charts/evil/charts/echarts-bar-chart"
import { EChartsPieChart } from "@/components/charts/evil/charts/echarts-pie-chart"

/*
 * The dashboard's charts. They draw with ECharts (an external library, see
 * /docs/charts/overview): the trend and sparklines through the macbetter
 * adapter's EChart, the bars and donut as EvilCharts components themed by it.
 */

const number = formatters.compact

type Series = { name: string; values: number[]; color: ChartColor; dashed?: boolean }

type ChartFrameProps = {
  title: string
  description: string
  /** Rows for the table screen readers get in place of the drawing. */
  table: { columns: string[]; rows: (string | number)[][] }
  legend?: { name: string; color: string; dashed?: boolean }[]
  children: React.ReactNode
  ref?: React.Ref<HTMLElement>
}

/**
 * A chart's title, description, legend and accessible data table around its
 * drawing. The figure is named and described by the same text the card shows.
 */
function ChartFrame({ title, description, table, legend, children, ref }: ChartFrameProps) {
  return (
    <Frame ref={ref} title={title} summary={description} table={table} className="ex-chart">
      <div className="ex-chart-head" aria-hidden="true">
        <div className="ex-chart-title">{title}</div>
        <p className="ex-chart-description">{description}</p>
      </div>
      {legend ? (
        <ul className="ex-chart-legend" aria-hidden="true">
          {legend.map((item) => (
            <li key={item.name}>
              <span
                className="ex-chart-swatch"
                data-dashed={item.dashed ? "" : undefined}
                style={{ "--ex-swatch": item.color } as React.CSSProperties}
              />
              {item.name}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="ex-chart-drawing">{children}</div>
    </Frame>
  )
}

type TrendChartProps = {
  series: Series[]
  labels: string[]
  height?: number
  /** How many x labels to show at most. */
  xTicks?: number
}

/**
 * A line chart whose lead series fills to the baseline, scrubbed like Stocks:
 * the readout rides at the top of the rule, above the lines.
 */
function TrendChart({ series, labels, height = 220, xTicks = 6 }: TrendChartProps) {
  const [scrub, setScrub] = React.useState<Scrub | null>(null)
  const count = labels.length
  const every = Math.max(1, Math.ceil(count / xTicks))

  const option = React.useCallback(
    (theme: ChartTheme) => {
      const lead = theme.colors[series[0]!.color]
      return {
        ...baseOption(theme),
        grid: { left: 0, right: 40, top: 44, bottom: 22 },
        xAxis: {
          type: "category",
          data: labels,
          boundaryGap: false,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            color: theme.colors.axis,
            fontSize: theme.fontSize,
            interval: (i: number) => i % every === 0 && count - 1 - i >= every / 2,
            align: "left",
          },
        },
        yAxis: {
          type: "value",
          position: "right",
          splitNumber: 3,
          // Like Stocks, scale to the data rather than to zero, so the movement shows.
          min: (extent: { min: number }) => Math.floor((extent.min * 0.85) / 10 ** Math.floor(Math.log10(extent.min))) * 10 ** Math.floor(Math.log10(extent.min)),
          axisLabel: { color: theme.colors.axis, fontSize: theme.fontSize, margin: 8, formatter: (v: number) => number.format(v) },
          splitLine: { lineStyle: { color: theme.colors.grid } },
        },
        series: [...series].reverse().map((s, i) => {
          const color = theme.colors[s.color]
          const isLead = i === series.length - 1
          return {
            id: s.name,
            type: "line",
            data: s.values,
            smooth: 0.25,
            showSymbol: false,
            symbol: "circle",
            symbolSize: isLead ? 9 : 7,
            z: isLead ? 3 : 2,
            lineStyle: { color, width: isLead ? 2.25 : 1.5, type: s.dashed ? [4, 4] : "solid", cap: "round" },
            itemStyle: { color, borderColor: theme.colors.bg, borderWidth: 2 },
            emphasis: { scale: 1, lineStyle: { width: isLead ? 2.25 : 1.5 } },
            areaStyle: isLead
              ? {
                  origin: "start",
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: alpha(lead, 0.28) },
                    { offset: 1, color: alpha(lead, 0) },
                  ]),
                }
              : undefined,
          }
        }),
      }
    },
    [series, labels, every, count]
  )

  return (
    <div className="ex-trend">
      {scrub ? (
        <div className="mb-chart-callout ex-trend-callout" style={{ left: Math.min(Math.max(scrub.x, 70), scrub.width - 80) }}>
          <span>{labels[scrub.index]}</span>
          <div>
            {series.map((s) => (
              <b key={s.name} data-dashed={s.dashed ? "" : undefined}>
                <i style={{ background: `var(--mb-${s.color === "accentSecondary" ? "accent-secondary" : s.color})` }} />
                {s.values[scrub.index]!.toLocaleString("en")}
              </b>
            ))}
          </div>
        </div>
      ) : null}
      <EChart
        option={option}
        height={height}
        onScrub={setScrub}
        scrub={{
          label: series[0]!.name,
          count,
          valueText: (i) => `${labels[i]}: ${series.map((s) => `${s.name} ${s.values[i]!.toLocaleString("en")}`).join(", ")}`,
        }}
      />
    </div>
  )
}

const tableSeries = { value: { label: "Queries", color: "accent" } } as const

/** Horizontal bars: categories with long names read best this way. */
function BarList({ items, title, description }: { items: { label: string; value: number }[]; title: string; description: string }) {
  const { ref, config, chartOptions } = useEvilChart(tableSeries)
  return (
    <ChartFrame
      ref={ref}
      title={title}
      description={description}
      table={{ columns: ["Table", "Queries"], rows: items.map((t) => [t.label, t.value]) }}
    >
      <div style={{ height: 172 }}>
        {config && chartOptions ? (
          <EChartsBarChart
            data={items}
            config={config}
            chartOptions={chartOptions}
            layout="horizontal"
            barRadius={4}
            barCategoryGap={9}
            className="h-full w-full"
          >
            <EChartsBarChart.YAxis dataKey="label" hideDots />
            <EChartsBarChart.XAxis hideDots tickFormatter={(v) => number.format(Number(v))} />
            <EChartsBarChart.Grid />
            <EChartsBarChart.Tooltip roundness="lg" />
            <EChartsBarChart.Bar dataKey="value" enableHoverHighlight />
          </EChartsBarChart>
        ) : null}
      </div>
    </ChartFrame>
  )
}

const runSeries = { runs: { label: "Runs", color: "accentSecondary" } } as const

/** Vertical bars for a short time series; the busiest day keeps its color, as in Screen Time. */
function ColumnChart({ values, labels, days, title, description }: {
  values: number[]
  labels: string[]
  days: string[]
  title: string
  description: string
}) {
  const { ref, config, chartOptions } = useEvilChart(runSeries)
  const data = React.useMemo(() => values.map((runs, i) => ({ day: labels[i]!, runs })), [values, labels])
  return (
    <ChartFrame
      ref={ref}
      title={title}
      description={description}
      table={{ columns: ["Day", "Runs"], rows: days.map((d, i) => [d, values[i]!]) }}
    >
      <div style={{ height: 172 }}>
        {config && chartOptions ? (
          <EChartsBarChart
            data={data}
            config={config}
            chartOptions={chartOptions}
            xDataKey="day"
            barRadius={5}
            enableMaxValueHighlight
            className="h-full w-full"
          >
            <EChartsBarChart.XAxis dataKey="day" hideDots />
            <EChartsBarChart.Tooltip roundness="lg" />
            <EChartsBarChart.Bar dataKey="runs" />
          </EChartsBarChart>
        ) : null}
      </div>
    </ChartFrame>
  )
}

type Part = { label: string; value: number; color: ChartColor; css: string }

/** A ring of parts of a whole, with the total in the middle. */
function Donut({ parts, total, unit, title, description, size = 148 }: {
  parts: Part[]
  total: string
  unit: string
  title: string
  description: string
  size?: number
}) {
  const series = React.useMemo(
    () => Object.fromEntries(parts.map((part) => [part.label, { label: part.label, color: part.color }])),
    [parts]
  )
  const { ref, config, chartOptions } = useEvilChart(series)
  const sum = parts.reduce((acc, part) => acc + part.value, 0)
  return (
    <ChartFrame
      ref={ref}
      title={title}
      description={description}
      table={{ columns: ["Schema", "Share"], rows: parts.map((s) => [s.label, `${s.value}%`]) }}
    >
      <div className="ex-donut">
        <div className="ex-donut-ring" style={{ width: size, height: size }}>
          {config && chartOptions ? (
            <EChartsPieChart data={parts} dataKey="value" nameKey="label" config={config} chartOptions={chartOptions} className="h-full w-full">
              <EChartsPieChart.Tooltip roundness="lg" />
              <EChartsPieChart.Pie innerRadius="72%" outerRadius="98%" cornerRadius={4} paddingAngle={2.5} />
            </EChartsPieChart>
          ) : null}
          <div className="ex-donut-center" aria-hidden="true">
            <strong className="ex-mono">{total}</strong>
            <span>{unit}</span>
          </div>
        </div>
        <ul className="ex-donut-legend" aria-hidden="true">
          {parts.map((part) => (
            <li key={part.label}>
              <span className="ex-chart-swatch" style={{ "--ex-swatch": part.css } as React.CSSProperties} />
              <span className="ex-donut-label">{part.label}</span>
              <span className="ex-mono">{Math.round((part.value / sum) * 100)}%</span>
            </li>
          ))}
        </ul>
      </div>
    </ChartFrame>
  )
}

/** A tiny trend line for a KPI, filled like a Stocks sparkline. */
function Sparkline({ values, good, width = 96, height = 30 }: { values: number[]; good: boolean; width?: number | string; height?: number }) {
  return <KitSparkline values={values} color={good ? "accentSecondary" : "red"} area width={width} height={height} className="ex-sparkline" />
}

export { BarList, ChartFrame, ColumnChart, Donut, Sparkline, TrendChart }
export type { Part, Series }
