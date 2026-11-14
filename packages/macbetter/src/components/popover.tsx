"use client"

import {
  Popover as PopoverPrimitive,
  PopoverArrow,
  PopoverClose as PopoverClosePrimitive,
  PopoverContent as PopoverContentPrimitive,
  PopoverDescription as PopoverDescriptionPrimitive,
  PopoverTitle as PopoverTitlePrimitive,
  PopoverTrigger as PopoverTriggerPrimitive,
} from "@ui-sdk/react/popover"
import type * as React from "react"
import { cx } from "../lib/cx"

type PopoverProps = React.ComponentProps<typeof PopoverPrimitive>

function Popover(props: PopoverProps) {
  return <PopoverPrimitive {...props} />
}

function PopoverTrigger(props: React.ComponentProps<typeof PopoverTriggerPrimitive>) {
  return <PopoverTriggerPrimitive {...props} />
}

type PopoverContentProps<Payload = unknown> = React.ComponentProps<typeof PopoverContentPrimitive<Payload>> & {
  /** Draws the arrow that points at the trigger. */
  arrow?: boolean
}

function PopoverContent<Payload = unknown>({
  arrow = true,
  sideOffset,
  arrowPadding = 14,
  className,
  children,
  ...props
}: PopoverContentProps<Payload>) {
  return (
    <PopoverContentPrimitive<Payload>
      sideOffset={sideOffset ?? (arrow ? 12 : 6)}
      arrowPadding={arrowPadding}
      data-arrow={arrow ? "" : undefined}
      className={cx("mb-popover", className)}
      {...props}
    >
      {(state) => (
        <>
          {arrow ? <PopoverArrow className="mb-popover-arrow" /> : null}
          {typeof children === "function" ? children(state) : children}
        </>
      )}
    </PopoverContentPrimitive>
  )
}

function PopoverTitle({ className, ...props }: React.ComponentProps<typeof PopoverTitlePrimitive>) {
  return <PopoverTitlePrimitive className={cx("mb-popover-title", className)} {...props} />
}

function PopoverDescription({ className, ...props }: React.ComponentProps<typeof PopoverDescriptionPrimitive>) {
  return <PopoverDescriptionPrimitive className={cx("mb-popover-description", className)} {...props} />
}

function PopoverClose({ className, ...props }: React.ComponentProps<typeof PopoverClosePrimitive>) {
  return <PopoverClosePrimitive className={cx("mb-popover-close", className)} {...props} />
}

export { createPopoverController } from "@ui-sdk/react/popover"
export { Popover, PopoverClose, PopoverContent, PopoverDescription, PopoverTitle, PopoverTrigger }
export type { PopoverContentProps, PopoverProps }
