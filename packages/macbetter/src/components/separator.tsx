import { Separator as SeparatorPrimitive } from "@ui-sdk/react/separator"
import type * as React from "react"
import { cx, join } from "../lib/cx"

type SeparatorProps = React.ComponentProps<typeof SeparatorPrimitive> & {
  /** `true` insets both ends by the row padding; `leading` only the start, like an iOS list. */
  inset?: boolean | "leading"
}

function Separator({ inset, className, orientation = "horizontal", ...props }: SeparatorProps) {
  return (
    <SeparatorPrimitive
      orientation={orientation}
      data-inset={inset === true ? "both" : inset || undefined}
      className={cx("mb-separator", className)}
      {...props}
    />
  )
}

type SeparatorLabelProps = React.ComponentProps<"div"> & {
  inset?: boolean
}

/** A horizontal rule with a centered label, like "or" between two ways to sign in. */
function SeparatorLabel({ inset, className, children, ...props }: SeparatorLabelProps) {
  return (
    <div
      data-inset={inset ? "both" : undefined}
      className={join("mb-separator-labeled", className)}
      {...props}
    >
      <SeparatorPrimitive decorative className="mb-separator" />
      <span className="mb-separator-label">{children}</span>
      <SeparatorPrimitive decorative className="mb-separator" />
    </div>
  )
}

export { Separator, SeparatorLabel }
export type { SeparatorLabelProps, SeparatorProps }
