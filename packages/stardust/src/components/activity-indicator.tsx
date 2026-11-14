import { Progress as ProgressPrimitive } from "@ui-sdk/react/progress"
import type * as React from "react"
import { cx } from "../lib/cx"

type ActivityIndicatorProps = Omit<React.ComponentProps<typeof ProgressPrimitive>, "value" | "children"> & {
  size?: "sm" | "md" | "lg"
}

// Capsule spokes, as on iOS 13+ and macOS 11+: the one just behind the lead is dimmest, and the fan steps clockwise.
const spokes = [1, 0.3, 0.36, 0.43, 0.51, 0.6, 0.71, 0.84]

/**
 * The Apple spinner: eight spokes that turn one step at a time. It's an
 * indeterminate progress bar to assistive technology, named "Loading" unless
 * you give it a label.
 */
function ActivityIndicator({ size = "md", className, "aria-label": label, ...props }: ActivityIndicatorProps) {
  return (
    <ProgressPrimitive
      value={null}
      aria-label={props["aria-labelledby"] ? label : (label ?? "Loading")}
      data-size={size}
      className={cx("sd-activity-indicator", className)}
      {...props}
    >
      <svg aria-hidden="true" viewBox="0 0 100 100" className="sd-activity-indicator-spokes">
        {/* The turning carries meaning, so it opts out of the reduced-motion reset and breathes instead. */}
        <g className="sd-activity-indicator-fan" data-motion="essential">
          {spokes.map((opacity, index) => (
            <rect
              key={index * 45}
              x="45"
              y="5"
              width="10"
              height="25"
              rx="5"
              opacity={opacity}
              transform={`rotate(${index * 45} 50 50)`}
            />
          ))}
        </g>
      </svg>
    </ProgressPrimitive>
  )
}

export { ActivityIndicator }
export type { ActivityIndicatorProps }
