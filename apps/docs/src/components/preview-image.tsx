"use client"

import type { Platform } from "macbetter"
import { ActivityIndicator } from "macbetter/activity-indicator"
import { Menu, MenuContent, MenuItem, MenuItemIcon, MenuTrigger } from "macbetter/menu"
import { toast } from "macbetter/toast"
import { CheckIcon, CopyIcon, DownloadIcon, ImageIcon } from "lucide-react"
import * as React from "react"
import { canCopyImages, capturePreview, copyBlob, downloadBlob, preloadCapture } from "@/lib/capture-preview"

type PreviewImageMenuProps = {
  /** Renders the PNG. Called once per menu choice. */
  capture: (trigger: HTMLElement) => Promise<Blob>
  /** The download's file name, worked out when it's chosen. */
  fileName: (trigger: HTMLElement) => string
  className?: string
}


/** An image button whose menu copies or downloads a PNG of a preview. */
function PreviewImageMenu({ capture, fileName, className }: PreviewImageMenuProps) {
  const trigger = React.useRef<HTMLButtonElement>(null)
  const [state, setState] = React.useState<"idle" | "busy" | "done">("idle")
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  React.useEffect(() => () => clearTimeout(timer.current), [])

  const download = (blob: Promise<Blob>, element: HTMLElement) =>
    blob.then((png) => downloadBlob(png, fileName(element)))

  const run = (value: string) => {
    const element = trigger.current
    if (!element || state === "busy") return
    if (value === "copy" && !canCopyImages()) {
      offerDownload("This browser can't copy images", "Download the image instead.", () => run("download"))
      return
    }
    clearTimeout(timer.current)
    setState("busy")
    const blob = capture(element)
    // A copy starts its write now, inside the click, and hands over the PNG when it's ready.
    const job = value === "copy" ? copyBlob(blob) : download(blob, element)
    job.then(
      () => {
        setState("done")
        timer.current = setTimeout(() => setState("idle"), 1600)
      },
      (error: unknown) => {
        // A warning, not an error: a denied clipboard is expected, and the toast already says so.
        console.warn(error)
        setState("idle")
        blob.then(
          () => offerDownload("Couldn't copy the image", "Try Download instead.", () => download(blob, element)),
          () =>
            toast.error("Couldn't make the image", {
              description: "Part of this preview couldn't be drawn. Try again, or take a screenshot instead.",
            })
        )
      }
    )
  }

  return (
    <Menu onAction={(value) => run(String(value))}>
      <MenuTrigger
        ref={trigger}
        variant="plain"
        tone="neutral"
        size="sm"
        shape="circle"
        indicator={false}
        aria-label="Image"
        title="Image"
        aria-busy={state === "busy" || undefined}
        data-state={state}
        className={className}
        onPointerEnter={() => void preloadCapture()}
        onFocus={() => void preloadCapture()}
      >
        {state === "busy" ? (
          <ActivityIndicator size="sm" aria-hidden="true" />
        ) : state === "done" ? (
          <CheckIcon aria-hidden="true" />
        ) : (
          <ImageIcon aria-hidden="true" />
        )}
      </MenuTrigger>
      <MenuContent align="end">
        <MenuItem value="copy">
          <MenuItemIcon>
            <CopyIcon />
          </MenuItemIcon>
          Copy image
        </MenuItem>
        <MenuItem value="download">
          <MenuItemIcon>
            <DownloadIcon />
          </MenuItemIcon>
          Download image
        </MenuItem>
      </MenuContent>
    </Menu>
  )
}

function offerDownload(title: string, description: string, onDownload: () => void) {
  toast.error(title, { description, action: { label: "Download", onAction: onDownload } })
}

function slug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function pageSlug() {
  return window.location.pathname.split("/").filter(Boolean).pop() ?? "preview"
}

function stageRadius(element: Element | null) {
  return element ? parseFloat(getComputedStyle(element).borderTopLeftRadius) || 0 : 0
}

/** The image menu for a docs preview: captures the canvas under the stage's bar. */
function StageImageMenu({ platform }: { platform: Platform }) {
  return (
    <PreviewImageMenu
      capture={(trigger) => {
        const stage = trigger.closest(".docs-stage")
        const canvas = stage?.querySelector<HTMLElement>(".docs-stage-canvas")
        if (!canvas) return Promise.reject(new Error("No preview to capture"))
        return capturePreview(canvas, { radius: stageRadius(stage) })
      }}
      fileName={(trigger) => {
        const demo = trigger.closest<HTMLElement>("[data-demo]")?.dataset.demo
        return `macbetter-${slug(demo ?? pageSlug())}-${platform}.png`
      }}
    />
  )
}

/** The image menu for an example: the app on its wallpaper, cropped to the app, without the toolbar. */
function ExampleImageMenu({
  stage,
  platform,
}: {
  stage: React.RefObject<HTMLElement | null>
  platform: Platform
}) {
  return (
    <PreviewImageMenu
      capture={() => {
        const element = stage.current
        const page = element?.closest<HTMLElement>(".ex-page")
        if (!element || !page) return Promise.reject(new Error("No example to capture"))
        // Crop to what's on show (the window or the device), with some wallpaper around it.
        const content = element.firstElementChild?.getBoundingClientRect() ?? element.getBoundingClientRect()
        const margin = 40
        const bounds = page.getBoundingClientRect()
        const left = Math.max(bounds.left, content.left - margin)
        const top = Math.max(bounds.top, content.top - margin)
        const right = Math.min(bounds.right, content.right + margin)
        const bottom = Math.min(bounds.bottom, content.bottom + margin)
        return capturePreview(page, {
          crop: new DOMRect(left, top, right - left, bottom - top),
          radius: 28,
          exclude: [".ex-strip-row"],
        })
      }}
      fileName={() => `macbetter-${slug(pageSlug())}-${platform}.png`}
    />
  )
}

export { ExampleImageMenu, PreviewImageMenu, StageImageMenu }
export type { PreviewImageMenuProps }
