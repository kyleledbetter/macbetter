"use client"

import { MenuTrigger as MenuTriggerPrimitive } from "@ui-sdk/react/menu"
import { Toggle as TogglePrimitive } from "@ui-sdk/react/toggle"
import { Toolbar as ToolbarPrimitive, ToolbarButton as ToolbarButtonPrimitive } from "@ui-sdk/react/toolbar"
import * as React from "react"
import { cx, join } from "../lib/cx"
import { Menu, MenuContent, type MenuProps } from "./menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

type MessageFrom = "user" | "assistant"

type MessageProps = React.ComponentProps<"article"> & {
  /** Who wrote the turn. The person's turn is a trailing bubble; the assistant's is plain text. */
  from?: MessageFrom
  /**
   * Keeps the actions in view. The last message in a thread shows them anyway;
   * older ones show them on hover or focus on pointer devices.
   */
  latest?: boolean
}

/** One turn in a conversation. */
function Message({ from = "assistant", latest, className, ...props }: MessageProps) {
  return (
    <article
      data-from={from}
      data-latest={latest ? "" : undefined}
      className={join("mb-message", className)}
      {...props}
    />
  )
}

/** The body of a turn: a bubble for the person, a `Response` for the assistant. */
function MessageContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={join("mb-message-content", className)} {...props} />
}

type MessageBubbleProps = React.ComponentProps<"div"> & {
  /** `accent` fills with the theme's accent; `neutral` is a quiet gray fill. */
  variant?: "accent" | "neutral"
}

function MessageBubble({ variant = "accent", className, ...props }: MessageBubbleProps) {
  return <div data-variant={variant} className={join("mb-message-bubble", className)} {...props} />
}

/** Files and images sent with the turn, above its bubble. */
function MessageAttachments({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={join("mb-message-attachments", className)} {...props} />
}

/** Small secondary text under a turn: the time, the model, "Edited". */
function MessageMeta({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={join("mb-message-meta", className)} {...props} />
}

/** The row of actions under a turn: one tab stop, arrow keys between them. */
function MessageActions({
  "aria-label": ariaLabel = "Message actions",
  className,
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive>) {
  return <ToolbarPrimitive aria-label={ariaLabel} className={cx("mb-message-actions", className)} {...props} />
}

type MessageActionProps = Omit<React.ComponentProps<typeof ToolbarButtonPrimitive>, "children"> & {
  /** Names the button for assistive tech and shows as its tooltip. */
  label: string
  children?: React.ReactNode
}

/** An icon button in `MessageActions`, named by `label` and showing it as a tooltip. */
function MessageAction({ label, className, children, ...props }: MessageActionProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <ToolbarButtonPrimitive aria-label={label} className={cx("mb-message-action", className)} {...props} />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

type MessageActionToggleProps = Omit<React.ComponentProps<typeof TogglePrimitive>, "children"> & {
  label: string
  children?: React.ReactNode
}

/** An action that stays pressed, like Good response or Bad response. */
function MessageActionToggle({ label, className, children, ...props }: MessageActionToggleProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={<TogglePrimitive aria-label={label} className={cx("mb-message-action", className)} {...props} />}
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

type MessageActionMenuProps = Omit<MenuProps, "children"> & {
  /** Names the button and shows as its tooltip. */
  label?: string
  /** The button's glyph. An ellipsis by default. */
  icon?: React.ReactNode
  className?: string
  /** The menu's items. */
  children?: React.ReactNode
}

/** An action that opens a menu of more actions, like Branch, Share and Report. */
function MessageActionMenu({ label = "More", icon, className, children, ...props }: MessageActionMenuProps) {
  return (
    <Menu {...props}>
      <MessageAction label={label} className={className} render={<MenuTriggerPrimitive />}>
        {icon ?? <MoreGlyph />}
      </MessageAction>
      <MenuContent>{children}</MenuContent>
    </Menu>
  )
}

type MessageActionCopyProps = Omit<MessageActionProps, "label" | "children"> & {
  /** What's copied: the reply's plain text, or a function that returns it when pressed. */
  text: string | (() => string)
  label?: string
  /** The label while the check shows, after a copy. */
  copiedLabel?: string
  onCopy?: (text: string) => void
}

/** Copies the reply and shows a check for two seconds. */
function MessageActionCopy({
  text,
  label = "Copy",
  copiedLabel = "Copied",
  onCopy,
  onClick,
  ...props
}: MessageActionCopyProps) {
  const [copied, setCopied] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  React.useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <MessageAction
      label={copied ? copiedLabel : label}
      data-copied={copied ? "" : undefined}
      onClick={(event, ...rest) => {
        onClick?.(event, ...rest)
        const value = typeof text === "function" ? text() : text
        navigator.clipboard?.writeText(value).catch(() => {})
        onCopy?.(value)
        setCopied(true)
        clearTimeout(timer.current)
        timer.current = setTimeout(() => setCopied(false), 2000)
      }}
      {...props}
    >
      {copied ? <CheckGlyph /> : <CopyGlyph />}
    </MessageAction>
  )
}

function CopyGlyph() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <rect x="5.25" y="5.25" width="8.5" height="8.5" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M10.5 3.5v-.25a1 1 0 0 0-1-1h-6a1.25 1.25 0 0 0-1.25 1.25v6a1 1 0 0 0 1 1h.25"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MoreGlyph() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <circle cx="3.5" cy="8" r="1.25" fill="currentColor" />
      <circle cx="8" cy="8" r="1.25" fill="currentColor" />
      <circle cx="12.5" cy="8" r="1.25" fill="currentColor" />
    </svg>
  )
}

function CheckGlyph() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path
        d="m3.25 8.4 3.1 3.1 6.4-7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export {
  Message,
  MessageAction,
  MessageActionCopy,
  MessageActionMenu,
  MessageActions,
  MessageActionToggle,
  MessageAttachments,
  MessageBubble,
  MessageContent,
  MessageMeta,
}
export type {
  MessageActionCopyProps,
  MessageActionMenuProps,
  MessageActionProps,
  MessageActionToggleProps,
  MessageBubbleProps,
  MessageFrom,
  MessageProps,
}
