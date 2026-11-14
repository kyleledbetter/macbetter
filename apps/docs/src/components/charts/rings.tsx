"use client"

import * as React from "react"
import { EChart } from "./echart"
import { alpha, baseOption, type ChartColor, type ChartTheme } from "./theme"

type Ring = { value: number; goal: number }
type Rings = { move: Ring; exercise: Ring; stand: Ring }

const order: { key: keyof Rings; color: ChartColor }[] = [
  { key: "move", color: "move" },
  { key: "exercise", color: "exercise" },
  { key: "stand", color: "stand" },
]

/**
 * Gauge series for one set of Activity rings: Move outside, Stand inside.
 * A ring past its goal laps itself, and the lap's end casts a shadow on the
 * ring under it, as on Apple Watch.
 */
function ringSeries(
  theme: ChartTheme,
  rings: Rings,
  { center = ["50%", "50%"], size, id = "rings" }: { center?: [string | number, string | number]; size: number; id?: string }
) {
  const width = size * 0.115
  const gap = Math.max(size * 0.012, 1.5)
  const common = {
    type: "gauge",
    center,
    startAngle: 90,
    endAngle: -270,
    min: 0,
    max: 1,
    pointer: { show: false },
    axisTick: { show: false },
    splitLine: { show: false },
    axisLabel: { show: false },
    detail: { show: false },
    title: { show: false },
    animationDuration: 1200,
    animationEasing: "cubicOut",
  }
  return order.flatMap(({ key, color }, index) => {
    const { value, goal } = rings[key]
    const progress = goal > 0 ? value / goal : 0
    const radius = size / 2 - index * (width + gap)
    const paint = theme.colors[color]
    const ring = {
      ...common,
      id: `${id}-${key}`,
      radius,
      axisLine: { roundCap: true, lineStyle: { width, color: [[1, alpha(paint, theme.dark ? 0.24 : 0.18)]] } },
      progress: { show: progress > 0, width, roundCap: true, itemStyle: { color: paint } },
      data: [{ value: Math.min(progress, 1) }],
    }
    if (progress <= 1) return [ring]
    const lap = {
      ...common,
      id: `${id}-${key}-lap`,
      radius,
      animationDelay: 600,
      axisLine: { show: false },
      progress: {
        show: true,
        width,
        roundCap: true,
        itemStyle: { color: paint, shadowBlur: width * 0.45, shadowColor: "rgba(0, 0, 0, 0.5)" },
      },
      data: [{ value: Math.min(progress - 1, 0.98) }],
    }
    return [ring, lap]
  })
}

type ActivityRingsProps = {
  rings: Rings
  /** Diameter in pixels. */
  size?: number
  className?: string
}

/** Move, Exercise and Stand rings. Decorative: put the numbers beside them in text. */
function ActivityRings({ rings, size = 160, className }: ActivityRingsProps) {
  const option = React.useCallback(
    (theme: ChartTheme) => ({ ...baseOption(theme), series: ringSeries(theme, rings, { size }) }),
    [rings, size]
  )
  return <EChart option={option} height={size} className={className} style={{ width: size, flex: "none" }} />
}

export { ActivityRings, ringSeries }
export type { ActivityRingsProps, Ring, Rings }
