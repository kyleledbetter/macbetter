import Link from "next/link"
import { DocsSearch } from "@/components/docs-search"
import { MacbetterLogo } from "@/components/logo"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { SchemeToggle, ThemeMenu } from "@/components/theme-controls"
import { publishedNav, searchIndex } from "@/lib/docs"

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.13v3.16c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  )
}

/**
 * The toolbar every page shares: identity and main navigation on the leading
 * side, search and appearance on the trailing side. Pages can put extra
 * controls before the logo with `children`.
 */
function SiteHeader({ children }: { children?: React.ReactNode }) {
  return (
    <header data-platform="macos" className="docs-header">
      <MobileNav sections={publishedNav()} />
      {children}
      <Link href="/" aria-label="Macbetter home" className="docs-header-home">
        <MacbetterLogo />
      </Link>
      <div className="hidden md:flex">
        <MainNav />
      </div>
      <div className="ms-auto flex items-center gap-1.5">
        <DocsSearch entries={searchIndex()} />
        <span aria-hidden="true" className="mx-1 hidden h-5 w-px bg-separator sm:block" />
        <ThemeMenu />
        <SchemeToggle />
        <a
          href="https://github.com/kyleledbetter/macbetter"
          target="_blank"
          rel="noreferrer"
          aria-label="Macbetter on GitHub"
          className="mb-button hidden sm:inline-flex"
          data-variant="plain"
          data-tone="neutral"
          data-size="md"
          data-shape="circle"
        >
          <GitHubIcon />
        </a>
      </div>
    </header>
  )
}

export { SiteHeader }
