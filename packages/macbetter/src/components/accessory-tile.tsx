"use client"

import { Button as ButtonPrimitive } from "@ui-sdk/react/button"
import { Toggle as TogglePrimitive } from "@ui-sdk/react/toggle"
import type * as React from "react"
import { cx, join } from "../lib/cx"
import { ActivityIndicator } from "./activity-indicator"

type AccessoryTint =
  | "yellow"
  | "orange"
  | "red"
  | "green"
  | "teal"
  | "blue"
  | "indigo"
  | "purple"
  | "accent"
  | "neutral"

type AccessoryTileState = "unreachable" | "updating" | "alert"

type AccessoryTileProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** The icon's color while the accessory is on. Lights are yellow in the Home app. */
  tint?: AccessoryTint
  /** `sm` is the square icon-only tile, `md` the wide tile with a name and status, `lg` the large square tile. */
  size?: "sm" | "md" | "lg"
  /** `unreachable` is "No Response"; `alert` is a sensor that detected a leak, smoke or carbon monoxide. */
  state?: AccessoryTileState
  /** Shows the on look for a tile without a toggle, like an open door or a sensor that detected motion. */
  active?: boolean
  /** A group with some of its members on. */
  partial?: boolean
  children?: React.ReactNode
  icon?: React.ReactNode
  name?: React.ReactNode
  room?: React.ReactNode
  status?: React.ReactNode
  pressed?: boolean
  defaultPressed?: boolean
  onPressedChange?: React.ComponentProps<typeof TogglePrimitive>["onPressedChange"]
  /** Names the icon button. Defaults to the name, when it's a string. */
  toggleLabel?: string
  /** Runs when the name side of the tile is pressed: show the accessory's controls. */
  onOpen?: () => void
  /** `false` for an accessory with nothing to switch, like a sensor. The whole tile opens its details. */
  toggleable?: boolean
}

function AccessoryTile({
  tint = "accent",
  size = "md",
  state,
  active,
  partial,
  className,
  children,
  icon,
  name,
  room,
  status,
  pressed,
  defaultPressed,
  onPressedChange,
  toggleLabel,
  onOpen,
  toggleable = true,
  ...props
}: AccessoryTileProps) {
  const label = toggleLabel ?? (typeof name === "string" ? name : undefined)
  const shownStatus = status ?? (state === "unreachable" ? "No Response" : undefined)
  const text = (
    <>
      <AccessoryTileName>{name}</AccessoryTileName>
      {room ? <AccessoryTileRoom>{room}</AccessoryTileRoom> : null}
      {shownStatus ? <AccessoryTileStatus>{shownStatus}</AccessoryTileStatus> : null}
    </>
  )
  return (
    <div
      data-tint={tint}
      data-size={size}
      data-state={state}
      data-active={active ? "" : undefined}
      data-partial={partial ? "" : undefined}
      aria-busy={state === "updating" ? true : undefined}
      className={join("mb-accessory-tile", className)}
      {...props}
    >
      {children ?? (
        <>
          {toggleable ? (
            <AccessoryTileToggle
              aria-label={label}
              pressed={pressed}
              defaultPressed={defaultPressed}
              onPressedChange={onPressedChange}
              disabled={state === "unreachable"}
              focusableWhenDisabled
            >
              {icon}
            </AccessoryTileToggle>
          ) : (
            <AccessoryTileIcon>{icon}</AccessoryTileIcon>
          )}
          {onOpen ? (
            <AccessoryTileDetail onClick={onOpen}>{text}</AccessoryTileDetail>
          ) : (
            <div className="mb-accessory-tile-detail">{text}</div>
          )}
          {state === "updating" ? <AccessoryTileSpinner /> : null}
        </>
      )}
    </div>
  )
}

/** The icon side of the tile: a toggle that turns the accessory on or off. Name it with the accessory's name. */
function AccessoryTileToggle({ className, children, ...props }: React.ComponentProps<typeof TogglePrimitive>) {
  return (
    <TogglePrimitive className={cx("mb-accessory-tile-toggle", className)} {...props}>
      {typeof children === "function" ? children : <span className="mb-accessory-tile-glyph" aria-hidden="true">{children}</span>}
    </TogglePrimitive>
  )
}

/** The icon of a tile that has nothing to switch, like a sensor. */
function AccessoryTileIcon({ className, children, ...props }: React.ComponentProps<"span">) {
  return (
    <span aria-hidden="true" className={join("mb-accessory-tile-icon", className)} {...props}>
      <span className="mb-accessory-tile-glyph">{children}</span>
    </span>
  )
}

/**
 * The name side of the tile. It covers the whole tile under the icon, so a press
 * anywhere but the icon shows the controls. Pass it as a trigger's `render`.
 */
function AccessoryTileDetail({ className, ...props }: React.ComponentProps<typeof ButtonPrimitive>) {
  return <ButtonPrimitive className={cx("mb-accessory-tile-detail", className)} {...props} />
}

function AccessoryTileName({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={join("mb-accessory-tile-name", className)} {...props} />
}

/** The room, for tiles shown outside their room: in Favorites or a category. */
function AccessoryTileRoom({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={join("mb-accessory-tile-room", className)} {...props} />
}

/** The state in words: "Off", "80%", "Locked", "No Response". */
function AccessoryTileStatus({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={join("mb-accessory-tile-status", className)} {...props} />
}

function AccessoryTileSpinner() {
  return <ActivityIndicator size="sm" aria-label="Updating" className="mb-accessory-tile-spinner" />
}

/** The Home tab's grid: four columns on iPhone, as many as fit on iPad and Mac. */
function AccessoryGrid({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={join("mb-accessory-grid", className)} {...props} />
}

export {
  AccessoryGrid,
  AccessoryTile,
  AccessoryTileDetail,
  AccessoryTileIcon,
  AccessoryTileName,
  AccessoryTileRoom,
  AccessoryTileStatus,
  AccessoryTileToggle,
}
export type { AccessoryTileProps, AccessoryTileState, AccessoryTint }
