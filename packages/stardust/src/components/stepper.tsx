import {
  NumberInput,
  NumberInputControl,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
} from "@ui-sdk/react/number-input"
import type * as React from "react"
import { cx } from "../lib/cx"

type NumberInputRootProps = Omit<React.ComponentProps<typeof NumberInput>, "children"> & {
  /** Content before the field, like a scrub area. */
  children?: React.ReactNode
  size?: "sm" | "md"
}

type StepperButtonsProps = {
  /** Names the decrement button. */
  decrementLabel?: string
  /** Names the increment button. */
  incrementLabel?: string
}

// Both glyph sets are drawn; the stylesheet shows chevrons on macOS and − / + on touch.
function DecrementGlyphs() {
  return (
    <>
      <svg viewBox="0 0 10 6" aria-hidden="true" className="sd-stepper-glyph" data-glyph="chevron">
        <path d="M2 1.5 5 4.5 8 1.5" />
      </svg>
      <svg viewBox="0 0 16 16" aria-hidden="true" className="sd-stepper-glyph" data-glyph="sign">
        <path d="M3 8h10" />
      </svg>
    </>
  )
}

function IncrementGlyphs() {
  return (
    <>
      <svg viewBox="0 0 10 6" aria-hidden="true" className="sd-stepper-glyph" data-glyph="chevron">
        <path d="M2 4.5 5 1.5 8 4.5" />
      </svg>
      <svg viewBox="0 0 16 16" aria-hidden="true" className="sd-stepper-glyph" data-glyph="sign">
        <path d="M3 8h10M8 3v10" />
      </svg>
    </>
  )
}

function StepperButtons({ decrementLabel = "Decrease", incrementLabel = "Increase" }: StepperButtonsProps) {
  return (
    <>
      <NumberInputDecrement aria-label={decrementLabel} className="sd-stepper-button" data-step="decrement">
        <DecrementGlyphs />
      </NumberInputDecrement>
      <NumberInputIncrement aria-label={incrementLabel} className="sd-stepper-button" data-step="increment">
        <IncrementGlyphs />
      </NumberInputIncrement>
    </>
  )
}

type NumberFieldProps = NumberInputRootProps &
  StepperButtonsProps & {
    /** Placeholder for the empty field. */
    placeholder?: string
  }

/**
 * A number in a text field with a stepper beside it: up and down arrows on macOS,
 * a − / + capsule on iPadOS and iOS. `aria-label` and `aria-labelledby` name the text field.
 */
function NumberField({
  size = "md",
  decrementLabel,
  incrementLabel,
  placeholder,
  "aria-label": label,
  "aria-labelledby": labelledBy,
  className,
  children,
  ...props
}: NumberFieldProps) {
  return (
    <NumberInput data-size={size} className={cx("sd-number-field", className)} {...props}>
      {children}
      <NumberInputGroup className="sd-number-field-group">
        <NumberInputControl
          aria-label={label}
          aria-labelledby={labelledBy}
          placeholder={placeholder}
          className="sd-number-field-input"
        />
        <span className="sd-stepper-buttons">
          <StepperButtons decrementLabel={decrementLabel} incrementLabel={incrementLabel} />
        </span>
      </NumberInputGroup>
    </NumberInput>
  )
}

type StepperProps = NumberInputRootProps & StepperButtonsProps

/**
 * The stepper alone, for a value shown elsewhere, like a quantity in a row's title.
 * Its number field is visually hidden but still takes focus, so the arrow keys and screen readers work.
 */
function Stepper({
  size = "md",
  decrementLabel,
  incrementLabel,
  "aria-label": label,
  "aria-labelledby": labelledBy,
  className,
  children,
  ...props
}: StepperProps) {
  return (
    <NumberInput data-size={size} className={cx("sd-stepper", className)} {...props}>
      {children}
      <NumberInputGroup className="sd-stepper-buttons">
        <NumberInputControl aria-label={label} aria-labelledby={labelledBy} className="sd-stepper-input" />
        <StepperButtons decrementLabel={decrementLabel} incrementLabel={incrementLabel} />
      </NumberInputGroup>
    </NumberInput>
  )
}

export { NumberField, Stepper }
export type { NumberFieldProps, StepperProps }
