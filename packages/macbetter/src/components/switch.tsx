import { Switch as SwitchPrimitive, SwitchThumb as SwitchThumbPrimitive } from "@ui-sdk/react/switch"
import type * as React from "react"
import { cx } from "../lib/cx"

type SwitchProps = React.ComponentProps<typeof SwitchPrimitive> & {
  /** `sm` is macOS's mini switch for dense inspectors. */
  size?: "sm" | "md"
}

function SwitchThumb({ className, ...props }: React.ComponentProps<typeof SwitchThumbPrimitive>) {
  return <SwitchThumbPrimitive className={cx("mb-switch-thumb", className)} {...props} />
}

function Switch({ size = "md", className, children, ...props }: SwitchProps) {
  return (
    <SwitchPrimitive data-size={size} className={cx("mb-switch", className)} {...props}>
      {children ?? <SwitchThumb />}
    </SwitchPrimitive>
  )
}

export { Switch, SwitchThumb }
export type { SwitchProps }
