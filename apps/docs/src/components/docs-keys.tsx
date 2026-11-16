"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef } from "react"

// Controls that use the arrow keys themselves: fields, sliders, segmented controls, tabs, menus.
const interactive =
  'input, textarea, select, button, summary, video, audio, [contenteditable]:not([contenteditable="false"]), [role]:not(a, nav, main, article, section, [role="presentation"], [role="none"]), [tabindex="0"]:not(a)'

/** Left and right arrows move to the previous and next page, in sidebar order. */
function DocsKeys({ pages }: { pages: string[] }) {
  const pathname = usePathname()
  const router = useRouter()

  // Where the reader is headed: set on the key press, so a second press doesn't wait for the page to arrive.
  const at = useRef(pathname)

  useEffect(() => {
    at.current = pathname
    const index = pages.indexOf(pathname)
    for (const href of [pages[index - 1], pages[index + 1]]) {
      if (index >= 0 && href) router.prefetch(href)
    }
  }, [pages, pathname, router])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
      const target = event.target instanceof Element ? event.target : null
      if (target?.closest(interactive) && !target.closest(".docs-sidebar")) return
      if (document.querySelector(":modal")) return
      const index = pages.indexOf(at.current)
      const href = index < 0 ? undefined : pages[index + (event.key === "ArrowLeft" ? -1 : 1)]
      if (!href) return
      event.preventDefault()
      at.current = href
      router.push(href)
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [pages, router])

  return null
}

export { DocsKeys }
