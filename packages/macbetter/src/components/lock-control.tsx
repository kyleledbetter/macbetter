"use client"

// Client-only: it holds the confirmation alert's open state.
import { Button as ButtonPrimitive } from "@ui-sdk/react/button"
import * as React from "react"
import { join } from "../lib/cx"
import { Alert, AlertAction, AlertActions, AlertContent, AlertDescription, AlertTitle } from "./alert"

type LockState = "secured" | "unsecured" | "jammed" | "unknown"
type LockTarget = "secured" | "unsecured"

type LockControlProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** The lock's current state, from HomeKit's lock mechanism current state. */
  state: LockState
  /** What it was last asked to do. While it differs from `state`, the control shows Locking… or Unlocking…. */
  target?: LockTarget
  onTargetChange?: (target: LockTarget) => void
  /** The lock's name, like "Front door". */
  name: string
  /** Asks before unlocking, as the HIG asks for actions that affect security. */
  confirmUnlock?: boolean
  /** The explanation in the unlock alert. */
  confirmDescription?: string
  disabled?: boolean
}

function LockGlyph() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="mb-lock-control-glyph">
      <path className="mb-lock-control-shackle" d="M15 22v-6.5a9 9 0 0 1 18 0V22" />
      <path
        className="mb-lock-control-body"
        fillRule="evenodd"
        d="M15.5 21h17a5.5 5.5 0 0 1 5.5 5.5v10a5.5 5.5 0 0 1-5.5 5.5h-17a5.5 5.5 0 0 1-5.5-5.5v-10a5.5 5.5 0 0 1 5.5-5.5ZM24 27.5a2.8 2.8 0 0 0-1.4 5.22V36h2.8v-3.28A2.8 2.8 0 0 0 24 27.5Z"
      />
    </svg>
  )
}

const STATUS: Record<LockState, string> = {
  secured: "Locked",
  unsecured: "Unlocked",
  jammed: "Jammed",
  unknown: "Status unknown",
}

function LockControl({
  state,
  target,
  onTargetChange,
  name,
  confirmUnlock = true,
  confirmDescription,
  disabled,
  className,
  ...props
}: LockControlProps) {
  const [asking, setAsking] = React.useState(false)
  const pending = target !== undefined && target !== state && state !== "jammed"
  const goal: LockState = pending ? target : state
  const next: LockTarget = goal === "secured" ? "unsecured" : "secured"
  const status = pending ? (target === "secured" ? "Locking…" : "Unlocking…") : STATUS[state]
  const action = `${next === "secured" ? "Lock" : "Unlock"} ${name}`

  return (
    <div
      data-state={state}
      data-position={goal === "secured" ? "locked" : "unlocked"}
      data-pending={pending ? "" : undefined}
      className={join("mb-lock-control", className)}
      {...props}
    >
      <ButtonPrimitive
        aria-label={action}
        disabled={disabled}
        className="mb-lock-control-button"
        onClick={() => {
          if (next === "unsecured" && confirmUnlock) setAsking(true)
          else onTargetChange?.(next)
        }}
      >
        <LockGlyph />
      </ButtonPrimitive>
      <span className="mb-lock-control-status" aria-live="polite">
        {status}
      </span>
      <Alert
        open={asking}
        onOpenChange={(open, details) => {
          setAsking(open)
          if (!open && details?.returnValue === "unlock") onTargetChange?.("unsecured")
        }}
      >
        <AlertContent>
          <AlertTitle>Unlock {name}?</AlertTitle>
          <AlertDescription>
            {confirmDescription ?? "Anyone at the door will be able to open it."}
          </AlertDescription>
          <AlertActions>
            <AlertAction variant="cancel">Cancel</AlertAction>
            <AlertAction variant="primary" value="unlock">
              Unlock
            </AlertAction>
          </AlertActions>
        </AlertContent>
      </Alert>
    </div>
  )
}

export { LockControl }
export type { LockControlProps, LockState, LockTarget }
