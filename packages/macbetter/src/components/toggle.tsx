import {
  Toggle as TogglePrimitive,
  ToggleGroup as ToggleGroupPrimitive,
  ToggleIcon as ToggleIconPrimitive,
} from "@ui-sdk/react/toggle"
import * as React from "react"
import { cx } from "../lib/cx"

type ToggleVariant = "plain" | "bezeled"
type ToggleSize = "sm" | "md" | "lg"

type ToggleProps = React.ComponentProps<typeof TogglePrimitive> & {
  /** `plain` is a toolbar button; `bezeled` is a push-on/push-off button in content. */
  variant?: ToggleVariant
  /** `accent` tints the pressed content with the accent color, as Xcode's navigator buttons do. */
  tone?: "neutral" | "accent"
  size?: ToggleSize
}

// Bare text gets a span so the stylesheet can pad a labeled toggle differently from an icon-only one.
function wrapText(children: React.ReactNode) {
  return React.Children.map(children, (child) =>
    typeof child === "string" || typeof child === "number" ? (
      <span className="mb-toggle-label">{child}</span>
    ) : (
      child
    )
  )
}

// No defaults written to the DOM: a toggle inside a ToggleGroup takes the group's variant and size.
function Toggle({ variant, tone, size, className, children, ...props }: ToggleProps) {
  return (
    <TogglePrimitive
      data-variant={variant}
      data-tone={tone}
      data-size={size}
      className={cx("mb-toggle", className)}
      {...props}
    >
      {typeof children === "function" ? children : wrapText(children)}
    </TogglePrimitive>
  )
}

function ToggleIcon({ className, ...props }: React.ComponentProps<typeof ToggleIconPrimitive>) {
  return <ToggleIconPrimitive className={cx("mb-toggle-icon", className)} {...props} />
}

type ToggleGroupProps = React.ComponentProps<typeof ToggleGroupPrimitive> & {
  /** `bezeled` joins the toggles into one raised control, like a "select any" segmented control on macOS. */
  variant?: ToggleVariant
  size?: ToggleSize
}

function ToggleGroup({ variant = "plain", size = "md", className, ...props }: ToggleGroupProps) {
  return (
    <ToggleGroupPrimitive
      data-variant={variant}
      data-size={size}
      className={cx("mb-toggle-group", className)}
      {...props}
    />
  )
}

export { Toggle, ToggleGroup, ToggleIcon }
export type { ToggleGroupProps, ToggleProps, ToggleSize, ToggleVariant }
