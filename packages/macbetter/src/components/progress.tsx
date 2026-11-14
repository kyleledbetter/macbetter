import {
  ProgressIndicator,
  ProgressLabel as ProgressLabelPrimitive,
  Progress as ProgressPrimitive,
  ProgressTrack,
  ProgressValue as ProgressValuePrimitive,
} from "@ui-sdk/react/progress"
import type * as React from "react"
import { cx } from "../lib/cx"

type ProgressTone = "accent" | "neutral" | "destructive"

type ProgressProps = Omit<React.ComponentProps<typeof ProgressPrimitive>, "children"> & {
  children?: React.ReactNode
  size?: "sm" | "md" | "lg"
  tone?: ProgressTone
}

/**
 * The thin linear bar. Put a ProgressLabel and a ProgressValue inside; the
 * track and its fill are drawn for you, below them.
 */
function Progress({ size = "md", tone = "accent", className, children, ...props }: ProgressProps) {
  return (
    <ProgressPrimitive
      data-size={size}
      data-tone={tone}
      className={cx("mb-progress", className)}
      {...props}
    >
      {children}
      <ProgressTrack className="mb-progress-track">
        <ProgressIndicator className="mb-progress-indicator" />
      </ProgressTrack>
    </ProgressPrimitive>
  )
}

function ProgressLabel({ className, ...props }: React.ComponentProps<typeof ProgressLabelPrimitive>) {
  return <ProgressLabelPrimitive className={cx("mb-progress-label", className)} {...props} />
}

function ProgressValue({ className, ...props }: React.ComponentProps<typeof ProgressValuePrimitive>) {
  return <ProgressValuePrimitive className={cx("mb-progress-value", className)} {...props} />
}

type ProgressCircleProps = Omit<React.ComponentProps<typeof ProgressPrimitive>, "children"> & {
  children?: React.ReactNode
  size?: "sm" | "md" | "lg"
  tone?: ProgressTone
}

/**
 * The circular determinate ring, like a download in the App Store. Anything
 * you put inside sits in the middle, such as a stop button's square.
 */
function ProgressCircle({
  size = "md",
  tone = "accent",
  value,
  min = 0,
  max = 100,
  className,
  children,
  ...props
}: ProgressCircleProps) {
  const percent =
    value === null || value === undefined
      ? null
      : Math.min(Math.max(((value - min) / (max - min || 1)) * 100, 0), 100)

  return (
    <ProgressPrimitive
      value={value}
      min={min}
      max={max}
      data-size={size}
      data-tone={tone}
      className={cx("mb-progress-circle", className)}
      {...props}
    >
      <svg aria-hidden="true" viewBox="0 0 36 36" className="mb-progress-circle-ring">
        <circle className="mb-progress-circle-track" cx="18" cy="18" r="15" pathLength={100} />
        <circle
          className="mb-progress-circle-fill"
          cx="18"
          cy="18"
          r="15"
          pathLength={100}
          strokeDasharray={percent === null ? "28 100" : `${percent} 100`}
        />
      </svg>
      {children}
    </ProgressPrimitive>
  )
}

export { Progress, ProgressCircle, ProgressLabel, ProgressValue }
export type { ProgressCircleProps, ProgressProps, ProgressTone }
