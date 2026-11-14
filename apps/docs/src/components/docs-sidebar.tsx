"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import type { NavSection } from "@/lib/nav"

type DocsSidebarProps = {
  sections: NavSection[]
  /** Runs when a link is chosen, so a drawer can close even on the current page. */
  onNavigate?: () => void
}

function DocsSidebar({ sections, onNavigate }: DocsSidebarProps) {
  const pathname = usePathname()
  const ref = useRef<HTMLElement>(null)

  // Bring the current page into view inside the sidebar's own scroller, never the window.
  useEffect(() => {
    const current = ref.current?.querySelector<HTMLElement>("[aria-current=page]")
    const scroller = ref.current?.closest<HTMLElement>("[data-docs-scroller]")
    if (!current || !scroller) return
    const top = current.getBoundingClientRect().top - scroller.getBoundingClientRect().top
    if (top < 48 || top > scroller.clientHeight - 48) {
      scroller.scrollTop += top - scroller.clientHeight / 2 + current.offsetHeight / 2
    }
  }, [pathname])

  return (
    <nav ref={ref} aria-label="Documentation" className="docs-sidebar flex flex-col gap-6 px-3 pt-6 pb-10">
      {sections.map((section) => (
        <section key={section.title} aria-labelledby={`nav-${slug(section.title)}`}>
          <h2
            id={`nav-${slug(section.title)}`}
            className="docs-sidebar-heading"
          >
            {section.title}
          </h2>
          <ul className="flex flex-col gap-px">
            {section.items.map((item) => {
              const current = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    onClick={onNavigate}
                    className="docs-sidebar-link"
                  >
                    {item.title}
                    {item.badge ? <span className="docs-sidebar-badge">{item.badge}</span> : null}
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </nav>
  )
}

const slug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-")

export { DocsSidebar }
