import {
  Toggle as TogglePrimitive,
  ToggleGroup as ToggleGroupPrimitive,
} from "@ui-sdk/react/toggle"
import type * as React from "react"
import { cx } from "../lib/cx"
import type { AccessoryTint } from "./accessory-tile"

type HomeStatusProps = React.ComponentProps<typeof ToggleGroupPrimitive>

/**
 * The category buttons under the home's name: Climate, Lights, Security, Speakers & TVs, Water, Energy.
 * Each one sums up its category; choosing one shows that category's accessories. One at a time.
 */
function HomeStatus({ className, ...props }: HomeStatusProps) {
  return <ToggleGroupPrimitive className={cx("mb-home-status", className)} {...props} />
}

type HomeStatusItemProps = Omit<React.ComponentProps<typeof TogglePrimitive>, "children"> & {
  /** Identifies the category in the group's value, like "lights". */
  value: string
  icon?: React.ReactNode
  /** The category: "Lights". */
  label: React.ReactNode
  /** What's going on in it: "3 on", "68–72°", "Leak Detected". */
  summary?: React.ReactNode
  tint?: AccessoryTint
  /** Something needs attention, like an unlocked door at night or a detected leak. Say what in `summary`. */
  alert?: boolean
}

function HomeStatusItem({ icon, label, summary, tint = "accent", alert, className, ...props }: HomeStatusItemProps) {
  return (
    <TogglePrimitive
      data-tint={tint}
      data-alert={alert ? "" : undefined}
      className={cx("mb-home-status-item", className)}
      {...props}
    >
      {icon ? (
        <span className="mb-home-status-icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className="mb-home-status-text">
        <span className="mb-home-status-label">{label}</span>
        {summary ? <span className="mb-home-status-summary">{summary}</span> : null}
      </span>
    </TogglePrimitive>
  )
}

export { HomeStatus, HomeStatusItem }
export type { HomeStatusItemProps, HomeStatusProps }
