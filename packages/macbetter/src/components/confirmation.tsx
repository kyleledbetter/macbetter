"use client"

import * as React from "react"
import { CheckGlyph, CrossGlyph } from "../lib/agent-glyphs"
import { join } from "../lib/cx"

type ConfirmationState = "pending" | "allowed" | "denied"

const TitleIdContext = React.createContext<string | undefined>(undefined)

type ConfirmationProps = React.ComponentProps<"div"> & {
  /** `pending` asks; `allowed` and `denied` collapse it to one quiet line. */
  state?: ConfirmationState
  /** The line shown once answered. Defaults to "Allowed" or "Denied"; say "Allowed once" or "Always allowed" when it matters. */
  outcome?: React.ReactNode
}

/**
 * An inline card that asks before a tool runs. It sits in the thread, not over it: nothing
 * else on the page is blocked while it waits. It's a group named by its ConfirmationTitle.
 */
function Confirmation({ state = "pending", outcome, className, children, ...props }: ConfirmationProps) {
  const titleId = React.useId()
  const outcomeId = React.useId()
  const root = React.useRef<HTMLDivElement>(null)
  const previous = React.useRef(state)

  // Answering removes the buttons; keep focus in the card rather than losing it to the page.
  React.useEffect(() => {
    const was = previous.current
    previous.current = state
    if (was !== "pending" || state === "pending") return
    const element = root.current
    if (element && (element.contains(document.activeElement) || document.activeElement === document.body)) {
      element.focus({ preventScroll: true })
    }
  }, [state])

  const resolved = state !== "pending"
  return (
    <div
      ref={root}
      role="group"
      aria-labelledby={resolved ? outcomeId : titleId}
      tabIndex={resolved ? -1 : undefined}
      data-state={state}
      className={join("mb-confirmation", className)}
      {...props}
    >
      {resolved ? (
        <p id={outcomeId} className="mb-confirmation-outcome">
          {state === "allowed" ? (
            <CheckGlyph className="mb-confirmation-outcome-glyph" />
          ) : (
            <CrossGlyph className="mb-confirmation-outcome-glyph" />
          )}
          <span>{outcome ?? (state === "allowed" ? "Allowed" : "Denied")}</span>
        </p>
      ) : (
        <TitleIdContext.Provider value={titleId}>{children}</TitleIdContext.Provider>
      )}
    </div>
  )
}

/** The tool's icon, in a tile at the start of the card. */
function ConfirmationIcon({ className, ...props }: React.ComponentProps<"span">) {
  return <span aria-hidden="true" className={join("mb-confirmation-icon", className)} {...props} />
}

/** The question, like "Allow Calendar to create an event?". It names the card. */
function ConfirmationTitle({ className, id, ...props }: React.ComponentProps<"p">) {
  const titleId = React.useContext(TitleIdContext)
  return <p id={id ?? titleId} className={join("mb-confirmation-title", className)} {...props} />
}

function ConfirmationDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={join("mb-confirmation-description", className)} {...props} />
}

/** The request's details, such as a DescriptionList of what the tool will send. */
function ConfirmationDetails({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={join("mb-confirmation-details", className)} {...props} />
}

/** The buttons: in a trailing row on macOS, stacked full width on iOS with the last one on top. */
function ConfirmationActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={join("mb-confirmation-actions", className)} {...props} />
}

export {
  Confirmation,
  ConfirmationActions,
  ConfirmationDescription,
  ConfirmationDetails,
  ConfirmationIcon,
  ConfirmationTitle,
}
export type { ConfirmationProps, ConfirmationState }
