import { Button as ButtonPrimitive } from "@ui-sdk/react/button"
import type * as React from "react"
import { join } from "../lib/cx"

type WindowProps = React.ComponentProps<"div"> & {
  /** Draws the window as it looks behind the key window: gray traffic lights, quieter chrome. */
  inactive?: boolean
}

function Window({ inactive, className, ...props }: WindowProps) {
  return (
    <div
      role="group"
      data-inactive={inactive ? "" : undefined}
      className={join("sd-window", className)}
      {...props}
    />
  )
}

type WindowTitlebarProps = React.ComponentProps<"div"> & {
  /** `unified` is the 52px title bar that holds a toolbar; `compact` is the 28px title-only bar. */
  variant?: "unified" | "compact"
  /** Draws the hairline between the title bar and the content. */
  bordered?: boolean
}

function WindowTitlebar({ variant = "unified", bordered = true, className, ...props }: WindowTitlebarProps) {
  return (
    <div
      data-variant={variant}
      data-bordered={bordered ? "" : undefined}
      className={join("sd-window-titlebar", className)}
      {...props}
    />
  )
}

type WindowTitleProps = React.ComponentProps<"div"> & {
  /** `center` for a title-only window, `leading` beside a unified toolbar. */
  align?: "center" | "leading"
  subtitle?: React.ReactNode
}

function WindowTitle({ align = "leading", subtitle, className, children, ...props }: WindowTitleProps) {
  return (
    <div data-align={align} className={join("sd-window-title", className)} {...props}>
      <span className="sd-window-title-text">{children}</span>
      {subtitle ? <span className="sd-window-subtitle">{subtitle}</span> : null}
    </div>
  )
}

type TrafficLight = "close" | "minimize" | "zoom"

const glyphs: Record<TrafficLight, React.ReactNode> = {
  close: <path d="M3.5 3.5l5 5m0-5l-5 5" strokeWidth="1.3" strokeLinecap="round" />,
  minimize: <path d="M2.8 6h6.4" strokeWidth="1.4" strokeLinecap="round" />,
  zoom: <path d="M3.3 3.3h4L3.3 7.3zM8.7 8.7h-4l4-4z" fill="currentColor" stroke="none" />,
}

const lightLabels: Record<TrafficLight, string> = { close: "Close", minimize: "Minimize", zoom: "Zoom" }

type WindowTrafficLightsProps = Omit<React.ComponentProps<"div">, "children"> & {
  onClose?: React.MouseEventHandler<HTMLElement>
  onMinimize?: React.MouseEventHandler<HTMLElement>
  onZoom?: React.MouseEventHandler<HTMLElement>
}

function WindowTrafficLights({ onClose, onMinimize, onZoom, className, ...props }: WindowTrafficLightsProps) {
  const handlers: Record<TrafficLight, WindowTrafficLightsProps["onClose"]> = {
    close: onClose,
    minimize: onMinimize,
    zoom: onZoom,
  }
  const interactive = Boolean(onClose || onMinimize || onZoom)

  return (
    <div
      role={interactive ? "group" : undefined}
      aria-label={interactive ? "Window controls" : undefined}
      aria-hidden={interactive ? undefined : true}
      className={join("sd-window-traffic-lights", className)}
      {...props}
    >
      {(Object.keys(glyphs) as TrafficLight[]).map((light) => {
        const glyph = (
          <svg viewBox="0 0 12 12" aria-hidden="true" className="sd-window-traffic-light-glyph">
            {glyphs[light]}
          </svg>
        )
        const onClick = handlers[light]
        return onClick ? (
          <ButtonPrimitive
            key={light}
            data-light={light}
            aria-label={lightLabels[light]}
            onClick={onClick}
            className="sd-window-traffic-light"
          >
            {glyph}
          </ButtonPrimitive>
        ) : (
          <span key={light} data-light={light} className="sd-window-traffic-light">
            {glyph}
          </span>
        )
      })}
    </div>
  )
}

function WindowSidebar({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={join("sd-window-sidebar", className)} {...props} />
}

function WindowBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={join("sd-window-body", className)} {...props} />
}

export { Window, WindowBody, WindowSidebar, WindowTitle, WindowTitlebar, WindowTrafficLights }
export type { WindowProps, WindowTitlebarProps, WindowTitleProps, WindowTrafficLightsProps }
