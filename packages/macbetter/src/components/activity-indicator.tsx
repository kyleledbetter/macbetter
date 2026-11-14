import { Progress as ProgressPrimitive } from "@ui-sdk/react/progress"
import type * as React from "react"
import { cx } from "../lib/cx"

type ActivityIndicatorProps = Omit<React.ComponentProps<typeof ProgressPrimitive>, "value" | "children"> & {
  size?: "sm" | "md" | "lg"
}

const spokes = [0, 1, 2, 3, 4, 5, 6, 7]

/**
 * The Apple spinner: eight spokes that light in turn around the circle, each
 * fading as the next one lights. It keeps turning under Reduce Motion, as the
 * system one does, because the motion is the message. It's an
 * indeterminate progress bar to assistive technology, named "Loading" unless
 * you give it a label.
 */
function ActivityIndicator({ size = "md", className, "aria-label": label, ...props }: ActivityIndicatorProps) {
  return (
    <ProgressPrimitive
      value={null}
      aria-label={props["aria-labelledby"] ? label : (label ?? "Loading")}
      data-size={size}
      className={cx("mb-activity-indicator", className)}
      {...props}
    >
      <svg aria-hidden="true" viewBox="0 0 100 100" className="mb-activity-indicator-spokes">
        {spokes.map((index) => (
          <rect
            key={index}
            x="45"
            y="5"
            width="10"
            height="25"
            rx="5"
            transform={`rotate(${index * 45} 50 50)`}
            style={{ animationDelay: `calc(var(--mb-activity-indicator-duration) * ${(index - 8) / 8})` }}
          />
        ))}
      </svg>
    </ProgressPrimitive>
  )
}

export { ActivityIndicator }
export type { ActivityIndicatorProps }
