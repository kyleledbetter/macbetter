import {
  Tooltip as TooltipPrimitive,
  TooltipContent as TooltipContentPrimitive,
  TooltipShortcut as TooltipShortcutPrimitive,
  TooltipTrigger as TooltipTriggerPrimitive,
} from "@ui-sdk/react/tooltip"
import type * as React from "react"
import { cx } from "../lib/cx"

type TooltipProps = React.ComponentProps<typeof TooltipPrimitive>

/** A macOS help tag. It appears after a short rest; set `delay` to change how long. */
function Tooltip({ delay = 400, ...props }: TooltipProps) {
  return <TooltipPrimitive delay={delay} {...props} />
}

function TooltipTrigger(props: React.ComponentProps<typeof TooltipTriggerPrimitive>) {
  return <TooltipTriggerPrimitive {...props} />
}

function TooltipContent({
  side = "bottom",
  sideOffset = 6,
  collisionPadding = 8,
  className,
  ...props
}: React.ComponentProps<typeof TooltipContentPrimitive>) {
  return (
    <TooltipContentPrimitive
      side={side}
      sideOffset={sideOffset}
      collisionPadding={collisionPadding}
      className={cx("mb-tooltip", className)}
      {...props}
    />
  )
}

function TooltipShortcut({ className, ...props }: React.ComponentProps<typeof TooltipShortcutPrimitive>) {
  return <TooltipShortcutPrimitive className={cx("mb-tooltip-shortcut", className)} {...props} />
}

export { createTooltipController } from "@ui-sdk/react/tooltip"
export { Tooltip, TooltipContent, TooltipShortcut, TooltipTrigger }
export type { TooltipProps }
