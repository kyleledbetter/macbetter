"use client"

import * as React from "react"
import { cx, join } from "../lib/cx"
import { Button, type ButtonProps } from "./button"

const InspectorContext = React.createContext<string | undefined>(undefined)

type InspectorProps = React.ComponentProps<"aside"> & {
  /**
   * `edge` is a column at the window's trailing edge with a hairline before it. `floating` is a
   * rounded pane of material that floats over the content.
   */
  variant?: "edge" | "floating"
}

/**
 * A trailing panel with details about the selected content, like SwiftUI's inspector. Put it in a
 * Window after WindowBody. It's a complementary landmark named by its InspectorTitle.
 */
function Inspector({ variant = "edge", className, "aria-label": label, ...props }: InspectorProps) {
  const titleId = React.useId()
  return (
    <InspectorContext.Provider value={titleId}>
      <aside
        aria-label={label}
        aria-labelledby={label ? undefined : titleId}
        data-variant={variant}
        className={join("mb-inspector", className)}
        {...props}
      />
    </InspectorContext.Provider>
  )
}

/** The bar across the top: an InspectorTitle and, optionally, an InspectorClose. */
function InspectorHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={join("mb-inspector-header", className)} {...props} />
}

function InspectorTitle({ className, id, ...props }: React.ComponentProps<"h2">) {
  const titleId = React.useContext(InspectorContext)
  return <h2 id={id ?? titleId} className={join("mb-inspector-title", className)} {...props} />
}

function CloseGlyph() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path d="m4.5 4.5 7 7m0-7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

/** Hides the inspector. Named "Close Inspector" unless you name it. You handle `onClick`. */
function InspectorClose({ className, children, "aria-label": label, ...props }: ButtonProps) {
  return (
    <Button
      variant="plain"
      tone="neutral"
      size="sm"
      shape="circle"
      aria-label={children ? label : (label ?? "Close Inspector")}
      className={cx("mb-inspector-close", className)}
      {...props}
    >
      {children ?? <CloseGlyph />}
    </Button>
  )
}

/** The scrolling area below the header, holding InspectorSections. */
function InspectorBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={join("mb-inspector-body", className)} {...props} />
}

function InspectorSection({ className, ...props }: React.ComponentProps<"section">) {
  return <section className={join("mb-inspector-section", className)} {...props} />
}

type InspectorSectionTitleProps = React.ComponentProps<"h3"> & {
  /** A control at the trailing end of the title row, like an add button. */
  action?: React.ReactNode
}

function InspectorSectionTitle({ action, className, ...props }: InspectorSectionTitleProps) {
  return (
    <div className="mb-inspector-section-header">
      <h3 className={join("mb-inspector-section-title", className)} {...props} />
      {action ? <div className="mb-inspector-section-action">{action}</div> : null}
    </div>
  )
}

export {
  Inspector,
  InspectorBody,
  InspectorClose,
  InspectorHeader,
  InspectorSection,
  InspectorSectionTitle,
  InspectorTitle,
}
export type { InspectorProps, InspectorSectionTitleProps }
