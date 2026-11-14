"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

type Heading = { id: string; text: string; level: number }

function TableOfContents() {
  const pathname = usePathname()
  const [headings, setHeadings] = useState<Heading[]>([])
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("article :is(h2, h3)[id]")).filter(
      (node) => !node.closest(".not-prose")
    )
    setHeadings(
      nodes.map((node) => ({ id: node.id, text: node.textContent ?? "", level: node.tagName === "H2" ? 2 : 3 }))
    )

    // The current heading is the last one that has scrolled past the top third of
    // the window; at the very bottom it's the last one, however short its section.
    let frame = 0
    const update = () => {
      frame = 0
      const line = window.innerHeight * 0.3
      let current = nodes[0]?.id ?? null
      for (const node of nodes) {
        if (node.getBoundingClientRect().top <= line) current = node.id
        else break
      }
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      if (atBottom && nodes.length) current = nodes[nodes.length - 1]!.id
      setActive(current)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [pathname])

  if (headings.length < 2) return null

  return (
    <nav aria-label="On this page" className="text-[13px]">
      <h2 className="mb-2.5 text-[12px] font-semibold text-label">On this page</h2>
      <ul className="flex flex-col border-s border-separator">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              aria-current={active === heading.id ? "location" : undefined}
              className={`-ms-px block border-s-2 border-transparent py-[5px] leading-[1.35] text-label-secondary transition-colors hover:text-label aria-[current=location]:border-accent aria-[current=location]:font-medium aria-[current=location]:text-label ${heading.level === 3 ? "ps-6 text-[12.5px]" : "ps-3"}`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export { TableOfContents }
