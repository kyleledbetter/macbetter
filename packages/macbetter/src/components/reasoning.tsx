"use client"

import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/react/collapsible"
import * as React from "react"
import { DisclosureChevron } from "../lib/agent-glyphs"
import { cx } from "../lib/cx"
import { Shimmer } from "./shimmer"

type ReasoningState = "running" | "done"

type ReasoningContextValue = { state: ReasoningState; duration: number | undefined }

const ReasoningContext = React.createContext<ReasoningContextValue>({ state: "done", duration: undefined })

/** Seconds as people say them: `12s`, `2m 1s`, `1h 4m`. */
function formatDuration(seconds: number): string {
  const total = Math.max(0, Math.round(seconds))
  if (total < 60) return `${total}s`
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const rest = total % 60
  if (hours > 0) return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
  return rest > 0 ? `${minutes}m ${rest}s` : `${minutes}m`
}

type ReasoningProps = React.ComponentProps<typeof Collapsible> & {
  /** `running` shimmers "Thinking…"; `done` says how long it took. */
  state?: ReasoningState
  /** How long the model worked, in seconds. */
  duration?: number
  /** Opens while running and closes when `state` turns `done`. Only when uncontrolled. */
  autoCollapse?: boolean
  /** A soft moving glow behind the line while running. It holds still under Reduce Motion. */
  glow?: boolean
}

function Reasoning({
  state = "done",
  duration,
  autoCollapse,
  glow,
  open,
  defaultOpen,
  onOpenChange,
  className,
  ...props
}: ReasoningProps) {
  const [ownOpen, setOwnOpen] = React.useState(defaultOpen ?? (autoCollapse ? state === "running" : false))
  const previous = React.useRef(state)

  React.useEffect(() => {
    if (!autoCollapse || previous.current === state) return
    previous.current = state
    setOwnOpen(state === "running")
  }, [autoCollapse, state])

  const context = React.useMemo(() => ({ state, duration }), [state, duration])

  return (
    <ReasoningContext.Provider value={context}>
      <Collapsible
        data-state={state}
        data-glow={glow ? "" : undefined}
        aria-busy={state === "running" ? true : undefined}
        open={open ?? ownOpen}
        onOpenChange={(next, details) => {
          onOpenChange?.(next, details)
          if (open === undefined && !details.canceled) setOwnOpen(next)
        }}
        className={cx("mb-reasoning", className)}
        {...props}
      />
    </ReasoningContext.Provider>
  )
}

type ReasoningTriggerProps = Omit<React.ComponentProps<typeof CollapsibleTrigger>, "children"> & {
  /** Replaces the label. It still shimmers while running. */
  children?: React.ReactNode
}

/** The line itself: "Thinking…" while running, then "Thought for 12s", with a chevron that turns down when open. */
function ReasoningTrigger({ className, children, ...props }: ReasoningTriggerProps) {
  const { state, duration } = React.useContext(ReasoningContext)
  const label =
    children ??
    (state === "running"
      ? "Thinking…"
      : duration !== undefined
        ? `Thought for ${formatDuration(duration)}`
        : "Thought for a few seconds")
  return (
    <CollapsibleTrigger className={cx("mb-reasoning-trigger", className)} {...props}>
      <Shimmer active={state === "running"} className="mb-reasoning-label">
        {label}
      </Shimmer>
      <DisclosureChevron className="mb-reasoning-chevron" />
    </CollapsibleTrigger>
  )
}

/** The reasoning text or steps, behind a leading hairline. */
function ReasoningContent({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof CollapsiblePanel>, "children"> & { children?: React.ReactNode }) {
  return (
    <CollapsiblePanel className={cx("mb-reasoning-panel", className)} {...props}>
      <div className="mb-reasoning-content">{children}</div>
    </CollapsiblePanel>
  )
}

export { formatDuration, Reasoning, ReasoningContent, ReasoningTrigger }
export type { ReasoningProps, ReasoningState, ReasoningTriggerProps }
