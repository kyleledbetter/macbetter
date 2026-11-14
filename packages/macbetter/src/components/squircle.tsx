import { type RenderProp, renderElement } from "@ui-sdk/react/primitive"
import type * as React from "react"
import { join } from "../lib/cx"
import { SQUIRCLE_ICON_RATIO, SQUIRCLE_SMOOTHING, squirclePath } from "../lib/squircle"

type SquircleRadius = number | string | "icon"

type SquircleProps = Omit<React.ComponentProps<"div">, "style"> & {
  style?: React.CSSProperties
  /** A number is pixels, a string any CSS length or percentage. `icon` is an app icon's proportion. */
  radius?: SquircleRadius
  /** How far the corner eases into the edge, 0 (a circular arc) to 1. Defaults to iOS's. */
  smoothing?: number
  /** Width and height in pixels, for a square. Needed for `exact`. */
  size?: number
  width?: number
  height?: number
  /**
   * Draws the true shape with a `clip-path` computed on the server, so it looks
   * the same in every browser. Needs a known size; without one it falls back to
   * `corner-shape`.
   */
  exact?: boolean
  /** A drop shadow that follows the shape. In `exact` mode it's drawn by a wrapper, since a clip-path cuts shadows off. */
  shadow?: boolean
  render?: RenderProp
}

// superellipse(k) at m × the radius best matches a smoothing s: fitted against
// the same outlines as the tokens (s 0.77 ↔ k 1.7, m 1.5; s 0 is a plain arc).
function cssFit(smoothing: number) {
  const s = Math.min(Math.max(smoothing, 0), 1)
  return { k: 1 + s * (0.7 / SQUIRCLE_SMOOTHING), m: 1 + s * (0.5 / SQUIRCLE_SMOOTHING) }
}

function cssRadius(radius: SquircleRadius): string {
  if (radius === "icon") return "var(--mb-squircle-radius-icon)"
  return typeof radius === "number" ? `${radius}px` : radius
}

/** The radius in pixels for a box of the given size, or null when CSS has to resolve it. */
function pixelRadius(radius: SquircleRadius, width: number, height: number): number | null {
  if (radius === "icon") return SQUIRCLE_ICON_RATIO * Math.min(width, height)
  if (typeof radius === "number") return radius
  const match = /^\s*(-?[\d.]+)\s*(px|%)?\s*$/.exec(radius)
  if (!match) return null
  const value = Number.parseFloat(match[1])
  return match[2] === "%" ? (value / 100) * Math.min(width, height) : value
}

/**
 * A box with Apple's continuous corners: app icons, artwork, tiles. Uses
 * `corner-shape` where the browser has it and a plain radius elsewhere, or with
 * `exact` and a known size, the true outline in every browser.
 */
function Squircle({
  radius = "icon",
  smoothing,
  size,
  width = size,
  height = size,
  exact,
  shadow,
  className,
  style,
  render,
  ...props
}: SquircleProps) {
  const sized = width !== undefined && height !== undefined && width > 0 && height > 0
  const px = sized ? pixelRadius(radius, width, height) : null
  const path = exact && sized && px !== null ? squirclePath(width, height, px, smoothing ?? SQUIRCLE_SMOOTHING) : null
  const fit = smoothing === undefined ? null : cssFit(smoothing)

  const element = renderElement(
    "div",
    {
      ...props,
      "data-exact": path ? "" : undefined,
      "data-shadow": shadow && !path ? "" : undefined,
      "data-smoothing": fit ? "" : undefined,
      className: join("mb-squircle", className),
      style: {
        "--mb-squircle-radius": cssRadius(radius),
        ...(fit && { "--mb-squircle-k": fit.k.toFixed(3), "--mb-squircle-m": fit.m.toFixed(3) }),
        ...style,
        ...(width !== undefined && { width }),
        ...(height !== undefined && { height }),
        ...(path && { clipPath: `path("${path}")` }),
      } as React.CSSProperties,
    },
    render
  )

  return path && shadow ? <SquircleShadow>{element}</SquircleShadow> : element
}

type SquircleShadowProps = React.ComponentProps<"div"> & { render?: RenderProp }

/**
 * Draws a shadow around whatever shape its child is clipped to, with
 * `filter: drop-shadow()`. Wrap a clipped element in it; set
 * `--mb-squircle-shadow` to change the shadow.
 */
function SquircleShadow({ className, render, ...props }: SquircleShadowProps) {
  return renderElement("div", { ...props, className: join("mb-squircle-shadow", className) }, render)
}

export { Squircle, SquircleShadow, squirclePath }
export type { SquircleProps, SquircleRadius, SquircleShadowProps }
