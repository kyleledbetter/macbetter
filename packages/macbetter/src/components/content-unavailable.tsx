import { type RenderProp, renderElement } from "@ui-sdk/react/primitive"
import type * as React from "react"
import { join } from "../lib/cx"

type ContentUnavailableProps = React.ComponentProps<"div"> & {
  /** `sm` fits a sidebar or popover, `md` a pane, `lg` an empty window. */
  size?: "sm" | "md" | "lg"
}

/** The empty state: an icon, a title, a description and actions, centered in the space it fills. */
function ContentUnavailable({ size = "md", className, ...props }: ContentUnavailableProps) {
  return <div data-size={size} className={join("mb-content-unavailable", className)} {...props} />
}

/** A large glyph above the title. Decorative: the title says what happened. */
function ContentUnavailableIcon({ className, ...props }: React.ComponentProps<"span">) {
  return <span aria-hidden="true" className={join("mb-content-unavailable-icon", className)} {...props} />
}

type ContentUnavailableTitleProps = React.ComponentProps<"h2"> & {
  /** Renders a different heading level, such as `<h3 />`, to fit the page's outline. */
  render?: RenderProp
}

function ContentUnavailableTitle({ className, render, ...props }: ContentUnavailableTitleProps) {
  return renderElement("h2", { ...props, className: join("mb-content-unavailable-title", className) }, render)
}

function ContentUnavailableDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={join("mb-content-unavailable-description", className)} {...props} />
}

function ContentUnavailableActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={join("mb-content-unavailable-actions", className)} {...props} />
}

export {
  ContentUnavailable,
  ContentUnavailableActions,
  ContentUnavailableDescription,
  ContentUnavailableIcon,
  ContentUnavailableTitle,
}
export type { ContentUnavailableProps, ContentUnavailableTitleProps }
