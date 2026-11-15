"use client"

import * as React from "react"
import { alpha, baseOption, ChartFrame, EChart, echarts, formatters, type ChartTheme, type Scrub } from "@/components/charts"
import { calloutLeft } from "./charts"
import { compact, history, price, spec, ticks, when, type Stock, type StockRange } from "./stocks-data"

type ChartStyle = "line" | "candles"

type PriceChartProps = {
  stock: Stock
  range: StockRange
  kind: ChartStyle
  height?: number
}

/**
 * The Stocks price chart: one color for the whole range, the previous close
 * dotted under a 1D line, volume in its own band, and a callout that rides
 * the top of the scrub rule. `candles` draws the same history as open, high,
 * low and close.
 */
function PriceChart({ stock, range, kind, height = 300 }: PriceChartProps) {
  const [scrub, setScrub] = React.useState<Scrub | null>(null)
  const data = history(stock, range)
  const candles = kind === "candles"
  const count = candles ? data.candles.length : data.prices.length
  const dates = React.useMemo(() => (candles ? data.candles.map((c) => c.time) : data.times), [candles, data])
  const marks = React.useMemo(() => ticks(range, dates), [range, dates])
  const reference = range === "1D" ? stock.previousClose : data.start
  const up = stock.last >= reference

  const option = React.useCallback(
    (theme: ChartTheme) => {
      const color = up ? theme.colors.up : theme.colors.down
      const lows = candles ? data.candles.map((c) => c.low) : data.prices
      const highs = candles ? data.candles.map((c) => c.high) : data.prices
      const low = Math.min(...lows, range === "1D" ? stock.previousClose : Infinity)
      const high = Math.max(...highs, range === "1D" ? stock.previousClose : -Infinity)
      const pad = (high - low) * 0.1
      const labels = dates.map((_, i) => marks.get(i) ?? "")
      const previous =
        range === "1D"
          ? {
              silent: true,
              symbol: "none",
              animation: false,
              label: { show: false },
              lineStyle: { color: theme.colors.label3, type: [2, 3], width: 1 },
              data: [{ yAxis: stock.previousClose }],
            }
          : undefined
      return {
        ...baseOption(theme),
        axisPointer: { link: [{ xAxisIndex: "all" }] },
        grid: [
          { left: 0, right: 48, top: 48, bottom: 74 },
          { left: 0, right: 48, height: 34, bottom: 24 },
        ],
        xAxis: [0, 1].map((gridIndex) => ({
          type: "category",
          gridIndex,
          data: labels,
          boundaryGap: candles,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            show: gridIndex === 1,
            interval: (index: number) => marks.has(index),
            color: theme.colors.axis,
            fontSize: theme.fontSize,
            margin: 8,
          },
          splitLine: {
            show: gridIndex === 0,
            interval: (index: number) => marks.has(index),
            lineStyle: { color: theme.colors.grid, type: [2, 3] },
          },
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
              formatter: (value: number) => formatters.price.format(value),
              showMinLabel: false,
              showMaxLabel: false,
            },
            splitLine: { showMinLine: false, showMaxLine: false, lineStyle: { color: theme.colors.grid, type: [2, 3] } },
          },
          { type: "value", gridIndex: 1, show: false, max: (v: { max: number }) => v.max * 1.1 },
        ],
        series: [
          candles
            ? {
                id: "price",
                type: "candlestick",
                barWidth: "58%",
                // ECharts wants [open, close, low, high].
                data: data.candles.map((c) => [c.open, c.close, c.low, c.high]),
                itemStyle: {
                  color: theme.colors.up,
                  borderColor: theme.colors.up,
                  color0: theme.colors.down,
                  borderColor0: theme.colors.down,
                  borderWidth: 1.25,
                },
                emphasis: { disabled: true },
                markLine: previous,
              }
            : {
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
                markLine: previous,
              },
          {
            id: "volume",
            type: "bar",
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: candles ? data.candles.map((c) => c.volume) : data.volumes,
            barWidth: "62%",
            itemStyle: { color: theme.colors.fill, borderRadius: [1, 1, 0, 0] },
            emphasis: { disabled: true },
          },
        ],
      }
    },
    [candles, data, dates, marks, range, stock, up]
  )

  const index = scrub?.index
  const change = stock.last - reference
  const percent = (change / reference) * 100
  const low = Math.min(...data.candles.map((c) => c.low))
  const high = Math.max(...data.candles.map((c) => c.high))
  const rows = candles
    ? data.candles.map((c) => [when(range, c.time), price.format(c.open), price.format(c.high), price.format(c.low), price.format(c.close), compact.format(c.volume)])
    : data.prices.map((p, i) => [when(range, data.times[i]!), price.format(p), compact.format(data.volumes[i]!)])
  const sample = Math.ceil(rows.length / 14)

  const readout = (i: number) => {
    if (!candles) return `${price.format(data.prices[i]!)}, ${when(range, data.times[i]!)}`
    const c = data.candles[i]!
    return `${when(range, c.time)}: open ${price.format(c.open)}, high ${price.format(c.high)}, low ${price.format(c.low)}, close ${price.format(c.close)}`
  }

  return (
    <ChartFrame
      title={`${stock.symbol} ${candles ? "candlesticks" : "price"}, ${spec[range].phrase}`}
      summary={`${stock.name} ${up ? "rose" : "fell"} ${Math.abs(percent).toFixed(2)}% ${spec[range].phrase}, from ${price.format(reference)} to ${price.format(stock.last)}. Low ${price.format(low)}, high ${price.format(high)}.`}
      table={{
        columns: candles ? ["Time", "Open", "High", "Low", "Close", "Volume"] : ["Time", "Price", "Volume"],
        rows: rows.filter((_, i) => i % sample === 0 || i === rows.length - 1),
      }}
      className="ex-price-chart"
    >
      {index !== undefined && scrub ? (
        <div className="mb-chart-callout ex-price-callout" style={{ left: calloutLeft(scrub, candles ? 96 : 48, candles ? 120 : 64) }}>
          {candles ? (
            <>
              <strong>{price.format(data.candles[index]!.close)}</strong>
              <span>
                {when(range, data.candles[index]!.time)} · O {price.format(data.candles[index]!.open)} · H{" "}
                {price.format(data.candles[index]!.high)} · L {price.format(data.candles[index]!.low)}
              </span>
            </>
          ) : (
            <>
              <strong>{price.format(data.prices[index]!)}</strong>
              <span>{when(range, data.times[index]!)}</span>
            </>
          )}
        </div>
      ) : null}
      <EChart
        option={option}
        height={height}
        onScrub={setScrub}
        scrub={{ label: candles ? `${stock.symbol} candles` : `${stock.symbol} price`, count, valueText: readout }}
      />
    </ChartFrame>
  )
}

export { PriceChart }
export type { ChartStyle }
