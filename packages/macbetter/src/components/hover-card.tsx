"use client"

import {
  HoverCard as HoverCardPrimitive,
  HoverCardArrow,
  HoverCardContent as HoverCardContentPrimitive,
  HoverCardTrigger as HoverCardTriggerPrimitive,
} from "@ui-sdk/react/hover-card"
import type * as React from "react"
import { cx } from "../lib/cx"

type HoverCardProps = React.ComponentProps<typeof HoverCardPrimitive>

function HoverCard(props: HoverCardProps) {
  return <HoverCardPrimitive {...props} />
}

/** The link. It stays a link: pressing it navigates, and the card only previews. */
function HoverCardTrigger({ className, ...props }: React.ComponentProps<typeof HoverCardTriggerPrimitive>) {
  return <HoverCardTriggerPrimitive className={cx("mb-hover-card-trigger", className)} {...props} />
}

type HoverCardContentProps<Payload = unknown> = React.ComponentProps<typeof HoverCardContentPrimitive<Payload>> & {
  /** Draws an arrow that points at the link. Link previews on Apple platforms usually have none. */
  arrow?: boolean
}

function HoverCardContent<Payload = unknown>({
  arrow = false,
  sideOffset,
  arrowPadding = 14,
  className,
  children,
  ...props
}: HoverCardContentProps<Payload>) {
  return (
    <HoverCardContentPrimitive<Payload>
      sideOffset={sideOffset ?? (arrow ? 12 : 8)}
      arrowPadding={arrowPadding}
      className={cx("mb-hover-card", className)}
      {...props}
    >
      {(state) => (
        <>
          {arrow ? <HoverCardArrow className="mb-hover-card-arrow" /> : null}
          {typeof children === "function" ? children(state) : children}
        </>
      )}
    </HoverCardContentPrimitive>
  )
}

export { createHoverCardController } from "@ui-sdk/react/hover-card"
export { HoverCard, HoverCardContent, HoverCardTrigger }
export type { HoverCardContentProps, HoverCardProps }
