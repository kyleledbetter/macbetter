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
      className={join("mb-window", className)}
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
      className={join("mb-window-titlebar", className)}
      {...props}
    />
  )
}

type WindowTitleProps = React.ComponentProps<"div"> & {
  /**
   * `leading` beside a unified toolbar. `center` keeps the title in the middle of the bar whatever sits on
   * either side, and truncates it before it reaches them; no spacer needed.
   */
  align?: "center" | "leading"
  subtitle?: React.ReactNode
}

function WindowTitle({ align = "leading", subtitle, className, children, ...props }: WindowTitleProps) {
  return (
    <div data-align={align} className={join("mb-window-title", className)} {...props}>
      <span className="mb-window-title-text">{children}</span>
      {subtitle ? <span className="mb-window-subtitle">{subtitle}</span> : null}
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
      className={join("mb-window-traffic-lights", className)}
      {...props}
    >
      {(Object.keys(glyphs) as TrafficLight[]).map((light) => {
        const glyph = (
          <svg viewBox="0 0 12 12" aria-hidden="true" className="mb-window-traffic-light-glyph">
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
            className="mb-window-traffic-light"
          >
            {glyph}
          </ButtonPrimitive>
        ) : (
          <span key={light} data-light={light} className="mb-window-traffic-light">
            {glyph}
          </span>
        )
      })}
    </div>
  )
}

/** What comes before a centered title: traffic lights, an app name, a menu. */
function WindowTitlebarLeading({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={join("mb-window-titlebar-leading", className)} {...props} />
}

/** A control held in the middle of the bar, like Calendar's Day, Week, Month and Year. Centers like a centered title. */
function WindowTitlebarCenter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={join("mb-window-titlebar-center", className)} {...props} />
}

/** What comes after a centered title, held against the trailing edge: a toolbar, an account menu. */
function WindowTitlebarTrailing({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={join("mb-window-titlebar-trailing", className)} {...props} />
}

function WindowSidebar({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={join("mb-window-sidebar", className)} {...props} />
}

/**
 * The top of a sidebar, level with the title bar: traffic lights, an app name, a workspace menu,
 * or nothing. It keeps its height when empty, so the list below starts where it would beside the lights.
 */
function WindowSidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={join("mb-window-sidebar-header", className)} {...props} />
}

type WindowAppNameProps = React.ComponentProps<"span"> & {
  /** A 20-point app icon or workspace avatar. Decorative: the name is what's read. */
  icon?: React.ReactNode
}

/** The app or workspace name where the traffic lights would sit. Put it inside a MenuTrigger to make it a switcher. */
function WindowAppName({ icon, className, children, ...props }: WindowAppNameProps) {
  return (
    <span className={join("mb-window-app-name", className)} {...props}>
      {icon ? (
        <span aria-hidden="true" className="mb-window-app-name-icon">
          {icon}
        </span>
      ) : null}
      <span className="mb-window-app-name-text">{children}</span>
    </span>
  )
}

function WindowBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={join("mb-window-body", className)} {...props} />
}

export {
  Window,
  WindowAppName,
  WindowBody,
  WindowSidebar,
  WindowSidebarHeader,
  WindowTitle,
  WindowTitlebar,
  WindowTitlebarCenter,
  WindowTitlebarLeading,
  WindowTitlebarTrailing,
  WindowTrafficLights,
}
export type { WindowAppNameProps, WindowProps, WindowTitlebarProps, WindowTitleProps, WindowTrafficLightsProps }
