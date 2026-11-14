import {
  SegmentedControl as SegmentedControlPrimitive,
  SegmentedControlIndicator,
  SegmentedControlItem as SegmentedControlItemPrimitive,
} from "@ui-sdk/react/segmented-control"
import type * as React from "react"
import { cx } from "../lib/cx"

type SegmentedControlProps = Omit<React.ComponentProps<typeof SegmentedControlPrimitive>, "children"> & {
  children?: React.ReactNode
  size?: "sm" | "md" | "lg"
  /** Stretches across the container with equal-width segments. */
  block?: boolean
}

function SegmentedControl({ size = "md", block, className, children, ...props }: SegmentedControlProps) {
  return (
    <SegmentedControlPrimitive
      data-size={size}
      data-block={block ? "" : undefined}
      className={cx("sd-segmented-control", className)}
      {...props}
    >
      <SegmentedControlIndicator className="sd-segmented-control-indicator" />
      {children}
    </SegmentedControlPrimitive>
  )
}

function SegmentedControlItem({
  className,
  ...props
}: React.ComponentProps<typeof SegmentedControlItemPrimitive>) {
  return <SegmentedControlItemPrimitive className={cx("sd-segmented-control-item", className)} {...props} />
}

export { SegmentedControl, SegmentedControlItem }
export type { SegmentedControlProps }
