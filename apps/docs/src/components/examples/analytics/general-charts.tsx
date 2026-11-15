"use client"

import * as React from "react"
import { alpha, baseOption, ChartFrame, ChartLegend, EChart, Sparkline, useEvilChart, valueAxis, type ChartTheme } from "@/components/charts"
import { EChartsBarChart } from "@/components/charts/evil/charts/echarts-bar-chart"
import { EChartsHeatmapChart } from "@/components/charts/evil/charts/echarts-heatmap-chart"
import { EChartsLineChart } from "@/components/charts/evil/charts/echarts-line-chart"
import { EChartsRadialChart } from "@/components/charts/evil/charts/echarts-radial-chart"
import {
  accountList,
  calendar,
  channels,
  compactCurrency,
  currency,
  goals,
  plans,
  regions,
  type GeneralRange,
  type report,
} from "./general-data"

/*
 * The general-purpose charts: KPI cards with sparklines, lines, stacked and
 * ranked bars, a calendar heatmap, a scatter and radial progress. Most are
 * EvilCharts components themed by useEvilChart; the scatter and sparklines
 * use the adapter's EChart. See /docs/charts/general.
 */

type Report = ReturnType<typeof report>
type Kpi = Report["kpis"][number]

const rangeWords: Record<GeneralRange, string> = { "7D": "the last 7 days", "30D": "the last 30 days", "90D": "the last 90 days", "12M": "the last 12 months" }

function KpiCard({ kpi, range, compact }: { kpi: Kpi; range: GeneralRange; compact?: boolean }) {
  return (
    <ChartFrame
      title={kpi.label}
      summary={`${kpi.value}, ${kpi.direction === "up" ? "up" : "down"} ${kpi.change.replace(/^[+−]/, "")} over ${rangeWords[range]}, ${kpi.detail}.`}
      className="ex-kpi"
    >
      <div className="ex-kpi-label">{compact ? kpi.short : kpi.label}</div>
      <div className="ex-kpi-value">{kpi.value}</div>
      <div className="ex-kpi-foot">
        <span className="ex-kpi-delta" data-good={kpi.good ? "" : undefined}>
          {kpi.change}
        </span>
        <Sparkline values={kpi.trend} color={kpi.good ? "accentSecondary" : "red"} area width={compact ? 54 : 88} height={28} />
      </div>
      <div className="ex-kpi-detail">{kpi.detail}</div>
    </ChartFrame>
  )
}

const lineSeries = Object.fromEntries(plans.map((p) => [p.key, { label: p.label, color: p.color }]))

function RevenueLines({ data, range }: { data: Report; range: GeneralRange }) {
  const { ref, config, chartOptions } = useEvilChart(lineSeries)
  const rows = data.lineRows
  const thin = rows.length > 14 ? Math.ceil(rows.length / 6) : 1
  return (
    <ChartFrame
      ref={ref}
      title="MRR by plan"
      summary={`Monthly recurring revenue went from ${currency.format(data.mrrStart)} to ${currency.format(data.mrrNow)} over ${rangeWords[range]}. Enterprise is the largest plan and grew the most.`}
      table={{ columns: ["Period", ...plans.map((p) => `${p.label} MRR`)], rows: rows.map((r) => [r.name, ...plans.map((p) => currency.format(r[p.key]))]) }}
      className="ex-gen-chart"
    >
      <div className="ex-gen-head">
        <h3>MRR by plan</h3>
        <ChartLegend items={plans.map((p) => ({ label: p.label, color: p.css, shape: "line" }))} />
      </div>
      <div className="ex-gen-plot" style={{ height: 220 }}>
        {config && chartOptions ? (
          <EChartsLineChart key={range} data={rows} config={config} chartOptions={chartOptions} xDataKey="label" curveType="monotone" className="h-full w-full">
            <EChartsLineChart.Grid />
            <EChartsLineChart.XAxis dataKey="label" hideDots tickFormatter={(v, i) => (i % thin === 0 ? v : "")} />
            <EChartsLineChart.YAxis hideDots tickFormatter={(v) => compactCurrency.format(v)} />
            <EChartsLineChart.Tooltip roundness="lg" position="fixed" />
            {plans.map((p) => (
              <EChartsLineChart.Line key={p.key} dataKey={p.key} strokeWidth={2.25}>
                <EChartsLineChart.ActiveDot variant="border" />
              </EChartsLineChart.Line>
            ))}
          </EChartsLineChart>
        ) : null}
      </div>
    </ChartFrame>
  )
}

const stackSeries = Object.fromEntries(channels.map((c) => [c.key, { label: c.label, color: c.color }]))

function SignupsStacked({ data, range }: { data: Report; range: GeneralRange }) {
  const { ref, config, chartOptions } = useEvilChart(stackSeries)
  const rows = data.stackRows
  const thin = rows.length > 14 ? Math.ceil(rows.length / 6) : 1
  const totals = channels.map((c) => rows.reduce((s, r) => s + r[c.key], 0))
  const lead = channels[totals.indexOf(Math.max(...totals))]!
  return (
    <ChartFrame
      ref={ref}
      title="New accounts by channel"
      summary={`${data.added.toLocaleString("en-US")} new accounts over ${rangeWords[range]}. ${lead.label} brought the most, ${Math.max(...totals)}.`}
      table={{ columns: ["Period", ...channels.map((c) => c.label)], rows: rows.map((r) => [r.name, ...channels.map((c) => r[c.key])]) }}
      className="ex-gen-chart"
    >
      <div className="ex-gen-head">
        <h3>New accounts by channel</h3>
        <ChartLegend items={channels.map((c, i) => ({ label: c.label, color: c.css, shape: "bar", value: totals[i] }))} />
      </div>
      <div className="ex-gen-plot" style={{ height: 200 }}>
        {config && chartOptions ? (
          <EChartsBarChart key={range} data={rows} config={config} chartOptions={chartOptions} xDataKey="label" stackType="stacked" barRadius={3} className="h-full w-full">
            <EChartsBarChart.Grid />
            <EChartsBarChart.XAxis dataKey="label" hideDots tickFormatter={(v, i) => (i % thin === 0 ? v : "")} />
            <EChartsBarChart.YAxis hideDots />
            <EChartsBarChart.Tooltip roundness="lg" position="fixed" />
            {channels.map((c) => (
              <EChartsBarChart.Bar key={c.key} dataKey={c.key} />
            ))}
          </EChartsBarChart>
        ) : null}
      </div>
    </ChartFrame>
  )
}

const regionSeries = { mrr: { label: "MRR", color: "series3" } } as const

function RegionsRanked() {
  const { ref, config, chartOptions } = useEvilChart(regionSeries)
  const total = regions.reduce((s, r) => s + r.mrr, 0)
  return (
    <ChartFrame
      ref={ref}
      title="MRR by region"
      summary={`North America brings ${Math.round((regions[0]!.mrr / total) * 100)}% of ${currency.format(total)}, then Europe with ${Math.round((regions[1]!.mrr / total) * 100)}%.`}
      table={{ columns: ["Region", "MRR"], rows: regions.map((r) => [r.region, currency.format(r.mrr)]) }}
      className="ex-gen-chart"
    >
      <div className="ex-gen-head">
        <h3>MRR by region</h3>
        <span className="ex-gen-sub">Today</span>
      </div>
      <div className="ex-gen-plot" style={{ height: 196 }}>
        {config && chartOptions ? (
          <EChartsBarChart data={regions} config={config} chartOptions={chartOptions} layout="horizontal" barRadius={5} barCategoryGap={10} className="h-full w-full">
            <EChartsBarChart.YAxis dataKey="region" hideDots />
            <EChartsBarChart.XAxis hideDots tickFormatter={(v) => compactCurrency.format(Number(v))} />
            <EChartsBarChart.Grid />
            <EChartsBarChart.Tooltip roundness="lg" />
            <EChartsBarChart.Bar dataKey="mrr" enableHoverHighlight />
          </EChartsBarChart>
        ) : null}
      </div>
    </ChartFrame>
  )
}

const heatSeries = { accounts: { label: "New accounts", color: ["series1/25", "series1/50", "series1/75", "series1"] } } as const
const busiest = calendar.reduce((a, b) => (b.value > a.value ? b : a))

function NewAccountsCalendar() {
  const { ref, config, chartOptions } = useEvilChart(heatSeries)
  const total = calendar.reduce((s, d) => s + d.value, 0)
  return (
    <ChartFrame
      ref={ref}
      title="New accounts per day, December 2025 to November 14, 2026"
      summary={`${total.toLocaleString("en-US")} new accounts since December 1. Weekdays bring about twice as many as weekends; the busiest day had ${busiest.value}.`}
      table={{
        columns: ["Month", "New accounts"],
        rows: Array.from(new Set(calendar.map((d) => d.date.slice(0, 7)))).map((month) => [
          new Date(`${month}-15`).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
          calendar.filter((d) => d.date.startsWith(month)).reduce((s, d) => s + d.value, 0),
        ]),
      }}
      className="ex-gen-chart"
    >
      <div className="ex-gen-head">
        <h3>New accounts per day</h3>
        <span className="ex-gen-sub">
          {total.toLocaleString("en-US")} since Dec 1, 2025
        </span>
      </div>
      <div className="ex-gen-plot" style={{ height: 176 }}>
        {config && chartOptions ? (
          <EChartsHeatmapChart data={calendar} config={config} chartOptions={chartOptions} range={[calendar[0]!.date, calendar.at(-1)!.date]} thresholds={[4, 7, 10]} className="h-full w-full">
            <EChartsHeatmapChart.Cell dataKey="accounts" radius={3} gap={3} />
            <EChartsHeatmapChart.MonthLabel />
            <EChartsHeatmapChart.DayLabel labels={["", "Mon", "", "Wed", "", "Fri", ""]} />
            <EChartsHeatmapChart.Tooltip roundness="lg" valueFormatter={(v) => `${v} new accounts`} />
            <EChartsHeatmapChart.Legend />
          </EChartsHeatmapChart>
        ) : null}
      </div>
    </ChartFrame>
  )
}

function AccountsScatter() {
  const option = React.useCallback(
    (theme: ChartTheme) => ({
      ...baseOption(theme),
      grid: { left: 0, right: 48, top: 10, bottom: 24 },
      // Both axes are logarithmic: seats run from 5 to 600, so a linear scale would crush the smaller plans into a corner.
      xAxis: {
        type: "log",
        min: 1,
        max: 1000,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: theme.colors.axis, fontSize: theme.fontSize, formatter: (v: number) => (v === 1 ? "1 seat" : `${v} seats`) },
        splitLine: { lineStyle: { color: theme.colors.grid, type: [2, 3] } },
      },
      yAxis: valueAxis(theme, {
        type: "log",
        min: 10,
        max: 100_000,
        axisLabel: { color: theme.colors.axis, fontSize: theme.fontSize, formatter: (v: number) => compactCurrency.format(v) },
      }),
      tooltip: {
        trigger: "item",
        backgroundColor: theme.colors.bg,
        borderWidth: 0,
        textStyle: { color: theme.colors.label, fontFamily: theme.font, fontSize: theme.fontSize + 1 },
        formatter: ({ data }: { data: { name: string; value: [number, number] } }) => `${data.name}<br/>${data.value[0]} seats · ${currency.format(data.value[1])}`,
      },
      series: plans.map((plan) => ({
        id: plan.key,
        type: "scatter",
        data: accountList.filter((a) => a.plan === plan.key).map((a) => ({ name: a.name, value: [a.seats, a.mrr] })),
        symbol: plan.key === "enterprise" ? "circle" : plan.key === "team" ? "roundRect" : "triangle",
        symbolSize: 10,
        itemStyle: { color: alpha(theme.colors[plan.color], 0.88), borderColor: theme.colors.bg, borderWidth: 1.25 },
        emphasis: { scale: 1.3 },
      })),
    }),
    []
  )
  return (
    <ChartFrame
      title="Seats and MRR, by account"
      summary="Revenue grows with seats on every plan, drawn on logarithmic scales. Enterprise accounts pay less per seat at the top end, where volume discounts apply."
      table={{ columns: ["Account", "Plan", "Seats", "MRR"], rows: accountList.map((a) => [a.name, plans.find((p) => p.key === a.plan)!.label, a.seats, currency.format(a.mrr)]) }}
      className="ex-gen-chart"
    >
      <div className="ex-gen-head">
        <h3>Seats and MRR</h3>
        {/* Each plan has its own shape, so the legend doesn't rely on color alone. */}
        <ChartLegend
          items={plans.map((p) => ({ label: `${p.label} ${p.key === "enterprise" ? "●" : p.key === "team" ? "■" : "▲"}`, color: p.css }))}
        />
      </div>
      <EChart option={option} height={200} />
    </ChartFrame>
  )
}

const radialSeries = Object.fromEntries(
  goals.map((g, i) => [g.key, { label: g.label, color: (["series1", "series2", "series4"] as const)[i]! }])
)
const radialCss = ["var(--mb-chart-1)", "var(--mb-chart-2)", "var(--mb-chart-4)"]

function QuarterGoals({ size = 150 }: { size?: number }) {
  const { ref, config, chartOptions } = useEvilChart(radialSeries)
  const data = React.useMemo(() => goals.map((g) => ({ goal: g.key, percent: Math.min(g.percent, 100) })), [])
  return (
    <ChartFrame
      ref={ref}
      title="Fourth quarter goals"
      summary={goals.map((g) => `${g.label}: ${g.actual} of ${g.target}, ${g.percent}%`).join(". ")}
      table={{ columns: ["Goal", "Now", "Target", "Met"], rows: goals.map((g) => [g.label, g.actual, g.target, `${g.percent}%`]) }}
      className="ex-gen-chart ex-gen-goals"
    >
      <div className="ex-gen-head">
        <h3>Q4 goals</h3>
        <span className="ex-gen-sub">Oct 1–Dec 31</span>
      </div>
      <div className="ex-gen-goals-body">
        <div style={{ width: size, height: size, flex: "none" }}>
          {config && chartOptions ? (
            <EChartsRadialChart data={data} nameKey="goal" config={config} chartOptions={chartOptions} max={100} innerRadius="34%" outerRadius="100%" className="h-full w-full">
              <EChartsRadialChart.Tooltip roundness="lg" />
              <EChartsRadialChart.RadialBar dataKey="percent" showBackground cornerRadius={99} barSize={12} />
            </EChartsRadialChart>
          ) : null}
        </div>
        <ChartLegend
          aria-hidden="true"
          className="ex-gen-goal-legend"
          items={goals.map((g, i) => ({ label: `${g.label}, ${g.actual} of ${g.target}`, color: radialCss[i]!, value: `${g.percent}%` }))}
        />
      </div>
    </ChartFrame>
  )
}

export { AccountsScatter, KpiCard, NewAccountsCalendar, QuarterGoals, RegionsRanked, RevenueLines, SignupsStacked }
