"use client"

import * as React from "react"
import { baseOption, ChartFrame, EChart, formatters, valueAxis, type ChartTheme, type Scrub } from "@/components/charts"

/** DRMB daily open, close, low and high for the last 22 trading days. */
const days = [
  ["Oct 15", 238.6, 236.9, 235.2, 239.8], ["Oct 16", 236.9, 234.1, 233.0, 237.5], ["Oct 19", 234.0, 235.8, 232.6, 236.4],
  ["Oct 20", 235.9, 233.2, 232.1, 236.8], ["Oct 21", 233.0, 229.4, 228.7, 233.6], ["Oct 22", 229.6, 230.8, 227.9, 231.5],
  ["Oct 23", 230.9, 227.6, 226.8, 231.4], ["Oct 26", 227.2, 224.9, 223.8, 228.0], ["Oct 27", 225.1, 226.7, 224.2, 227.9],
  ["Oct 28", 226.8, 222.4, 221.6, 227.3], ["Oct 29", 222.0, 220.3, 218.9, 223.1], ["Oct 30", 220.6, 223.9, 220.1, 224.6],
  ["Nov 2", 224.0, 225.6, 222.8, 226.9], ["Nov 3", 225.8, 224.1, 223.0, 227.2], ["Nov 4", 224.0, 227.8, 223.5, 228.6],
  ["Nov 5", 228.0, 226.2, 225.4, 229.1], ["Nov 6", 226.0, 229.5, 225.7, 230.2], ["Nov 9", 229.8, 228.4, 227.1, 231.0],
  ["Nov 10", 228.2, 230.9, 227.6, 231.8], ["Nov 11", 231.0, 229.7, 228.8, 232.4], ["Nov 12", 229.5, 228.3, 227.4, 230.6],
  ["Nov 13", 228.9, 231.4, 227.9, 232.1],
] as [string, number, number, number, number][]

export default function Candlesticks() {
  const [scrub, setScrub] = React.useState<Scrub | null>(null)
  const option = React.useCallback(
    (theme: ChartTheme) => ({
      ...baseOption(theme),
      grid: { left: 0, right: 44, top: 8, bottom: 24 },
      xAxis: {
        type: "category",
        data: days.map(([d]) => d),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: theme.colors.axis, fontSize: theme.fontSize, interval: 4 },
      },
      yAxis: valueAxis(theme, { scale: true, splitNumber: 4, axisLabel: { color: theme.colors.axis, fontSize: theme.fontSize } }),
      series: [
        {
          id: "ohlc",
          type: "candlestick",
          barWidth: "56%",
          // ECharts wants [open, close, low, high].
          data: days.map(([, open, close, low, high]) => [open, close, low, high]),
          itemStyle: {
            color: theme.colors.up,
            borderColor: theme.colors.up,
            color0: theme.colors.down,
            borderColor0: theme.colors.down,
            borderWidth: 1.25,
          },
          emphasis: { disabled: true },
        },
      ],
    }),
    []
  )
  const day = scrub ? days[scrub.index]! : days.at(-1)!
  const [label, open, close, low, high] = day
  const up = close >= open
  return (
    <ChartFrame
      title="DRMB daily prices, last 22 trading days"
      summary="DRMB fell from 238.60 to a low of 218.90 on October 29, then recovered to close at 231.40."
      table={{ columns: ["Day", "Open", "Close", "Low", "High"], rows: days.map((d) => [d[0], ...d.slice(1).map((v) => formatters.price.format(v as number))]) }}
      style={{ width: "100%", maxWidth: 600 }}
    >
      <dl style={{ display: "flex", flexWrap: "wrap", gap: "4px 18px", margin: 0, font: "var(--sd-text-footnote)", fontVariantNumeric: "tabular-nums" }}>
        <div style={{ display: "flex", gap: 6 }}>
          <dt style={{ color: "var(--sd-label-secondary)" }}>{scrub ? "Day" : "Last"}</dt>
          <dd style={{ margin: 0, fontWeight: 600 }}>{label}</dd>
        </div>
        {(
          [
            ["Open", open],
            ["High", high],
            ["Low", low],
            ["Close", close],
          ] as const
        ).map(([name, value]) => (
          <div key={name} style={{ display: "flex", gap: 6 }}>
            <dt style={{ color: "var(--sd-label-secondary)" }}>{name}</dt>
            <dd style={{ margin: 0, fontWeight: 600, color: name === "Close" ? (up ? "var(--sd-green)" : "var(--sd-red)") : undefined }}>
              {formatters.price.format(value)}
            </dd>
          </div>
        ))}
      </dl>
      <EChart
        option={option}
        height={240}
        onScrub={setScrub}
        scrub={{
          label: "Day",
          count: days.length,
          valueText: (i) => {
            const [d, o, c, l, h] = days[i]!
            return `${d}: open ${o}, high ${h}, low ${l}, close ${c}`
          },
        }}
      />
    </ChartFrame>
  )
}
