"use client"

import { Button as ButtonPrimitive } from "@ui-sdk/react/button"
import { type RenderProp, renderElement } from "@ui-sdk/react/primitive"
import * as React from "react"
import { cx, join } from "../lib/cx"
import type { SystemColor } from "../lib/theme"
import { ProgressCircle } from "./progress"

type AttachmentVariant = "chip" | "tile" | "thumbnail" | "row"
type AttachmentState = "uploading" | "ready" | "error"

type AttachmentContextValue = {
  state: AttachmentState
  progress: number | null
  nameId: string
}

const AttachmentContext = React.createContext<AttachmentContextValue | null>(null)
const ListContext = React.createContext(false)

function useAttachment() {
  return React.useContext(AttachmentContext) ?? { state: "ready" as const, progress: null, nameId: "" }
}

type AttachmentsProps = React.ComponentProps<"ul"> & {
  /** `wrap` flows onto more lines, `scroll` keeps one line that scrolls sideways, `column` stacks rows. */
  layout?: "wrap" | "scroll" | "column"
}

/** A list of attachments. Each Attachment inside becomes a list item. */
function Attachments({ layout = "wrap", className, ...props }: AttachmentsProps) {
  // Safari drops the list role from a list styled without markers unless it's restated.
  return (
    <ListContext.Provider value={true}>
      <ul role="list" data-layout={layout} className={join("mb-attachments", className)} {...props} />
    </ListContext.Provider>
  )
}

type AttachmentProps = React.ComponentProps<"div"> & {
  /** `chip` for a composer, `tile` for a grid, `thumbnail` for an image alone, `row` for a list in an inspector. */
  variant?: AttachmentVariant
  state?: AttachmentState
  /** Upload progress from 0 to 100 while `state` is `uploading`. Leave it out when the size isn't known. */
  progress?: number
  /** Renders the attachment as a link or button, such as `<a href="…" />`. Use it only without AttachmentRemove. */
  render?: RenderProp
}

function Attachment({
  variant = "chip",
  state = "ready",
  progress,
  className,
  render,
  ...props
}: AttachmentProps) {
  const inList = React.useContext(ListContext)
  const nameId = React.useId()
  const context = React.useMemo(
    () => ({ state, progress: progress ?? null, nameId }),
    [state, progress, nameId]
  )
  const element = renderElement(
    "div",
    {
      ...props,
      "aria-busy": state === "uploading" ? true : undefined,
      "data-variant": variant,
      "data-state": state,
      "data-interactive": render ? "" : undefined,
      className: join("mb-attachment", className),
    },
    render
  )
  return (
    <AttachmentContext.Provider value={context}>
      {inList ? <li className="mb-attachments-item">{element}</li> : element}
    </AttachmentContext.Provider>
  )
}

type AttachmentPreviewProps = React.ComponentProps<"span"> & {
  /** An image to show. Without it, and without children, a document glyph is drawn. */
  src?: string
  /** The image's description. Empty by default, since AttachmentName names the file. */
  alt?: string
  /** A short type label printed on the document glyph, like `PDF` or `CSV`, where there's room. */
  extension?: string
  /** The glyph's label color. */
  color?: SystemColor | "gray" | "accent"
}

function DocumentGlyph() {
  return (
    <svg viewBox="0 0 32 40" aria-hidden="true" focusable="false" className="mb-attachment-glyph">
      <path
        className="mb-attachment-glyph-page"
        d="M6 1.75h14.2a2 2 0 0 1 1.42.59l6.04 6.04a2 2 0 0 1 .59 1.42V36.25a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V3.75a2 2 0 0 1 2-2Z"
      />
      <path className="mb-attachment-glyph-fold" d="M21 1.9v5.6a1.75 1.75 0 0 0 1.75 1.75h5.6" />
      <path className="mb-attachment-glyph-lines" d="M9 15.5h14M9 20h14M9 24.5h14M9 29h9" />
    </svg>
  )
}

function ErrorGlyph() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" className="mb-attachment-error">
      <circle cx="8" cy="8" r="7.25" />
      <path d="M8 4.5v4.25" />
      <circle cx="8" cy="11.4" r="0.6" />
    </svg>
  )
}

/** The image or file glyph. While uploading it shows the progress ring; after a failure, an alert badge. */
function AttachmentPreview({ src, alt = "", extension, color, className, style, children, ...props }: AttachmentPreviewProps) {
  const { state, progress } = useAttachment()
  const tint = color ? (color === "gray" ? "var(--mb-label-secondary)" : `var(--mb-${color})`) : undefined
  return (
    <span
      data-image={src ? "" : undefined}
      className={join("mb-attachment-preview", className)}
      style={tint ? ({ "--mb-attachment-tint": tint, ...style } as React.CSSProperties) : style}
      {...props}
    >
      {children ??
        (src ? (
          <img src={src} alt={alt} className="mb-attachment-image" />
        ) : (
          <span className="mb-attachment-document">
            <DocumentGlyph />
            {extension ? <span aria-hidden="true" className="mb-attachment-extension">{extension}</span> : null}
          </span>
        ))}
      {state === "uploading" ? (
        <span className="mb-attachment-progress">
          <ProgressCircle
            size="sm"
            value={progress}
            aria-label="Uploading"
            className="mb-attachment-progress-ring"
          />
        </span>
      ) : null}
      {state === "error" ? <ErrorGlyph /> : null}
    </span>
  )
}

type AttachmentNameProps = React.ComponentProps<"span"> & {
  /**
   * Makes the name a link or button, such as `<a href="…" />`, whose hit area covers the whole
   * attachment. Use this instead of Attachment's `render` when there's also a remove button.
   */
  render?: RenderProp
}

function AttachmentName({ className, render, id, ...props }: AttachmentNameProps) {
  const { nameId } = useAttachment()
  return renderElement(
    "span",
    {
      ...props,
      id: id ?? (nameId || undefined),
      "data-interactive": render ? "" : undefined,
      className: join("mb-attachment-name", className),
    },
    render
  )
}

/** The kind and size, like `PDF · 2.4 MB`, or what went wrong. */
function AttachmentMeta({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={join("mb-attachment-meta", className)} {...props} />
}

/** Removes the attachment. It's named "Remove" plus the attachment's name. */
function AttachmentRemove({
  className,
  children,
  id,
  "aria-label": label = "Remove",
  ...props
}: React.ComponentProps<typeof ButtonPrimitive>) {
  const { nameId } = useAttachment()
  const ownId = React.useId()
  const buttonId = id ?? ownId
  return (
    <ButtonPrimitive
      id={buttonId}
      aria-label={label}
      aria-labelledby={nameId ? `${buttonId} ${nameId}` : undefined}
      className={cx("mb-attachment-remove", className)}
      {...props}
    >
      {children ?? (
        <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="m4.75 4.75 6.5 6.5m0-6.5-6.5 6.5" />
        </svg>
      )}
    </ButtonPrimitive>
  )
}

export { Attachment, AttachmentMeta, AttachmentName, AttachmentPreview, AttachmentRemove, Attachments }
export type {
  AttachmentNameProps,
  AttachmentPreviewProps,
  AttachmentProps,
  AttachmentsProps,
  AttachmentState,
  AttachmentVariant,
}
