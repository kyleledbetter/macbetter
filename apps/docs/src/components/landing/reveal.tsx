"use client"

import { useEffect } from "react"

/**
 * Fades sections in as they scroll into view. Content is visible until this
 * runs, so the page reads fine without JavaScript or with reduced motion.
 */
function Reveal() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const root = document.querySelector<HTMLElement>(".lp")
    if (!root) return
    const items = Array.from(root.querySelectorAll<HTMLElement>(".lp-reveal"))
    const below = items.filter((item) => item.getBoundingClientRect().top > window.innerHeight * 0.92)
    if (!below.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute("data-revealed", "")
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    )
    for (const item of below) {
      item.setAttribute("data-reveal", "")
      observer.observe(item)
    }
    return () => observer.disconnect()
  }, [])
  return null
}

export { Reveal }
