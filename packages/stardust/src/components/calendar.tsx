"use client"

import {
  Calendar as CalendarPrimitive,
  CalendarDay as CalendarDayPrimitive,
  CalendarGrid as CalendarGridPrimitive,
  CalendarHeading as CalendarHeadingPrimitive,
  CalendarNext as CalendarNextPrimitive,
  CalendarPrevious as CalendarPreviousPrimitive,
  CalendarWeekday as CalendarWeekdayPrimitive,
  CalendarWeekdays as CalendarWeekdaysPrimitive,
  CalendarWeeks as CalendarWeeksPrimitive,
} from "@ui-sdk/react/calendar"
import type * as React from "react"
import { cx, join } from "../lib/cx"
import { ChevronGlyph } from "../lib/field-glyphs"

type CalendarSize = "sm" | "md"

type CalendarProps = React.ComponentProps<typeof CalendarPrimitive> & {
  /** `sm` is the compact month of a macOS date popover; `md` is the graphical date picker. */
  size?: CalendarSize
}

/**
 * The graphical date picker: a month title with chevrons, a weekday row and
 * circular days. Without children it renders a header and a grid per month.
 */
function Calendar({
  size = "md",
  months = 1,
  weekdayFormat,
  showOutsideDays = false,
  className,
  children,
  ...props
}: CalendarProps) {
  return (
    <CalendarPrimitive
      months={months}
      showOutsideDays={showOutsideDays}
      weekdayFormat={weekdayFormat ?? (size === "sm" ? "narrow" : "short")}
      data-size={size}
      className={cx("sd-calendar", className)}
      {...props}
    >
      {children ?? <CalendarBody months={months} />}
    </CalendarPrimitive>
  )
}

/** The header and one grid per month. Shared with the date picker's popover. */
function CalendarBody({ months = 1 }: { months?: number }) {
  return (
    <>
      <CalendarHeader />
      <div className="sd-calendar-months">
        {Array.from({ length: months }, (_, offset) => (
          <CalendarGrid key={offset} offset={offset} />
        ))}
      </div>
    </>
  )
}

/** The month title, with Previous and Next at the trailing edge. */
function CalendarHeader({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={join("sd-calendar-header", className)} {...props}>
      {children ?? (
        <>
          <CalendarHeading />
          <div className="sd-calendar-nav">
            <CalendarPrevious />
            <CalendarNext />
          </div>
        </>
      )}
    </div>
  )
}

function CalendarHeading({ className, ...props }: React.ComponentProps<typeof CalendarHeadingPrimitive>) {
  return <CalendarHeadingPrimitive className={cx("sd-calendar-heading", className)} {...props} />
}

function CalendarPrevious({ className, children, ...props }: React.ComponentProps<typeof CalendarPreviousPrimitive>) {
  return (
    <CalendarPreviousPrimitive className={cx("sd-calendar-step", className)} {...props}>
      {children ?? <ChevronGlyph direction="left" className="sd-calendar-chevron" />}
    </CalendarPreviousPrimitive>
  )
}

function CalendarNext({ className, children, ...props }: React.ComponentProps<typeof CalendarNextPrimitive>) {
  return (
    <CalendarNextPrimitive className={cx("sd-calendar-step", className)} {...props}>
      {children ?? <ChevronGlyph direction="right" className="sd-calendar-chevron" />}
    </CalendarNextPrimitive>
  )
}

/** One month. Without children it renders its weekday row and weeks. */
function CalendarGrid({ offset = 0, className, children, ...props }: React.ComponentProps<typeof CalendarGridPrimitive>) {
  return (
    <CalendarGridPrimitive offset={offset} className={cx("sd-calendar-grid", className)} {...props}>
      {children ?? (
        <>
          <CalendarWeekdays>{(index) => <CalendarWeekday index={index} />}</CalendarWeekdays>
          <CalendarWeeks>{(cell) => <CalendarDay value={cell.date} />}</CalendarWeeks>
        </>
      )}
    </CalendarGridPrimitive>
  )
}

function CalendarWeekdays({ className, ...props }: React.ComponentProps<typeof CalendarWeekdaysPrimitive>) {
  return <CalendarWeekdaysPrimitive className={join("sd-calendar-weekdays", className)} {...props} />
}

function CalendarWeekday({ className, ...props }: React.ComponentProps<typeof CalendarWeekdayPrimitive>) {
  return <CalendarWeekdayPrimitive className={cx("sd-calendar-weekday", className)} {...props} />
}

function CalendarWeeks({ className, ...props }: React.ComponentProps<typeof CalendarWeeksPrimitive>) {
  return <CalendarWeeksPrimitive className={join("sd-calendar-weeks", className)} {...props} />
}

/** A day: a circle that fills with the accent when it's picked. */
function CalendarDay({ className, children, ...props }: React.ComponentProps<typeof CalendarDayPrimitive>) {
  return (
    <CalendarDayPrimitive className={cx("sd-calendar-day", className)} {...props}>
      {children ?? ((state) => <span className="sd-calendar-day-label">{state.label}</span>)}
    </CalendarDayPrimitive>
  )
}

export {
  Calendar,
  CalendarBody,
  CalendarDay,
  CalendarGrid,
  CalendarHeader,
  CalendarHeading,
  CalendarNext,
  CalendarPrevious,
  CalendarWeekday,
  CalendarWeekdays,
  CalendarWeeks,
}
export type { CalendarProps, CalendarSize }
