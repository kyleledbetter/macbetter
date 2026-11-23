"use client"

import { useEffect, type RefObject } from "react"

const sides = ["top", "right", "bottom", "left"] as const

let registered = false

/**
 * Registered so the iPhone sheets' slide in globals.css animates. An @property rule there would be
 * dropped by the docs' CSS build, as macbetter's own --mb-prompt-input-glow-angle is.
 */
function registerSlide() {
  if (registered) return
  registered = true
  try {
    CSS.registerProperty({ name: "--docs-slide", syntax: "<number>", inherits: false, initialValue: "0" })
  } catch {
    // Already registered, or unsupported: the sheet then appears without sliding.
  }
}

/**
 * Popups paint in the top layer, positioned against the browser window. While
 * one is open in a preview, this writes the preview's box on the stage as
 * --docs-canvas-* (the canvas, for scrims) and --docs-screen-* (the part of the
 * device column that's on screen, for the popup itself), as distances from the
 * window's edges, leaving out what's under the site header. globals.css lays modal surfaces out against them.
 */
function useStageScreen(stageRef: RefObject<HTMLElement | null>, canvasRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const stage = stageRef.current
    const canvas = canvasRef.current
    if (!stage || !canvas) return
    registerSlide()
    let frame = 0
    let tracking = false

    const set = (name: string, px: number) => stage.style.setProperty(`--docs-${name}`, `${Math.round(px * 100) / 100}px`)
    const write = () => {
      frame = 0
      const root = document.documentElement
      const viewWidth = root.clientWidth
      const viewHeight = root.clientHeight
      const box = canvas.getBoundingClientRect()
      const right = box.left + canvas.clientWidth
      const bottom = box.top + canvas.clientHeight
      const column = canvas.querySelector<HTMLElement>(".docs-stage-screen")?.getBoundingClientRect()
      // The site header is fixed over the page; what's under it isn't part of the preview you can see.
      const header = Math.max(0, document.querySelector(".docs-header")?.getBoundingClientRect().bottom ?? 0)
      const top = Math.max(box.top, header)
      const canvasBox = { top, right: viewWidth - right, bottom: viewHeight - bottom, left: box.left }
      const end = Math.min(bottom, viewHeight)
      const left = Math.max(column?.left ?? box.left, box.left)
      const edge = Math.min(column?.right ?? right, right)
      const screenBox = { top, right: viewWidth - edge, bottom: viewHeight - end, left }
      for (const side of sides) {
        set(`canvas-${side}`, canvasBox[side])
        set(`screen-${side}`, screenBox[side])
      }
      set("screen-width", Math.max(0, edge - left))
      set("screen-height", Math.max(0, end - top))
      stage.style.setProperty("--docs-stage-live", "1")
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(write)
    }
    // Only a canvas with something to scroll contains overscroll; on one that fits, the wheel scrolls the page.
    const measureOverflow = () => {
      const overflows = canvas.scrollHeight > canvas.clientHeight + 1 || canvas.scrollWidth > canvas.clientWidth + 1
      canvas.toggleAttribute("data-overflow", overflows)
    }
    const content = new ResizeObserver(measureOverflow)
    content.observe(canvas)
    const screen = canvas.querySelector(".docs-stage-screen")
    for (const element of [canvas.firstElementChild, screen, ...(screen?.children ?? [])]) {
      if (element) content.observe(element)
    }
    const resize = new ResizeObserver(schedule)
    const start = () => {
      if (tracking) return
      tracking = true
      resize.observe(canvas)
      window.addEventListener("scroll", schedule, { capture: true, passive: true })
      window.addEventListener("resize", schedule)
    }
    const stop = () => {
      if (!tracking) return
      tracking = false
      resize.disconnect()
      window.removeEventListener("scroll", schedule, { capture: true })
      window.removeEventListener("resize", schedule)
    }
    // beforetoggle doesn't bubble, so listen in the capture phase. Writing here, before the
    // popup shows, means its first frame is already in place.
    const beforeToggle = (event: Event) => {
      if ((event as ToggleEvent).newState !== "open") return
      write()
      start()
      // Opening a modal locks the page's scroll, which can move the preview by a scrollbar.
      schedule()
    }
    const toggle = (event: Event) => {
      if ((event as ToggleEvent).newState === "closed" && !stage.querySelector(":popover-open")) stop()
    }
    stage.addEventListener("beforetoggle", beforeToggle, true)
    stage.addEventListener("toggle", toggle, true)
    return () => {
      cancelAnimationFrame(frame)
      content.disconnect()
      stop()
      stage.removeEventListener("beforetoggle", beforeToggle, true)
      stage.removeEventListener("toggle", toggle, true)
    }
  }, [stageRef, canvasRef])
}

export { useStageScreen }
