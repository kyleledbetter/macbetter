import { type RenderProp, renderElement } from "@ui-sdk/react/primitive"
import type * as React from "react"
import { join } from "../lib/cx"

type ShimmerProps = React.ComponentProps<"span"> & {
  /** While true, a brighter band sweeps along the text. False leaves plain secondary text. */
  active?: boolean
  /** Seconds for one sweep, or any CSS time. */
  duration?: number | string
  /** Renders a different element, such as `<p />`, with the shimmer's props. */
  render?: RenderProp
}

/**
 * Text that shimmers while work is in progress, like "Thinking…". The sweep
 * only ever brightens secondary text, so it reads at every frame, and it
 * holds still under Reduce Motion.
 */
function Shimmer({ active = true, duration, className, style, render, ...props }: ShimmerProps) {
  const time = typeof duration === "number" ? `${duration}s` : duration
  return renderElement(
    "span",
    {
      ...props,
      "data-active": active ? "" : undefined,
      className: join("mb-shimmer", className),
      style: time ? ({ "--mb-shimmer-duration": time, ...style } as React.CSSProperties) : style,
    },
    render
  )
}

export { Shimmer }
export type { ShimmerProps }
