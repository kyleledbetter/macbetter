"use client"

import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/react/collapsible"
import * as React from "react"
import { AlertGlyph, DisclosureChevron } from "../lib/agent-glyphs"
import { cx, join } from "../lib/cx"
import { ActivityIndicator } from "./activity-indicator"
import { Shimmer } from "./shimmer"

type ToolCallStatusValue = "pending" | "running" | "done" | "error" | "approval"

const ListContext = React.createContext(false)
const StatusContext = React.createContext<ToolCallStatusValue>("done")

/** The steps an agent took: a summary line that opens a group of steps. */
function ToolActivity({ className, ...props }: React.ComponentProps<typeof Collapsible>) {
  return <Collapsible className={cx("mb-tool-activity", className)} {...props} />
}

type ToolActivitySummaryProps = Omit<React.ComponentProps<typeof CollapsibleTrigger>, "children"> & {
  children?: React.ReactNode
  /** A small glyph before the text, like a wrench or a stack of pages. */
  icon?: React.ReactNode
  /** Shimmers the text while the agent is still working. */
  active?: boolean
}

/** "Used Dataroom, read a file · 29s", with a chevron that turns down when the steps show. */
function ToolActivitySummary({ icon, active, className, children, ...props }: ToolActivitySummaryProps) {
  return (
    <CollapsibleTrigger className={cx("mb-tool-activity-summary", className)} {...props}>
      {icon ? (
        <span aria-hidden="true" className="mb-tool-activity-icon">
          {icon}
        </span>
      ) : null}
      <Shimmer active={!!active} className="mb-tool-activity-label">
        {children}
      </Shimmer>
      <DisclosureChevron className="mb-tool-activity-chevron" />
    </CollapsibleTrigger>
  )
}

/** The group of steps, in a rounded box with a hairline between them. */
function ToolActivityContent({
  className,
  children,
  "aria-label": label = "Steps",
  ...props
}: Omit<React.ComponentProps<typeof CollapsiblePanel>, "children"> & { children?: React.ReactNode }) {
  return (
    <CollapsiblePanel className={cx("mb-tool-activity-panel", className)} {...props}>
      <ListContext.Provider value={true}>
        {/* Safari drops the list role from a list styled without markers unless it's restated. */}
        <ul role="list" aria-label={label} className="mb-tool-activity-list">
          {children}
        </ul>
      </ListContext.Provider>
    </CollapsiblePanel>
  )
}

type ToolCallProps = Omit<React.ComponentProps<typeof Collapsible>, "children"> & {
  /** Where the step stands. Every status but `done` is said in words to assistive tech. */
  status?: ToolCallStatusValue
  children?: React.ReactNode
}

const statusWords: Record<ToolCallStatusValue, string | null> = {
  pending: "Pending",
  running: "In progress",
  done: null,
  error: "Failed",
  approval: "Needs approval",
}

/**
 * One step. Put a ToolCallTitle in it, and a ToolCallDetail if the step has a request and
 * response to show: the row then becomes a button that opens it. Without detail it's plain text.
 */
function ToolCall({ status = "done", className, children, ...props }: ToolCallProps) {
  const {
    open: _open,
    defaultOpen: _defaultOpen,
    onOpenChange: _onOpenChange,
    onOpenChangeComplete: _onOpenChangeComplete,
    disabled: _disabled,
    controller: _controller,
    debug: _debug,
    render: _render,
    ...plain
  } = props
  const inList = React.useContext(ListContext)
  const all = React.Children.toArray(children)
  const detail = all.filter((child) => React.isValidElement(child) && child.type === ToolCallDetail)
  const row = all.filter((child) => !(React.isValidElement(child) && child.type === ToolCallDetail))

  const content = (
    <>
      {row}
      <ToolCallStatus />
    </>
  )

  const element =
    detail.length > 0 ? (
      <Collapsible
        data-status={status}
        aria-busy={status === "running" ? true : undefined}
        className={cx("mb-tool-call", className)}
        {...props}
      >
        <CollapsibleTrigger className="mb-tool-call-row">
          {content}
          <DisclosureChevron className="mb-tool-call-chevron" />
        </CollapsibleTrigger>
        <CollapsiblePanel className="mb-tool-call-panel">{detail}</CollapsiblePanel>
      </Collapsible>
    ) : (
      <div
        data-status={status}
        aria-busy={status === "running" ? true : undefined}
        className={join("mb-tool-call", typeof className === "string" ? className : undefined)}
        {...(plain as React.HTMLAttributes<HTMLDivElement>)}
      >
        <div className="mb-tool-call-row">{content}</div>
      </div>
    )

  return (
    <StatusContext.Provider value={status}>
      {inList ? <li className="mb-tool-activity-item">{element}</li> : element}
    </StatusContext.Provider>
  )
}

/** A small glyph at the start of a step, for the tool it used. */
function ToolCallIcon({ className, ...props }: React.ComponentProps<"span">) {
  return <span aria-hidden="true" className={join("mb-tool-call-icon", className)} {...props} />
}

type ToolCallTitleProps = React.ComponentProps<"span"> & {
  /** What the agent did, in secondary text before the object: "Read", "Loaded skill". */
  verb?: React.ReactNode
}

/** The verb and its object on one line, like "Read  data-workflows.md". Without a verb it's a note. */
function ToolCallTitle({ verb, className, children, ...props }: ToolCallTitleProps) {
  const status = React.useContext(StatusContext)
  return (
    <Shimmer
      active={status === "running"}
      data-note={verb == null ? "" : undefined}
      className={join("mb-tool-call-title", className)}
      {...props}
    >
      {verb != null ? <span className="mb-tool-call-verb">{verb}</span> : null}
      {verb != null ? " " : null}
      <span className="mb-tool-call-object">{children}</span>
    </Shimmer>
  )
}

/** The status at the end of the row. ToolCall draws it for you. */
function ToolCallStatus() {
  const status = React.useContext(StatusContext)
  const words = statusWords[status]
  if (status === "running") {
    return (
      <span className="mb-tool-call-status">
        <span aria-hidden="true">
          <ActivityIndicator size="sm" className="mb-tool-call-spinner" />
        </span>
        <span className="mb-visually-hidden">{words}</span>
      </span>
    )
  }
  if (status === "error") {
    return (
      <span className="mb-tool-call-status" data-status="error">
        <AlertGlyph className="mb-tool-call-alert" />
        <span>{words}</span>
      </span>
    )
  }
  if (status === "approval") {
    return (
      <span className="mb-tool-call-status" data-status="approval">
        {words}
      </span>
    )
  }
  return words ? <span className="mb-visually-hidden">{words}</span> : null
}

/** What opens under a step: one or more ToolCallSections, like Request and Response. */
function ToolCallDetail({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={join("mb-tool-call-detail", className)} {...props} />
}

type ToolCallSectionProps = Omit<React.ComponentProps<"section">, "title"> & {
  /** The section's heading, like "Request". */
  title: React.ReactNode
}

/** A titled panel on a raised fill. Put a DescriptionList or a CodeBlock in it. */
function ToolCallSection({ title, className, children, ...props }: ToolCallSectionProps) {
  const id = React.useId()
  return (
    <section aria-labelledby={id} className={join("mb-tool-call-section", className)} {...props}>
      <div id={id} className="mb-tool-call-section-title">
        {title}
      </div>
      <div className="mb-tool-call-section-body">{children}</div>
    </section>
  )
}

export {
  ToolActivity,
  ToolActivityContent,
  ToolActivitySummary,
  ToolCall,
  ToolCallDetail,
  ToolCallIcon,
  ToolCallSection,
  ToolCallStatus,
  ToolCallTitle,
}
export type { ToolActivitySummaryProps, ToolCallProps, ToolCallSectionProps, ToolCallStatusValue, ToolCallTitleProps }
