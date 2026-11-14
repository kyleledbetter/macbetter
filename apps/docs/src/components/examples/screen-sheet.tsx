"use client"

import { Sheet, SheetContent, SheetTitle } from "@dreambase/stardust/sheet"
import * as React from "react"
import { useStage } from "./shell"

type ScreenSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Names the sheet for assistive technology. */
  title: string
  /** Shows the title as a visible heading. Leave it off when the content has its own. */
  hideTitle?: boolean
  className?: string
  children: React.ReactNode
}

/**
 * A full-height iOS sheet. On a phone it's Stardust's Sheet. Inside a device
 * frame it's drawn in the frame's screen instead, because a Sheet lives in the
 * browser's top layer and would cover the whole page rather than the phone.
 */
function ScreenSheet({ open, onOpenChange, title, hideTitle = true, className, children }: ScreenSheetProps) {
  const { frameless } = useStage()
  if (frameless) {
    return (
      <Sheet open={open} onOpenChange={(next) => onOpenChange(next)} detents={["large"]}>
        <SheetContent className={["ex-sheet", className].filter(Boolean).join(" ")}>
          <SheetTitle className={hideTitle ? "sd-visually-hidden" : undefined}>{title}</SheetTitle>
          {children}
        </SheetContent>
      </Sheet>
    )
  }
  return (
    <FramedSheet open={open} onOpenChange={onOpenChange} title={title} hideTitle={hideTitle} className={className}>
      {children}
    </FramedSheet>
  )
}

function FramedSheet({ open, onOpenChange, title, hideTitle, className, children }: ScreenSheetProps) {
  const panelRef = React.useRef<HTMLDivElement>(null)
  const returnRef = React.useRef<HTMLElement | null>(null)
  const [mounted, setMounted] = React.useState(open)
  const titleId = React.useId()

  React.useEffect(() => {
    if (open) {
      returnRef.current = document.activeElement as HTMLElement | null
      setMounted(true)
      return
    }
    const timer = window.setTimeout(() => setMounted(false), 260)
    return () => window.clearTimeout(timer)
  }, [open])

  React.useEffect(() => {
    if (!open || !mounted) return
    const panel = panelRef.current
    const first = panel?.querySelector<HTMLElement>("button, [href], input, textarea, [tabindex]:not([tabindex='-1'])")
    ;(first ?? panel)?.focus({ preventScroll: true })
    return () => returnRef.current?.focus({ preventScroll: true })
  }, [open, mounted])

  if (!mounted) return null

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.stopPropagation()
      onOpenChange(false)
      return
    }
    if (event.key !== "Tab") return
    const items = Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>(
        "button:not([disabled]), [href], input, textarea, [tabindex]:not([tabindex='-1'])"
      ) ?? []
    ).filter((el) => el.offsetParent !== null)
    if (!items.length) return
    const first = items[0]
    const last = items[items.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <div className="ex-framed-sheet-layer" data-open={open ? "" : undefined}>
      <div className="ex-framed-sheet-backdrop" onClick={() => onOpenChange(false)} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={onKeyDown}
        className={["ex-framed-sheet", "ex-sheet", className].filter(Boolean).join(" ")}
      >
        <span aria-hidden="true" className="ex-framed-sheet-grabber" />
        <h2 id={titleId} className={hideTitle ? "sd-visually-hidden" : "ex-framed-sheet-title"}>
          {title}
        </h2>
        {children}
      </div>
    </div>
  )
}

export { ScreenSheet }
