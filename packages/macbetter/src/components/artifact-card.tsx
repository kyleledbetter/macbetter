"use client"

import { type RenderProp, renderElement } from "@ui-sdk/react/primitive"
import * as React from "react"
import { cx, join } from "../lib/cx"
import type { SystemColor } from "../lib/theme"
import { Button, type ButtonProps } from "./button"
import { ProgressCircle } from "./progress"
import { Shimmer } from "./shimmer"

type ArtifactCardState = "generating" | "ready"

type ArtifactCardContextValue = { state: ArtifactCardState; progress: number | null; titleId: string }

const ArtifactCardContext = React.createContext<ArtifactCardContextValue>({
  state: "ready",
  progress: null,
  titleId: "",
})

type ArtifactCardProps = React.ComponentProps<"div"> & {
  /** `generating` shimmers the meta line and puts a progress ring on the icon. */
  state?: ArtifactCardState
  /** Progress from 0 to 100 while generating. Leave it out when it isn't known and the ring spins. */
  progress?: number
  /** Makes the whole card one link or button. Use it only without ArtifactCardActions; otherwise pass `render` to ArtifactCardTitle. */
  render?: RenderProp
}

/** A row-shaped card for a file or document the assistant made, which opens it. */
function ArtifactCard({ state = "ready", progress, render, className, ...props }: ArtifactCardProps) {
  const titleId = React.useId()
  const context = React.useMemo(() => ({ state, progress: progress ?? null, titleId }), [state, progress, titleId])
  return (
    <ArtifactCardContext.Provider value={context}>
      {renderElement(
        "div",
        {
          ...props,
          "aria-busy": state === "generating" ? true : undefined,
          "data-state": state,
          "data-interactive": render ? "" : undefined,
          className: join("mb-artifact-card", className),
        },
        render
      )}
    </ArtifactCardContext.Provider>
  )
}

type ArtifactCardIconProps = React.ComponentProps<"span"> & {
  /** The tile's color. */
  color?: SystemColor | "gray" | "accent"
}

/** The leading tile with the file's icon. While generating, a ring turns over it. */
function ArtifactCardIcon({ color, className, style, children, ...props }: ArtifactCardIconProps) {
  const { state, progress } = React.useContext(ArtifactCardContext)
  const tint = color ? (color === "gray" ? "var(--mb-label-secondary)" : `var(--mb-${color})`) : undefined
  return (
    <span
      aria-hidden={state === "generating" ? undefined : true}
      className={join("mb-artifact-card-icon", className)}
      style={tint ? ({ "--mb-artifact-card-tint": tint, ...style } as React.CSSProperties) : style}
      {...props}
    >
      <span aria-hidden="true" className="mb-artifact-card-glyph">
        {children}
      </span>
      {state === "generating" ? (
        <span className="mb-artifact-card-progress">
          <ProgressCircle size="sm" value={progress} aria-label="Generating" className="mb-artifact-card-ring" />
        </span>
      ) : null}
    </span>
  )
}

type ArtifactCardTitleProps = React.ComponentProps<"span"> & {
  /**
   * Makes the title the card's link or button, such as `<a href="…" />`, with a hit area that
   * covers the whole card. Use this when the card also has actions.
   */
  render?: RenderProp
}

function ArtifactCardTitle({ render, id, className, ...props }: ArtifactCardTitleProps) {
  const { titleId } = React.useContext(ArtifactCardContext)
  return renderElement(
    "span",
    {
      ...props,
      id: id ?? (titleId || undefined),
      "data-interactive": render ? "" : undefined,
      className: join("mb-artifact-card-title", className),
    },
    render
  )
}

/** The kind and who can see it, like "Slides · Only you". It shimmers while generating. */
function ArtifactCardMeta({ className, children, ...props }: React.ComponentProps<"span">) {
  const { state } = React.useContext(ArtifactCardContext)
  return (
    <Shimmer active={state === "generating"} className={join("mb-artifact-card-meta", className)} {...props}>
      {children}
    </Shimmer>
  )
}

/** Trailing buttons, beside the card's main control rather than inside it. */
function ArtifactCardActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={join("mb-artifact-card-actions", className)} {...props} />
}

type ArtifactCardActionProps = Omit<ButtonProps, "aria-label"> & {
  /** The action's name, like "Download". The card's title is read after it. */
  label: string
}

/** An icon button for ArtifactCardActions, named by its label and the card's title: "Download Quarterly review". */
function ArtifactCardAction({ label, id, className, ...props }: ArtifactCardActionProps) {
  const { titleId } = React.useContext(ArtifactCardContext)
  const ownId = React.useId()
  const buttonId = id ?? ownId
  return (
    <Button
      id={buttonId}
      variant="plain"
      tone="neutral"
      size="sm"
      shape="circle"
      aria-label={label}
      aria-labelledby={titleId ? `${buttonId} ${titleId}` : undefined}
      className={cx("mb-artifact-card-action", className)}
      {...props}
    />
  )
}

export {
  ArtifactCard,
  ArtifactCardAction,
  ArtifactCardActions,
  ArtifactCardIcon,
  ArtifactCardMeta,
  ArtifactCardTitle,
}
export type { ArtifactCardActionProps, ArtifactCardIconProps, ArtifactCardProps, ArtifactCardState, ArtifactCardTitleProps }
