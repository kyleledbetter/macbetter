import { type RenderProp, renderElement } from "@ui-sdk/react/primitive"
import type * as React from "react"
import { join } from "../lib/cx"

type MaterialThickness = "ultrathin" | "thin" | "regular" | "thick" | "chrome" | "sidebar"
type GlassShape = "rounded" | "capsule" | "circle"

type MaterialProps = React.ComponentProps<"div"> & {
  /** Thicker materials hide more of what's behind them. Use thicker ones for bigger surfaces. */
  material?: MaterialThickness
  /** Renders a different element, such as `<aside />` or `<nav />`, with the material's props. */
  render?: RenderProp
}

/** A translucent surface that blurs what's behind it: bars, sidebars, popovers, sheets. */
function Material({ material = "regular", className, render, ...props }: MaterialProps) {
  return renderElement(
    "div",
    { ...props, "data-material": material, className: join("mb-material", className) },
    render
  )
}

type GlassProps = React.ComponentProps<"div"> & {
  /** `clear` is more transparent, for glass over media; `tinted` carries the accent. */
  variant?: "regular" | "clear" | "tinted"
  shape?: GlassShape
  /** Responds to hover and press, for glass that is itself a control. */
  interactive?: boolean
  render?: RenderProp
}

/** Liquid Glass: the clear, lensing layer for controls that float over content. */
function Glass({ variant = "regular", shape = "rounded", interactive, className, render, ...props }: GlassProps) {
  return renderElement(
    "div",
    {
      ...props,
      "data-variant": variant,
      "data-shape": shape,
      "data-interactive": interactive ? "" : undefined,
      className: join("mb-glass", className),
    },
    render
  )
}

type GlassGroupProps = React.ComponentProps<"div"> & {
  orientation?: "horizontal" | "vertical"
  variant?: "regular" | "clear"
  render?: RenderProp
}

/**
 * One capsule of glass holding a cluster of plain controls, like a toolbar's
 * trailing buttons or a map's zoom controls. Give it an `aria-label`.
 */
function GlassGroup({ orientation = "horizontal", variant = "regular", className, render, ...props }: GlassGroupProps) {
  return renderElement(
    "div",
    {
      role: "group",
      ...props,
      "data-orientation": orientation,
      "data-variant": variant,
      "data-shape": "capsule",
      className: join("mb-glass mb-glass-group", className),
    },
    render
  )
}

export { Glass, GlassGroup, Material }
export type { GlassGroupProps, GlassProps, GlassShape, MaterialProps, MaterialThickness }
