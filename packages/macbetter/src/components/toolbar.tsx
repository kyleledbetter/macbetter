import { Toggle, ToggleGroup } from "@ui-sdk/react/toggle"
import {
  ToolbarButton as ToolbarButtonPrimitive,
  ToolbarGroup as ToolbarGroupPrimitive,
  ToolbarInput as ToolbarInputPrimitive,
  ToolbarLink as ToolbarLinkPrimitive,
  Toolbar as ToolbarPrimitive,
  ToolbarSeparator as ToolbarSeparatorPrimitive,
} from "@ui-sdk/react/toolbar"
import type * as React from "react"
import { cx, join } from "../lib/cx"

type ToolbarProps = React.ComponentProps<typeof ToolbarPrimitive> & {
  /** `unified` sits in a macOS window's title bar; `floating` is the iOS bottom toolbar of glass capsules. */
  variant?: "unified" | "floating"
}

function Toolbar({ variant = "unified", className, ...props }: ToolbarProps) {
  return <ToolbarPrimitive data-variant={variant} className={cx("mb-toolbar", className)} {...props} />
}

function ToolbarButton({ className, ...props }: React.ComponentProps<typeof ToolbarButtonPrimitive>) {
  return <ToolbarButtonPrimitive className={cx("mb-toolbar-button", className)} {...props} />
}

/** A toolbar button that stays pressed, like Show Sidebar or a view mode. */
function ToolbarToggle({ className, ...props }: React.ComponentProps<typeof Toggle>) {
  return <Toggle className={cx("mb-toolbar-button", className)} {...props} />
}

function ToolbarLink({ className, ...props }: React.ComponentProps<typeof ToolbarLinkPrimitive>) {
  return <ToolbarLinkPrimitive className={cx("mb-toolbar-button", className)} {...props} />
}

function ToolbarGroup({ className, ...props }: React.ComponentProps<typeof ToolbarGroupPrimitive>) {
  return <ToolbarGroupPrimitive className={cx("mb-toolbar-group", className)} {...props} />
}

/** One choice from a cluster of toggles, like the Finder's icon, list and column views. */
function ToolbarToggleGroup({ className, ...props }: React.ComponentProps<typeof ToggleGroup>) {
  return <ToggleGroup className={cx("mb-toolbar-group", className)} {...props} />
}

function ToolbarSeparator({ className, ...props }: React.ComponentProps<typeof ToolbarSeparatorPrimitive>) {
  return <ToolbarSeparatorPrimitive className={cx("mb-toolbar-separator", className)} {...props} />
}

/** Flexible space: pushes what follows to the trailing edge. */
function ToolbarSpacer({ className, ...props }: React.ComponentProps<"div">) {
  return <div aria-hidden="true" className={join("mb-toolbar-spacer", className)} {...props} />
}

type ToolbarTitleProps = React.ComponentProps<"div"> & {
  subtitle?: React.ReactNode
}

function ToolbarTitle({ subtitle, className, children, ...props }: ToolbarTitleProps) {
  return (
    <div className={join("mb-toolbar-title", className)} {...props}>
      <span className="mb-toolbar-title-text">{children}</span>
      {subtitle ? <span className="mb-toolbar-subtitle">{subtitle}</span> : null}
    </div>
  )
}

type ToolbarSearchFieldProps = React.ComponentProps<typeof ToolbarInputPrimitive>

/** A search field that joins the toolbar's arrow-key navigation. Name it with `aria-label`. */
function ToolbarSearchField({ className, placeholder = "Search", ...props }: ToolbarSearchFieldProps) {
  return (
    <span className="mb-toolbar-search">
      <svg viewBox="0 0 16 16" aria-hidden="true" className="mb-toolbar-search-icon">
        <circle cx="7" cy="7" r="4.75" />
        <path d="m10.5 10.5 3.25 3.25" />
      </svg>
      <ToolbarInputPrimitive
        type="search"
        placeholder={placeholder}
        className={cx("mb-toolbar-search-input", className)}
        {...props}
      />
    </span>
  )
}

export {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarLink,
  ToolbarSearchField,
  ToolbarSeparator,
  ToolbarSpacer,
  ToolbarTitle,
  ToolbarToggle,
  ToolbarToggleGroup,
}
export type { ToolbarProps, ToolbarSearchFieldProps, ToolbarTitleProps }
