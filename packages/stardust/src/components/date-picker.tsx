"use client"

import { createDateInputController, DateInput, DateInputSegment } from "@ui-sdk/react/date-input"
import {
  createDatePickerController,
  DatePicker as DatePickerPrimitive,
  DatePickerContent as DatePickerContentPrimitive,
  DatePickerTrigger as DatePickerTriggerPrimitive,
} from "@ui-sdk/react/date-picker"
import { TimeInput, TimeInputSegment } from "@ui-sdk/react/time-input"
import * as React from "react"
import { cx } from "../lib/cx"
import { CalendarGlyph } from "../lib/field-glyphs"
import { CalendarBody } from "./calendar"

type FieldSize = "sm" | "md" | "lg"

const rtlLanguages = new Set(["ar", "ckb", "dv", "fa", "he", "ps", "sd", "ug", "ur", "yi"])

/**
 * Segments follow the direction of the locale that formats them, not the page:
 * "11/14/2026" stays in that order on a right-to-left page, as AppKit's date field does.
 */
function localeDir(locale?: string): "ltr" | "rtl" {
  const resolved = new Intl.DateTimeFormat(locale).resolvedOptions().locale
  return rtlLanguages.has(resolved.split("-")[0] ?? "") ? "rtl" : "ltr"
}
type FieldVariant = "auto" | "bordered" | "filled"

type DateFieldProps = React.ComponentProps<typeof DateInput> & {
  size?: FieldSize
  /** `auto` is bordered on macOS and filled on touch, like `TextField`. */
  variant?: FieldVariant
}

/** A date typed one part at a time: month, day and year in the locale's order. Arrow keys step a part. */
function DateField({ size = "md", variant = "auto", className, children, ...props }: DateFieldProps) {
  return (
    <DateInput
      dir={localeDir(props.locale)}
      data-size={size}
      data-variant={variant}
      className={cx("sd-date-field", className)}
      {...props}
    >
      {children ??
        (({ segments }) =>
          segments.map((segment) => (
            <DateInputSegment key={segment.key} segment={segment} className="sd-date-field-segment" />
          )))}
    </DateInput>
  )
}

type TimeFieldProps = React.ComponentProps<typeof TimeInput> & {
  size?: FieldSize
  variant?: FieldVariant
}

/** A time of day, typed or stepped one part at a time, on the locale's clock. */
function TimeField({ size = "md", variant = "auto", className, children, ...props }: TimeFieldProps) {
  return (
    <TimeInput
      dir={localeDir(props.locale)}
      data-size={size}
      data-variant={variant}
      className={cx("sd-date-field sd-time-field", className)}
      {...props}
    >
      {children ??
        (({ segments }) =>
          segments.map((segment) => (
            <TimeInputSegment key={segment.key} segment={segment} className="sd-date-field-segment" />
          )))}
    </TimeInput>
  )
}

type PrimitiveProps = React.ComponentProps<typeof DatePickerPrimitive>
type DateValue = string | null
type PickerDetails = Parameters<NonNullable<PrimitiveProps["onValueChange"]>>[1]
type SegmentDetails = Parameters<NonNullable<React.ComponentProps<typeof DateInput>["onValueChange"]>>[1]

type DatePickerProps = Omit<PrimitiveProps, "mode" | "value" | "defaultValue" | "onValueChange"> & {
  value?: DateValue
  defaultValue?: DateValue
  /** Runs when a day is picked in the calendar, or typing completes a date in the segments. */
  onValueChange?: (value: DateValue, details: PickerDetails | SegmentDetails) => void
  /**
   * `field` is the macOS date field: segments you type or step, and a calendar
   * button. `compact` is a button showing the date, as on iOS.
   */
  variant?: "field" | "compact"
  size?: FieldSize
  "aria-label"?: string
  "aria-labelledby"?: string
  id?: string
}

/**
 * A date field whose calendar opens in a popover, or a sheet on a small touch
 * screen. Without children it renders the field, the button and the calendar.
 */
function DatePicker({
  variant = "field",
  size = "md",
  value: valueProp,
  defaultValue = null,
  onValueChange,
  presentation = "auto",
  weekdayFormat = "narrow",
  fixedWeeks = true,
  showOutsideDays = false,
  months = 1,
  locale,
  min,
  max,
  unavailable,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  id,
  controller: controllerProp,
  className,
  children,
  ...props
}: DatePickerProps) {
  const [own] = React.useState(createDatePickerController)
  const picker = controllerProp ?? own
  const [current, setCurrent] = React.useState<DateValue>(defaultValue)
  const value = valueProp !== undefined ? valueProp : current
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null)
  const [segments] = React.useState(createDateInputController)
  const typed = React.useRef(false)

  // A date picked in the calendar shows in the segments; one typed there is already showing.
  React.useEffect(() => {
    if (variant !== "field") return
    if (typed.current) {
      typed.current = false
      return
    }
    if (segments.getValue() !== value) segments.setValue(value)
  }, [segments, value, variant])

  const commit = (next: unknown, details: PickerDetails | SegmentDetails) => {
    const date = typeof next === "string" ? next : null
    onValueChange?.(date, details)
    if (!details.canceled && valueProp === undefined) setCurrent(date)
  }

  return (
    <DatePickerPrimitive
      value={value}
      onValueChange={commit}
      controller={picker}
      presentation={presentation}
      weekdayFormat={weekdayFormat}
      fixedWeeks={fixedWeeks}
      showOutsideDays={showOutsideDays}
      months={months}
      locale={locale}
      min={min}
      max={max}
      unavailable={unavailable}
      data-variant={variant}
      data-size={size}
      className={cx("sd-date-picker", className)}
      {...props}
    >
      {children ?? (
        <>
          {variant === "compact" ? (
            <DatePickerTriggerPrimitive
              id={id}
              aria-label={ariaLabel && `${ariaLabel}, ${format(value, locale) ?? "none"}`}
              aria-labelledby={ariaLabelledBy}
              className="sd-date-picker-button"
            >
              {format(value, locale) ?? "Choose a date"}
            </DatePickerTriggerPrimitive>
          ) : (
            <div
              ref={setAnchor}
              data-size={size}
              className="sd-date-picker-field"
              onKeyDown={(event) => {
                if (event.altKey && event.key === "ArrowDown") {
                  event.preventDefault()
                  picker.setOpen(true)
                }
              }}
            >
              <DateInput
                controller={segments}
                defaultValue={value}
                locale={locale}
                min={min}
                max={max}
                unavailable={unavailable}
                id={id}
                dir={localeDir(locale)}
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledBy}
                className="sd-date-picker-segments"
                onValueChange={(next, details) => {
                  if (details.reason === "imperative") return
                  typed.current = true
                  commit(next, details)
                }}
              >
                {({ segments: parts }) =>
                  parts.map((segment) => (
                    <DateInputSegment key={segment.key} segment={segment} className="sd-date-field-segment" />
                  ))
                }
              </DateInput>
              <DatePickerTrigger aria-label="Show calendar" />
            </div>
          )}
          <DatePickerContent anchor={variant === "compact" ? undefined : anchor} months={months} />
        </>
      )}
    </DatePickerPrimitive>
  )
}

function format(value: DateValue, locale?: string): string | null {
  if (!value) return null
  const [y, m, d] = value.split("-").map(Number)
  if (!y || !m || !d) return null
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone: "UTC" }).format(Date.UTC(y, m - 1, d))
}

/** Opens and closes the calendar. Without children it's a calendar glyph. */
function DatePickerTrigger({ className, children, ...props }: React.ComponentProps<typeof DatePickerTriggerPrimitive>) {
  return (
    <DatePickerTriggerPrimitive className={cx("sd-date-picker-trigger", className)} {...props}>
      {children ?? <CalendarGlyph />}
    </DatePickerTriggerPrimitive>
  )
}

type DatePickerContentProps = React.ComponentProps<typeof DatePickerContentPrimitive> & {
  /** How many month grids the default calendar shows. */
  months?: number
}

/** The calendar's popover: a translucent material. Without children it holds the compact calendar. */
function DatePickerContent({ months, sideOffset = 6, align = "start", className, children, ...props }: DatePickerContentProps) {
  return (
    <DatePickerContentPrimitive
      sideOffset={sideOffset}
      align={align}
      className={cx("sd-date-picker-content", className)}
      {...props}
    >
      {children ?? (
        <div className="sd-calendar sd-date-picker-calendar" data-size="sm">
          <CalendarBody months={months} />
        </div>
      )}
    </DatePickerContentPrimitive>
  )
}

export { DateField, DatePicker, DatePickerContent, DatePickerTrigger, TimeField }
export type { DateFieldProps, DatePickerContentProps, DatePickerProps, TimeFieldProps }
