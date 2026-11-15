"use client"

import { useEffect, useState } from "react"
import { ButtonLink } from "@/components/button-link"

type Section = { id: string; label: string }

/**
 * A local nav in the manner of apple.com's: links to the page's sections on the
 * leading side and a small pill on the trailing side. It sticks to the top once the global nav scrolls away, and marks
 * the section in view.
 */
function LocalNav({ sections, cta }: { sections: Section[]; cta: { href: string; label: string } }) {
  const [current, setCurrent] = useState<string | null>(null)

  useEffect(() => {
    const targets = sections
      .map((section) => document.getElementById(section.id))
      .filter((node): node is HTMLElement => Boolean(node))
    let frame = 0
    const update = () => {
      frame = 0
      const line = window.innerHeight * 0.4
      let active: string | null = null
      for (const target of targets) {
        if (target.getBoundingClientRect().top <= line) active = target.id
      }
      setCurrent(active)
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
  }, [sections])

  return (
    <nav aria-label="Local" className="local-nav" data-platform="macos">
      <div className="local-nav-inner">
        <ul className="local-nav-links">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={current === section.id ? "location" : undefined}
                className="local-nav-link"
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
        <ButtonLink href={cta.href} variant="filled" shape="capsule" size="sm" className="pill" data-pill="reduced">
          {cta.label}
        </ButtonLink>
      </div>
    </nav>
  )
}

export { LocalNav }
