import {
  MeterIndicator,
  MeterLabel,
  Meter as MeterPrimitive,
  MeterTrack,
  MeterValue,
} from "@ui-sdk/react/meter"
import type * as React from "react"
import { cx } from "../lib/cx"

type GaugeVariant = "linear" | "level" | "circular"
type GaugeLevel = "optimum" | "suboptimal" | "critical"

type GaugeProps = Omit<React.ComponentProps<typeof MeterPrimitive>, "children"> & {
  children?: React.ReactNode
  /** `level` is the macOS segmented level indicator; `circular` is the open ring from watchOS and iOS widgets. */
  variant?: GaugeVariant
  size?: "sm" | "md" | "lg"
  /** Where the low region ends. With `high` and `optimum`, picks green, yellow or red as for an HTML meter. */
  low?: number
  /** Where the high region starts. */
  high?: number
  /** The best value. Below `low` means lower is better; above `high` means higher is better. */
  optimum?: number
  /** How many segments a `level` gauge draws. */
  segments?: number
  /** Draws the whole ring in a green-to-red gradient with a marker at the value, for a `circular` gauge. */
  gradient?: boolean
}

function levelOf(
  value: number,
  min: number,
  max: number,
  low?: number,
  high?: number,
  optimum?: number
): GaugeLevel | undefined {
  if (low === undefined && high === undefined) return undefined
  const lo = Math.min(Math.max(low ?? min, min), max)
  const hi = Math.min(Math.max(high ?? max, lo), max)
  const best = optimum ?? (min + max) / 2
  if (best < lo) return value <= lo ? "optimum" : value <= hi ? "suboptimal" : "critical"
  if (best > hi) return value >= hi ? "optimum" : value >= lo ? "suboptimal" : "critical"
  return value >= lo && value <= hi ? "optimum" : "suboptimal"
}

// A 270° arc open at the bottom, in a 100-unit box.
const arc = "M20.3 79.7A42 42 0 1 1 79.7 79.7"

function Gauge({
  variant = "linear",
  size = "md",
  value,
  min = 0,
  max = 100,
  low,
  high,
  optimum,
  segments = 10,
  gradient,
  className,
  children,
  ...props
}: GaugeProps) {
  const fraction = Math.min(Math.max((value - min) / (max - min || 1), 0), 1)
  const level = levelOf(value, min, max, low, high, optimum)
  const lit = Math.round(fraction * segments)
  const higherIsBetter = optimum !== undefined && high !== undefined && optimum > high

  let visual: React.ReactNode
  if (variant === "circular") {
    const angle = ((135 + 270 * fraction) * Math.PI) / 180
    visual = (
      <span aria-hidden="true" className="mb-gauge-dial">
        {gradient ? <span className="mb-gauge-gradient" /> : null}
        <svg viewBox="0 0 100 100" className="mb-gauge-ring">
          {gradient ? (
            <circle
              className="mb-gauge-marker"
              cx={50 + 42 * Math.cos(angle)}
              cy={50 + 42 * Math.sin(angle)}
              r="6"
            />
          ) : (
            <>
              <path className="mb-gauge-arc-track" d={arc} pathLength={100} />
              <path
                className="mb-gauge-arc-edge"
                d={arc}
                pathLength={100}
                strokeDasharray={`${fraction * 100} 100`}
              />
              <path
                className="mb-gauge-arc-fill"
                d={arc}
                pathLength={100}
                strokeDasharray={`${fraction * 100} 100`}
              />
            </>
          )}
        </svg>
      </span>
    )
  } else if (variant === "level") {
    visual = (
      <MeterTrack className="mb-gauge-track">
        {Array.from({ length: segments }, (_, index) => (
          <span key={index} data-lit={index < lit ? "" : undefined} className="mb-gauge-segment" />
        ))}
      </MeterTrack>
    )
  } else {
    visual = (
      <MeterTrack className="mb-gauge-track">
        <MeterIndicator className="mb-gauge-indicator" />
      </MeterTrack>
    )
  }

  return (
    <MeterPrimitive
      value={value}
      min={min}
      max={max}
      data-variant={variant}
      data-size={size}
      data-level={level}
      data-gradient={gradient ? (higherIsBetter ? "reverse" : "") : undefined}
      className={cx("mb-gauge", className)}
      {...props}
    >
      {children}
      {visual}
    </MeterPrimitive>
  )
}

function GaugeLabel({ className, ...props }: React.ComponentProps<typeof MeterLabel>) {
  return <MeterLabel className={cx("mb-gauge-label", className)} {...props} />
}

function GaugeValue({ className, ...props }: React.ComponentProps<typeof MeterValue>) {
  return <MeterValue className={cx("mb-gauge-value", className)} {...props} />
}

export { Gauge, GaugeLabel, GaugeValue }
export type { GaugeLevel, GaugeProps, GaugeVariant }
