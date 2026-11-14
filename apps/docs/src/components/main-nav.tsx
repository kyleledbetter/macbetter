"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const links = [
  { href: "/docs/introduction", label: "Docs", match: (path: string) => path.startsWith("/docs") && !isComponents(path) },
  { href: "/docs/components", label: "Components", match: (path: string) => isComponents(path) },
  { href: "/themes", label: "Themes", match: (path: string) => path.startsWith("/themes") },
  { href: "/examples", label: "Examples", match: (path: string) => path.startsWith("/examples") },
]

function isComponents(path: string) {
  return path === "/docs/components" || path.startsWith("/docs/components/")
}

type MainNavProps = {
  orientation?: "horizontal" | "vertical"
  onNavigate?: () => void
}

function MainNav({ orientation = "horizontal", onNavigate }: MainNavProps) {
  const pathname = usePathname() ?? "/"
  return (
    <nav aria-label="Main" data-orientation={orientation} className="docs-main-nav">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={link.match(pathname) ? "page" : undefined}
          onClick={onNavigate}
          className="docs-main-nav-link"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}

export { MainNav }
