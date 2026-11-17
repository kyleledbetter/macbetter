"use client"

import {
  Timeline,
  TimelineConnector,
  TimelineDescription,
  TimelineItem,
  TimelineMarker,
  TimelineTitle,
  type TimelineStatus,
} from "@ui-sdk/react/timeline"
import * as React from "react"
import { CheckGlyph, DashGlyph } from "../lib/agent-glyphs"
import { cx, join } from "../lib/cx"

type PlanStepStatus = "pending" | "active" | "done" | "skipped"

type PlanProps = Omit<React.ComponentProps<typeof Timeline>, "children"> & {
  children?: React.ReactNode
  /** Shows "3 of 5" beside the title, counting done and skipped steps. */
  progress?: boolean
}

function isStep(child: React.ReactNode): child is React.ReactElement<PlanStepProps> {
  return React.isValidElement(child) && child.type === PlanStep
}

/**
 * A task list for multi-step work. Put an optional PlanTitle first, then a PlanStep for each
 * step. The steps are a list with one tab stop; the arrow keys move between them.
 */
function Plan({ progress = true, className, children, "aria-label": label, ...props }: PlanProps) {
  const titleId = React.useId()
  const all = React.Children.toArray(children)
  const title = all.find((child) => React.isValidElement(child) && child.type === PlanTitle)
  const steps = all.filter(isStep)
  const rest = all.filter((child) => child !== title && !isStep(child))
  const finished = steps.filter((step) => step.props.status === "done" || step.props.status === "skipped").length

  return (
    <div className={join("mb-plan", typeof className === "string" ? className : undefined)}>
      {title ? (
        <div className="mb-plan-header">
          <div id={titleId} className="mb-plan-heading">
            {title}
          </div>
          {progress && steps.length > 0 ? (
            <span className="mb-plan-progress">
              {finished} of {steps.length}
            </span>
          ) : null}
        </div>
      ) : null}
      <Timeline
        aria-label={label}
        aria-labelledby={title && !label ? titleId : undefined}
        className={cx("mb-plan-steps", typeof className === "function" ? className : undefined)}
        {...props}
      >
        {steps}
      </Timeline>
      {rest}
    </div>
  )
}

/** The plan's name, like "Move the billing tables". It names the list of steps. */
function PlanTitle({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={join("mb-plan-title", className)} {...props} />
}

type PlanStepProps = Omit<React.ComponentProps<typeof TimelineItem>, "status" | "children"> & {
  status?: PlanStepStatus
  /** One line under the title, like what the step found or why it was skipped. */
  detail?: React.ReactNode
  children?: React.ReactNode
}

const timelineStatus: Record<PlanStepStatus, TimelineStatus> = {
  pending: "upcoming",
  active: "current",
  done: "complete",
  skipped: "complete",
}

const statusWords: Record<PlanStepStatus, string> = {
  pending: "Not started",
  active: "In progress",
  done: "Done",
  skipped: "Skipped",
}

/** One step: an empty circle, a turning accent ring, a filled check or a dash, then its title. */
function PlanStep({ status = "pending", detail, className, children, ...props }: PlanStepProps) {
  return (
    <TimelineItem
      status={timelineStatus[status]}
      data-status={status}
      className={cx("mb-plan-step", className)}
      {...props}
    >
      <TimelineMarker className="mb-plan-marker" data-status={status}>
        {status === "done" ? <CheckGlyph className="mb-plan-glyph" /> : null}
        {status === "skipped" ? <DashGlyph className="mb-plan-glyph" /> : null}
        {status === "active" ? <span className="mb-plan-ring" data-motion="essential" /> : null}
      </TimelineMarker>
      <TimelineConnector className="mb-plan-connector" />
      <TimelineTitle className="mb-plan-step-title">
        {children}
        <span className="mb-visually-hidden">, {statusWords[status]}</span>
      </TimelineTitle>
      {detail != null ? <TimelineDescription className="mb-plan-step-detail">{detail}</TimelineDescription> : null}
    </TimelineItem>
  )
}

export { Plan, PlanStep, PlanTitle }
export type { PlanProps, PlanStepProps, PlanStepStatus }
