import Link from "next/link"
import { docExists } from "@/lib/docs"
import { flatNav } from "@/lib/nav"

/** Previous and next pages, in sidebar order, skipping any that aren't written yet. */
function PageNavigation({ href }: { href: string }) {
  const pages = flatNav.filter((item) => docExists(item.href))
  const index = pages.findIndex((item) => item.href === href)
  if (index < 0) return null
  const previous = pages[index - 1]
  const next = pages[index + 1]

  return (
    <nav aria-label="Pagination" className="not-prose mt-8 grid gap-6 border-t border-(--site-hairline) pt-6 sm:grid-cols-2">
      {previous ? (
        <Link href={previous.href} className="docs-pager" data-direction="back" aria-keyshortcuts="ArrowLeft">
          <span className="docs-pager-hint">
            Previous <kbd aria-hidden="true">←</kbd>
          </span>
          <span className="docs-pager-title">{previous.title}</span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}
      {next ? (
        <Link href={next.href} className="docs-pager items-end text-end" aria-keyshortcuts="ArrowRight">
          <span className="docs-pager-hint">
            Next <kbd aria-hidden="true">→</kbd>
          </span>
          <span className="docs-pager-title">{next.title}</span>
        </Link>
      ) : null}
    </nav>
  )
}

export { PageNavigation }
