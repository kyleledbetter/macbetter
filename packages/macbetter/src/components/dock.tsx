"use client"

import { Toolbar, ToolbarButton, ToolbarLink, ToolbarSeparator } from "@ui-sdk/react/toolbar"
import * as React from "react"
import { cx, join } from "../lib/cx"

type DockAppearance = "default" | "dark" | "clear" | "tinted"

type DockProps = React.ComponentProps<typeof Toolbar> & {
  /** How large the icon under the pointer grows, as a multiple of its size. 1 turns magnification off. */
  magnification?: number
  /** The app-icon style, as people choose it in macOS: full color, dark, clear glass, or one tint. */
  appearance?: DockAppearance
}

const ITEM = ".mb-dock-item"

function Dock({
  magnification = 1.75,
  appearance = "default",
  className,
  onPointerMove,
  onPointerLeave,
  ...props
}: DockProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const frame = React.useRef(0)
  const pointer = React.useRef<number | null>(null)

  React.useEffect(() => () => cancelAnimationFrame(frame.current), [])

  const update = React.useCallback(() => {
    frame.current = 0
    const root = ref.current
    if (!root) return
    const x = pointer.current
    const items = root.querySelectorAll<HTMLElement>(ITEM)
    if (x === null) {
      root.removeAttribute("data-magnifying")
      for (const item of items) item.style.removeProperty("--mb-dock-scale")
      return
    }
    root.setAttribute("data-magnifying", "")
    const base = Number.parseFloat(getComputedStyle(root).getPropertyValue("--mb-dock-icon-size")) || 48
    const reach = base * 3
    for (const item of items) {
      const rect = item.getBoundingClientRect()
      const distance = Math.min(Math.abs(x - (rect.left + rect.width / 2)) / reach, 1)
      const scale = 1 + (magnification - 1) * ((1 + Math.cos(Math.PI * distance)) / 2)
      item.style.setProperty("--mb-dock-scale", scale.toFixed(3))
    }
  }, [magnification])

  const schedule = () => {
    if (!frame.current) frame.current = requestAnimationFrame(update)
  }

  return (
    <Toolbar
      ref={ref}
      className={cx("mb-dock", className)}
      data-appearance={appearance}
      onPointerMove={(event) => {
        onPointerMove?.(event)
        if (event.pointerType !== "mouse" || magnification <= 1) return
        if (
          matchMedia("(prefers-reduced-motion: reduce)").matches &&
          document.documentElement.dataset.motion !== "full"
        )
          return
        pointer.current = event.clientX
        schedule()
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event)
        if (pointer.current === null) return
        pointer.current = null
        schedule()
      }}
      {...props}
    />
  )
}

type DockItemProps = {
  /** The app's name: the item's accessible name and the label shown above it. */
  label: string
  /** Draws the dot under an app that's open. */
  running?: boolean
  /** The icon's background color, drawn as a gradient that's lighter at the top. Any CSS color. */
  tint?: string
  /** Renders the item as a link. */
  href?: string
  disabled?: boolean
  className?: string
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  children: React.ReactNode
}

function DockItem({ label, running, tint, href, disabled, className, onClick, children }: DockItemProps) {
  const [bouncing, setBouncing] = React.useState(false)
  const shared = {
    "aria-label": label,
    "data-running": running ? "" : undefined,
    "data-bouncing": bouncing ? "" : undefined,
    className: join("mb-dock-item", className),
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      // An app that isn't open bounces while it launches, as the Dock does.
      if (!running) setBouncing(true)
      onClick?.(event)
    },
    onAnimationEnd: (event: React.AnimationEvent<HTMLElement>) => {
      if (event.animationName === "mb-dock-bounce") setBouncing(false)
    },
  }
  const content = (
    <>
      <span aria-hidden="true" className="mb-dock-item-label">
        {label}
      </span>
      <span
        className="mb-dock-item-icon"
        style={tint ? ({ "--mb-dock-item-tint": tint } as React.CSSProperties) : undefined}
      >
        {children}
      </span>
    </>
  )
  return href ? (
    <ToolbarLink href={href} {...shared}>
      {content}
    </ToolbarLink>
  ) : (
    <ToolbarButton disabled={disabled} {...shared}>
      {content}
    </ToolbarButton>
  )
}

function DockSeparator({ className, ...props }: React.ComponentProps<typeof ToolbarSeparator>) {
  return <ToolbarSeparator className={cx("mb-dock-separator", className)} {...props} />
}

export { Dock, DockItem, DockSeparator }
export type { DockAppearance, DockItemProps, DockProps }
