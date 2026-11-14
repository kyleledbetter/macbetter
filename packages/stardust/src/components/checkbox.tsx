import {
  Checkbox as CheckboxPrimitive,
  CheckboxGroup as CheckboxGroupPrimitive,
  CheckboxIndicator as CheckboxIndicatorPrimitive,
} from "@ui-sdk/react/checkbox"
import type * as React from "react"
import { cx } from "../lib/cx"

type CheckboxProps = Omit<React.ComponentProps<typeof CheckboxPrimitive>, "children"> & {
  /** The checkbox's title. With it, the box and its text are one label, as `NSButton(checkboxWithTitle:)` is. */
  children?: React.ReactNode
  /** A line of secondary text under the title. */
  description?: React.ReactNode
}

function CheckboxIndicator({ className, ...props }: React.ComponentProps<typeof CheckboxIndicatorPrimitive>) {
  return (
    <CheckboxIndicatorPrimitive className={cx("sd-checkbox-indicator", className)} {...props}>
      <svg viewBox="0 0 16 16" aria-hidden="true" className="sd-checkbox-glyph">
        <path className="sd-checkbox-check" pathLength={1} d="M4.25 8.4 6.9 11 11.75 5" />
        <path className="sd-checkbox-dash" pathLength={1} d="M4.5 8h7" />
      </svg>
    </CheckboxIndicatorPrimitive>
  )
}

function Checkbox({ className, children, description, ...props }: CheckboxProps) {
  const box = (
    <CheckboxPrimitive className={cx("sd-checkbox", className)} {...props}>
      <CheckboxIndicator />
    </CheckboxPrimitive>
  )
  if (children == null && description == null) return box
  return (
    <label className="sd-checkbox-label">
      {box}
      <span className="sd-checkbox-text">
        <span className="sd-checkbox-title">{children}</span>
        {description == null ? null : <span className="sd-checkbox-description">{description}</span>}
      </span>
    </label>
  )
}

function CheckboxGroup({ className, ...props }: React.ComponentProps<typeof CheckboxGroupPrimitive>) {
  return <CheckboxGroupPrimitive className={cx("sd-checkbox-group", className)} {...props} />
}

export { Checkbox, CheckboxGroup, CheckboxIndicator }
export type { CheckboxProps }
