"use client"

import { Button as ButtonPrimitive } from "@ui-sdk/react/button"
import type * as React from "react"
import { join } from "../lib/cx"
import type { SystemColor } from "../lib/theme"

type ListVariant = "inset-grouped" | "grouped" | "plain"

type ListProps = React.ComponentProps<"div"> & {
  /** `inset-grouped` is iOS Settings and macOS System Settings; `plain` runs edge to edge. */
  variant?: ListVariant
}

function List({ variant = "inset-grouped", className, ...props }: ListProps) {
  return <div data-variant={variant} className={join("mb-list", className)} {...props} />
}

type ListSectionProps = Omit<React.ComponentProps<"section">, "title"> & {
  header?: React.ReactNode
  footer?: React.ReactNode
}

/** A group of rows with an optional header above and footer below. */
function ListSection({ header, footer, className, children, ...props }: ListSectionProps) {
  return (
    <section className={join("mb-list-section", className)} {...props}>
      {header ? <div className="mb-list-section-header">{header}</div> : null}
      <div className="mb-list-group">{children}</div>
      {footer ? <div className="mb-list-section-footer">{footer}</div> : null}
    </section>
  )
}

type ListRowProps = Omit<React.ComponentProps<typeof ButtonPrimitive>, "className"> & {
  className?: string
  /** Makes the row a link. Use `render` for a router's link component. */
  href?: string
}

/**
 * A row. It's a button with `onClick`, a link with `href` or `render`, and
 * static otherwise, which is what a row holding its own control (a Switch) needs.
 */
function ListRow({ href, render, onClick, className, children, disabled, ...props }: ListRowProps) {
  const interactive = href !== undefined || render !== undefined || onClick !== undefined
  return (
    <div className="mb-list-item" data-disabled={disabled ? "" : undefined}>
      {interactive ? (
        <ButtonPrimitive
          render={render ?? (href !== undefined ? <a href={href} /> : undefined)}
          onClick={onClick}
          disabled={disabled}
          data-interactive=""
          className={join("mb-list-row", className)}
          {...props}
        >
          {children}
        </ButtonPrimitive>
      ) : (
        <div
          className={join("mb-list-row", className)}
          data-disabled={disabled ? "" : undefined}
          {...(props as React.ComponentProps<"div">)}
        >
          {children as React.ReactNode}
        </div>
      )}
    </div>
  )
}

type ListRowIconProps = React.ComponentProps<"span"> & {
  /** The tile's color, from the system palette. */
  color?: SystemColor | "gray" | "accent"
}

/** The rounded, colored icon tile of a Settings row. Put a white glyph inside. */
function ListRowIcon({ color = "gray", className, ...props }: ListRowIconProps) {
  return <span aria-hidden="true" data-color={color} className={join("mb-list-row-icon", className)} {...props} />
}

function ListRowTitle({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={join("mb-list-row-title", className)} {...props} />
}

function ListRowSubtitle({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={join("mb-list-row-subtitle", className)} {...props} />
}

/** The secondary text at the trailing edge, like the network a Wi-Fi row is joined to. */
function ListRowValue({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={join("mb-list-row-value", className)} {...props} />
}

type ListRowAccessoryProps = React.ComponentProps<"span"> & {
  /** A standard glyph. Leave it out and pass children for a control, like a Switch. */
  type?: "disclosure" | "checkmark" | "info"
}

const glyphs = {
  disclosure: (
    <svg viewBox="0 0 8 14" aria-hidden="true">
      <path d="M1.5 1.5 6.5 7l-5 5.5" />
    </svg>
  ),
  checkmark: (
    <svg viewBox="0 0 16 14" aria-hidden="true">
      <path d="M1.75 7.75 6 12 14.25 1.75" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 22 22" aria-hidden="true">
      <circle cx="11" cy="11" r="9.75" />
      <path d="M11 9.75v6" />
      <circle cx="11" cy="6.4" r="0.6" />
    </svg>
  ),
}

function ListRowAccessory({ type, className, children, ...props }: ListRowAccessoryProps) {
  return (
    <span data-type={type} className={join("mb-list-row-accessory", className)} {...props}>
      {type ? glyphs[type] : children}
    </span>
  )
}

export { List, ListRow, ListRowAccessory, ListRowIcon, ListRowSubtitle, ListRowTitle, ListRowValue, ListSection }
export type { ListProps, ListRowAccessoryProps, ListRowIconProps, ListRowProps, ListSectionProps, ListVariant }
