"use client"

import { Button as ButtonPrimitive } from "@ui-sdk/react/button"
import type * as React from "react"
import { join } from "../lib/cx"
import type { SystemColor } from "../lib/theme"
import { ListRow, ListRowAccessory, ListRowIcon, ListRowSubtitle, ListRowTitle } from "./list"
import { Switch } from "./switch"

type AutomationRowProps = {
  icon?: React.ReactNode
  /** The icon tile's color. */
  iconColor?: SystemColor | "gray" | "accent"
  /** When it runs: "When I arrive home", "Sunset", "When Back door opens". */
  title: string
  /** What it does: "Unlock Front door and turn on 3 lights". */
  detail?: React.ReactNode
  enabled?: boolean
  defaultEnabled?: boolean
  onEnabledChange?: (enabled: boolean) => void
  /** Runs when the row is pressed: open the automation's editor. */
  onOpen?: () => void
  /** Names the switch. Defaults to the title. */
  switchLabel?: string
  disabled?: boolean
  className?: string
}

/** An automation in the Automation tab: when it runs, what it does, and a switch to turn it off. Put it in a List. */
function AutomationRow({
  icon,
  iconColor = "accent",
  title,
  detail,
  enabled,
  defaultEnabled,
  onEnabledChange,
  onOpen,
  switchLabel,
  disabled,
  className,
}: AutomationRowProps) {
  const off = enabled === false
  return (
    <ListRow className={join("mb-automation-row", className)} disabled={disabled}>
      {icon ? <ListRowIcon color={iconColor}>{icon}</ListRowIcon> : null}
      <ListRowTitle>{title}</ListRowTitle>
      {detail ? <ListRowSubtitle>{detail}</ListRowSubtitle> : null}
      {onOpen ? (
        <ButtonPrimitive className="mb-automation-row-open" onClick={onOpen} disabled={disabled}>
          <span className="mb-visually-hidden">{title}</span>
        </ButtonPrimitive>
      ) : null}
      <ListRowAccessory className="mb-automation-row-switch" data-off={off ? "" : undefined}>
        <Switch
          aria-label={switchLabel ?? title}
          checked={enabled}
          defaultChecked={defaultEnabled}
          onCheckedChange={onEnabledChange ? (checked) => onEnabledChange(checked) : undefined}
          disabled={disabled}
        />
      </ListRowAccessory>
    </ListRow>
  )
}

export { AutomationRow }
export type { AutomationRowProps }
