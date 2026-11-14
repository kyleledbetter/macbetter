import type * as React from "react"
import { join } from "../lib/cx"
import type { SystemColor } from "../lib/theme"

type BadgeColor = SystemColor | "accent" | "gray"

type BadgeProps = Omit<React.ComponentProps<"span">, "color"> & {
  /** `dot` is a colored dot beside plain text, for a status in a table or list. */
  variant?: "tinted" | "filled" | "outline" | "dot"
  color?: BadgeColor
  size?: "sm" | "md"
}

function Badge({ variant = "tinted", color = "accent", size = "md", className, children, ...props }: BadgeProps) {
  return (
    <span
      data-variant={variant}
      data-color={color}
      data-size={size}
      className={join("mb-badge", className)}
      {...props}
    >
      {variant === "dot" ? <span aria-hidden="true" className="mb-badge-dot" /> : null}
      {children}
    </span>
  )
}

type NotificationBadgeProps = Omit<React.ComponentProps<"span">, "children"> & {
  /** Leave it out for a plain dot that says only "something new". */
  count?: number
  /** Counts above this read as `max+`. */
  max?: number
  /** What is being counted, read after the number: "unread messages". */
  label?: string
  size?: "sm" | "md" | "lg"
}

function NotificationBadge({
  count,
  max = 99,
  label,
  size = "md",
  className,
  ...props
}: NotificationBadgeProps) {
  if (count !== undefined && count <= 0) return null
  const text = count === undefined ? undefined : count > max ? `${max}+` : String(count)
  const spoken = [count === undefined ? undefined : count > max ? `More than ${max}` : String(count), label]
    .filter(Boolean)
    .join(" ")

  return (
    <span
      data-size={size}
      data-dot={text === undefined ? "" : undefined}
      className={join("mb-notification-badge", className)}
      {...props}
    >
      {text === undefined ? null : <span aria-hidden="true">{text}</span>}
      {spoken ? <span className="mb-visually-hidden">{spoken}</span> : null}
    </span>
  )
}

/** Pins a NotificationBadge to the top trailing corner of an icon, an avatar or a button. */
function BadgeAnchor({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={join("mb-badge-anchor", className)} {...props} />
}

export { Badge, BadgeAnchor, NotificationBadge }
export type { BadgeColor, BadgeProps, NotificationBadgeProps }
