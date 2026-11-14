import {
  Radio as RadioPrimitive,
  RadioGroup as RadioGroupPrimitive,
  RadioIndicator as RadioIndicatorPrimitive,
} from "@ui-sdk/react/radio"
import type * as React from "react"
import { cx } from "../lib/cx"

type RadioGroupProps = React.ComponentProps<typeof RadioGroupPrimitive> & {
  /** `list` draws each choice as a row with a checkmark on the trailing edge, as iOS Settings does. */
  variant?: "default" | "list"
}

function RadioGroup({ variant = "default", className, ...props }: RadioGroupProps) {
  return (
    <RadioGroupPrimitive data-variant={variant} className={cx("sd-radio-group", className)} {...props} />
  )
}

type RadioProps = Omit<React.ComponentProps<typeof RadioPrimitive>, "children"> & {
  /** The radio's title. With it, the button and its text are one label. */
  children?: React.ReactNode
  /** A line of secondary text under the title. */
  description?: React.ReactNode
}

function Radio({ className, children, description, ...props }: RadioProps) {
  const button = (
    <RadioPrimitive className={cx("sd-radio", className)} {...props}>
      <RadioIndicatorPrimitive keepMounted className="sd-radio-indicator">
        <svg viewBox="0 0 16 16" aria-hidden="true" className="sd-radio-check">
          <path d="M3.5 8.6 6.6 11.6 12.5 4.6" />
        </svg>
      </RadioIndicatorPrimitive>
    </RadioPrimitive>
  )
  if (children == null && description == null) return button
  return (
    <label className="sd-radio-label">
      {button}
      <span className="sd-radio-text">
        <span className="sd-radio-title">{children}</span>
        {description == null ? null : <span className="sd-radio-description">{description}</span>}
      </span>
    </label>
  )
}

export { Radio, RadioGroup }
export type { RadioGroupProps, RadioProps }
