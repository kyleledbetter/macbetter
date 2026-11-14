"use client"

import * as React from "react"
import { echarts, EChart } from "./echart"
import { alpha, baseOption, type ChartColor, type ChartTheme } from "./theme"

type SparklineProps = {
  values: number[]
  /** A chart color name. Defaults to green when the line ends above where it started, red when below. */
  color?: ChartColor
  /** A dashed reference line, like the previous close in Stocks. */
  baseline?: number
  /** Fills under the line with a fading gradient. */
  area?: boolean
  width?: number | string
  height?: number
  className?: string
}

/** A tiny trend line, for a watchlist row or a KPI. Decorative: say the trend in text beside it. */
function Sparkline({ values, color, baseline, area, width = 72, height = 32, className }: SparklineProps) {
  const option = React.useCallback(
    (theme: ChartTheme) => {
      const reference = baseline ?? values[0] ?? 0
      const paint = theme.colors[color ?? ((values.at(-1) ?? 0) >= reference ? "up" : "down")]
      const low = Math.min(...values, baseline ?? Infinity)
      const high = Math.max(...values, baseline ?? -Infinity)
      const pad = (high - low) * 0.08 || 1
      return {
        ...baseOption(theme),
        grid: { left: 1, right: 1, top: 2, bottom: 2 },
        xAxis: { type: "category", show: false, boundaryGap: false, data: values.map((_, i) => i) },
        yAxis: { type: "value", show: false, min: low - pad, max: high + pad },
        series: [
          {
            id: "line",
            type: "line",
            data: values,
            showSymbol: false,
            smooth: 0.2,
            lineStyle: { color: paint, width: 1.5, cap: "round", join: "round" },
            areaStyle: area
              ? {
                  origin: "start",
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: alpha(paint, 0.32) },
                    { offset: 1, color: alpha(paint, 0) },
                  ]),
                }
              : undefined,
            markLine:
              baseline === undefined
                ? undefined
                : {
                    silent: true,
                    symbol: "none",
                    label: { show: false },
                    lineStyle: { color: theme.colors.label3, type: [1.5, 2.5], width: 1 },
                    data: [{ yAxis: baseline }],
                  },
          },
        ],
      }
    },
    [values, color, baseline, area]
  )
  return <EChart option={option} height={height} className={className} style={{ width, flex: "none" }} />
}

export { Sparkline }
export type { SparklineProps }
