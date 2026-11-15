"use client"

// Client-only: it holds the confirmation alert's open state.
import { Button as ButtonPrimitive } from "@ui-sdk/react/button"
import * as React from "react"
import { join } from "../lib/cx"
import { Alert, AlertAction, AlertActions, AlertContent, AlertDescription, AlertTitle } from "./alert"

type DoorState = "open" | "closed" | "opening" | "closing" | "stopped"
type DoorTarget = "open" | "closed"

type DoorControlProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** The door's current state, from HomeKit's current door state. */
  state: DoorState
  /** Something is in the way, as when a garage door can't close. */
  obstructed?: boolean
  onTargetChange?: (target: DoorTarget) => void
  /** The door's name, like "Garage door". */
  name: string
  /** Asks before opening. Pass it for a garage door or a gate. */
  confirmOpen?: boolean
  confirmDescription?: string
  kind?: "garage" | "door" | "gate"
  disabled?: boolean
}

function DoorGlyph({ kind }: { kind: "garage" | "door" | "gate" }) {
  const clip = `mb-door-control-${React.useId().replace(/[^\w-]/g, "")}`
  if (kind === "door") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="mb-door-control-glyph">
        <path className="mb-door-control-frame" d="M12 42V8.5A2.5 2.5 0 0 1 14.5 6h19A2.5 2.5 0 0 1 36 8.5V42M8 42h32" />
        <path className="mb-door-control-leaf" d="M15 9h18v33H15Z" />
        <circle className="mb-door-control-knob" cx="29" cy="26" r="1.8" />
      </svg>
    )
  }
  if (kind === "gate") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="mb-door-control-glyph">
        <path className="mb-door-control-frame" d="M7 42V10M41 42V10M5 42h38" />
        <g className="mb-door-control-leaf">
          <path className="mb-door-control-bars" d="M12 16v24M18 14v26M24 13v27M30 14v26M36 16v24M10 22h28M10 34h28" />
        </g>
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="mb-door-control-glyph">
      <path className="mb-door-control-frame" d="M5 19.5 24 7l19 12.5M10 42V20.5M38 42V20.5" />
      <clipPath id={clip}>
        <rect x="13" y="22" width="22" height="20" />
      </clipPath>
      <g clipPath={`url(#${clip})`}>
        <g className="mb-door-control-leaf">
          <rect x="13" y="22" width="22" height="4.2" rx="1" />
          <rect x="13" y="27.3" width="22" height="4.2" rx="1" />
          <rect x="13" y="32.6" width="22" height="4.2" rx="1" />
          <rect x="13" y="37.9" width="22" height="4.1" rx="1" />
        </g>
      </g>
    </svg>
  )
}

const STATUS: Record<DoorState, string> = {
  open: "Open",
  closed: "Closed",
  opening: "Opening…",
  closing: "Closing…",
  stopped: "Stopped",
}

function DoorControl({
  state,
  obstructed,
  onTargetChange,
  name,
  confirmOpen = false,
  confirmDescription,
  kind = "garage",
  disabled,
  className,
  ...props
}: DoorControlProps) {
  const [asking, setAsking] = React.useState(false)
  const moving = state === "opening" || state === "closing"
  const towardOpen = state === "open" || state === "opening"
  const next: DoorTarget = towardOpen || state === "stopped" ? "closed" : "open"
  const status = obstructed ? "Obstruction detected" : STATUS[state]
  const action = `${next === "open" ? "Open" : "Close"} ${name}`

  return (
    <div
      data-state={state}
      data-kind={kind}
      data-position={towardOpen || state === "stopped" ? "open" : "closed"}
      data-pending={moving ? "" : undefined}
      data-obstructed={obstructed ? "" : undefined}
      className={join("mb-door-control", className)}
      {...props}
    >
      <ButtonPrimitive
        aria-label={action}
        disabled={disabled}
        className="mb-door-control-button"
        onClick={() => {
          if (next === "open" && confirmOpen) setAsking(true)
          else onTargetChange?.(next)
        }}
      >
        <DoorGlyph kind={kind} />
      </ButtonPrimitive>
      <span className="mb-door-control-status" aria-live="polite">
        {status}
      </span>
      <Alert
        open={asking}
        onOpenChange={(open, details) => {
          setAsking(open)
          if (!open && details?.returnValue === "open") onTargetChange?.("open")
        }}
      >
        <AlertContent>
          <AlertTitle>Open {name}?</AlertTitle>
          <AlertDescription>{confirmDescription ?? "Make sure nothing is in the way before it moves."}</AlertDescription>
          <AlertActions>
            <AlertAction variant="cancel">Cancel</AlertAction>
            <AlertAction variant="primary" value="open">
              Open
            </AlertAction>
          </AlertActions>
        </AlertContent>
      </Alert>
    </div>
  )
}

export { DoorControl }
export type { DoorControlProps, DoorState, DoorTarget }
