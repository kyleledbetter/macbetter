"use client"

import {
  Toast as ToastPrimitive,
  ToastAction as ToastActionPrimitive,
  ToastClose as ToastClosePrimitive,
  ToastDescription as ToastDescriptionPrimitive,
  ToastRegion,
  ToastTitle as ToastTitlePrimitive,
  type ToastData,
  type ToastType,
} from "@ui-sdk/react/toast"
import * as React from "react"
import { cx, join } from "../lib/cx"
import type { Platform } from "../lib/platform"

/** What a notification can carry in `data`, beyond its title and description. */
type NotificationData = {
  /** The app icon, about 32pt on macOS and 38pt on iOS. Defaults to a glyph for the toast's type. */
  icon?: React.ReactNode
  /** When it happened, shown at the trailing edge, like "now" or "2m ago". */
  time?: React.ReactNode
}

function Toast({ className, ...props }: React.ComponentProps<typeof ToastPrimitive>) {
  return <ToastPrimitive className={cx("mb-toast", className)} {...props} />
}

function ToastTitle({ className, ...props }: React.ComponentProps<typeof ToastTitlePrimitive>) {
  return <ToastTitlePrimitive className={cx("mb-toast-title", className)} {...props} />
}

function ToastDescription({ className, ...props }: React.ComponentProps<typeof ToastDescriptionPrimitive>) {
  return <ToastDescriptionPrimitive className={cx("mb-toast-description", className)} {...props} />
}

function ToastAction({ className, ...props }: React.ComponentProps<typeof ToastActionPrimitive>) {
  return <ToastActionPrimitive className={cx("mb-toast-action", className)} {...props} />
}

function ToastClose({ className, children, ...props }: React.ComponentProps<typeof ToastClosePrimitive>) {
  return (
    <ToastClosePrimitive aria-label="Close" className={cx("mb-toast-close", className)} {...props}>
      {children ?? (
        <svg viewBox="0 0 10 10" aria-hidden="true">
          <path d="M2.5 2.5l5 5m0-5l-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      )}
    </ToastClosePrimitive>
  )
}

/** A rounded app-icon tile, for an icon you pass in `data.icon` or the glyph of the toast's type. */
function ToastIcon({ className, ...props }: React.ComponentProps<"span">) {
  return <span aria-hidden="true" className={join("mb-toast-icon", className)} {...props} />
}

const typeGlyphs: Partial<Record<ToastType, React.ReactNode>> = {
  success: <path d="M6.5 12.5l3.5 3.5 7.5-8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />,
  error: <path d="M8 8l8 8m0-8l-8 8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />,
  warning: (
    <>
      <path d="M12 6.5v7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="12" cy="17.25" r="1.5" fill="currentColor" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="7" r="1.5" fill="currentColor" />
      <path d="M12 11v6.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </>
  ),
}

function defaultIcon(type: ToastType | undefined) {
  if (type === "loading") return <span className="mb-toast-spinner" />
  const glyph = type ? typeGlyphs[type] : undefined
  return glyph ? <svg viewBox="0 0 24 24">{glyph}</svg> : null
}

function Notification({ toast }: { toast: ToastData<React.ReactNode> }) {
  const data = (toast.data ?? {}) as NotificationData
  const icon = data.icon ?? defaultIcon(toast.type)
  return (
    <Toast>
      {icon ? <ToastIcon data-type={data.icon ? undefined : toast.type}>{icon}</ToastIcon> : null}
      <div className="mb-toast-content">
        <div className="mb-toast-header">
          <ToastTitle />
          <span className="mb-toast-time">{data.time ?? "now"}</span>
        </div>
        <ToastDescription />
      </div>
      {toast.action ? <ToastAction /> : null}
      <ToastClose />
    </Toast>
  )
}

/** Reads the platform of the nearest `data-platform`, so a notification host inside a phone preview acts like one. */
function usePlatform(ref: React.RefObject<HTMLElement | null>): Platform {
  const [platform, setPlatform] = React.useState<Platform>("macos")
  React.useEffect(() => {
    const host = ref.current?.closest<HTMLElement>("[data-platform]")
    if (!host) return
    const read = () => setPlatform((host.dataset.platform as Platform | undefined) ?? "macos")
    read()
    const observer = new MutationObserver(read)
    observer.observe(host, { attributes: true, attributeFilter: ["data-platform"] })
    return () => observer.disconnect()
  }, [ref])
  return platform
}

/**
 * The region lives in the top layer, positioned against the viewport. Inside a
 * nested platform preview (a phone on a Mac page) it treats that preview's box
 * as its screen instead, by writing the preview's distances from each edge.
 */
function useNestedScreen(ref: React.RefObject<HTMLElement | null>) {
  React.useEffect(() => {
    const sentinel = ref.current
    const host = sentinel?.parentElement?.closest<HTMLElement>("[data-platform]")
    const region = sentinel?.nextElementSibling
    if (!host || host === document.documentElement || !(region instanceof HTMLElement)) return
    let frame = 0
    const write = () => {
      frame = 0
      const box = host.getBoundingClientRect()
      const rtl = getComputedStyle(region).direction === "rtl"
      const left = box.left
      const right = window.innerWidth - box.right
      region.style.setProperty("--mb-toaster-top", `${box.top}px`)
      region.style.setProperty("--mb-toaster-bottom", `${window.innerHeight - box.bottom}px`)
      region.style.setProperty("--mb-toaster-inline-start", `${rtl ? right : left}px`)
      region.style.setProperty("--mb-toaster-inline-end", `${rtl ? left : right}px`)
      region.style.setProperty("--mb-toaster-screen-width", `${box.width}px`)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(write)
    }
    write()
    const resize = new ResizeObserver(schedule)
    resize.observe(host)
    window.addEventListener("scroll", schedule, { capture: true, passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      window.removeEventListener("scroll", schedule, { capture: true })
      window.removeEventListener("resize", schedule)
      for (const name of ["top", "bottom", "inline-start", "inline-end", "screen-width"]) {
        region.style.removeProperty(`--mb-toaster-${name}`)
      }
    }
  }, [ref])
}

type ToasterProps = Omit<React.ComponentProps<typeof ToastRegion>, "children"> & {
  /** Renders each toast. Defaults to a system notification: icon, title, time, description, action and close. */
  children?: React.ComponentProps<typeof ToastRegion>["children"]
}

/**
 * The notification host. Mount it once near the root and call `toast()` from
 * anywhere: notifications drop in at the top right on the Mac and as banners
 * at the top of the screen on iPhone and iPad.
 */
function Toaster({ align, side = "top", className, children, ...props }: ToasterProps) {
  const sentinel = React.useRef<HTMLSpanElement>(null)
  const platform = usePlatform(sentinel)
  useNestedScreen(sentinel)
  return (
    <>
      <span ref={sentinel} hidden />
      <ToastRegion
        side={side}
        align={align ?? (platform === "macos" ? "end" : "center")}
        className={cx("mb-toaster", className)}
        {...props}
      >
        {children ?? ((toast) => <Notification toast={toast} />)}
      </ToastRegion>
    </>
  )
}

export { createToaster, toast } from "@ui-sdk/react/toast"
export type { ToastData, ToastType, Toaster as ToasterQueue } from "@ui-sdk/react/toast"
export { Toast, ToastAction, ToastClose, ToastDescription, Toaster, ToastIcon, ToastTitle }
export type { NotificationData, ToasterProps }
