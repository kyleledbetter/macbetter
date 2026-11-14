import {
  Avatar as AvatarPrimitive,
  AvatarFallback as AvatarFallbackPrimitive,
  AvatarImage as AvatarImagePrimitive,
} from "@ui-sdk/react/avatar"
import * as React from "react"
import { cx, join } from "../lib/cx"
import type { SystemColor } from "../lib/theme"

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl"
type AvatarStatus = "online" | "away" | "busy" | "offline"

const statusLabels: Record<AvatarStatus, string> = {
  online: "Online",
  away: "Away",
  busy: "Do not disturb",
  offline: "Offline",
}

type AvatarProps = Omit<React.ComponentProps<typeof AvatarPrimitive>, "color" | "children"> & {
  /** Your own AvatarImage and AvatarFallback, in place of the ones made from `src` and `name`. */
  children?: React.ReactNode
  /** The person or thing pictured. Gives the image its alt text and the fallback its initials. */
  name?: string
  src?: string
  /** Inside an AvatarGroup, leave it out to take the group's size. Otherwise `md`. */
  size?: AvatarSize
  /** `app` is the rounded square of an app icon, for apps, teams and workspaces. */
  shape?: "circle" | "app"
  /** The fallback's gradient. `gray` is the Contacts monogram; `auto` picks a color from the name. */
  color?: SystemColor | "gray" | "auto"
  status?: AvatarStatus
  /** Read after the name, in place of the default word for `status`. */
  statusLabel?: string
}

const autoColors: SystemColor[] = ["orange", "green", "teal", "blue", "indigo", "purple", "pink", "brown"]

function initialsOf(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  const letters = words.length > 1 ? [words[0], words[words.length - 1]] : words
  return letters.map((word) => Array.from(word)[0]?.toLocaleUpperCase() ?? "").join("")
}

function colorOf(name: string) {
  let hash = 0x811c9dc5
  for (const char of name) hash = Math.imul(hash ^ (char.codePointAt(0) ?? 0), 0x01000193)
  return autoColors[(hash >>> 0) % autoColors.length]
}

function Avatar({
  name,
  src,
  size,
  shape = "circle",
  color = "gray",
  status,
  statusLabel,
  className,
  children,
  ...props
}: AvatarProps) {
  const resolvedColor = color === "auto" ? (name ? colorOf(name) : "gray") : color
  const content = children ?? (
    <>
      {src ? <AvatarImage src={src} alt={name ?? ""} /> : null}
      <AvatarFallback>
        {name ? (
          <>
            <span aria-hidden="true">{initialsOf(name)}</span>
            <span className="sd-visually-hidden">{name}</span>
          </>
        ) : (
          <AvatarPlaceholder />
        )}
      </AvatarFallback>
    </>
  )

  return (
    <AvatarPrimitive
      data-size={size}
      data-shape={shape}
      data-color={resolvedColor}
      className={cx("sd-avatar", className)}
      {...props}
    >
      {content}
      {status ? (
        <span data-status={status} className="sd-avatar-status">
          <span className="sd-visually-hidden">{statusLabel ?? statusLabels[status]}</span>
        </span>
      ) : null}
    </AvatarPrimitive>
  )
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarImagePrimitive>) {
  return <AvatarImagePrimitive className={cx("sd-avatar-image", className)} {...props} />
}

function AvatarFallback({ className, ...props }: React.ComponentProps<typeof AvatarFallbackPrimitive>) {
  return <AvatarFallbackPrimitive className={cx("sd-avatar-fallback", className)} {...props} />
}

/** The silhouette shown when there's neither an image nor a name. */
function AvatarPlaceholder() {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" className="sd-avatar-placeholder">
      <circle cx="16" cy="12.5" r="5.75" />
      <path d="M5.5 28.5c1.4-5.6 5.6-8.6 10.5-8.6s9.1 3 10.5 8.6" />
    </svg>
  )
}

type AvatarGroupProps = React.ComponentProps<"div"> & {
  size?: AvatarSize
  /** Avatars past this many collapse into a "+N" count. */
  max?: number
}

/** Overlapping avatars for the people on a document or in a thread. Give it an `aria-label`. */
function AvatarGroup({ size = "md", max, className, children, ...props }: AvatarGroupProps) {
  const items = React.Children.toArray(children)
  const shown = max !== undefined && items.length > max ? items.slice(0, Math.max(max - 1, 0)) : items
  const hidden = items.length - shown.length

  return (
    <div role="group" data-size={size} className={join("sd-avatar-group", className)} {...props}>
      {shown}
      {hidden > 0 ? (
        <span data-shape="circle" className="sd-avatar sd-avatar-overflow">
          <span aria-hidden="true">+{hidden}</span>
          <span className="sd-visually-hidden">{`and ${hidden} more`}</span>
        </span>
      ) : null}
    </div>
  )
}

export { Avatar, AvatarFallback, AvatarGroup, AvatarImage }
export type { AvatarGroupProps, AvatarProps, AvatarSize, AvatarStatus }
