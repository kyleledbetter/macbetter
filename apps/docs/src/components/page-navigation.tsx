import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
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
    <nav aria-label="Pagination" className="not-prose mt-6 grid gap-3 border-t border-separator pt-6 sm:grid-cols-2">
      {previous ? (
        <Link href={previous.href} className="docs-pager">
          <span className="docs-pager-hint">
            <ChevronLeftIcon aria-hidden="true" className="size-3.5" /> Previous
          </span>
          <span className="docs-pager-title">{previous.title}</span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}
      {next ? (
        <Link href={next.href} className="docs-pager items-end text-end">
          <span className="docs-pager-hint">
            Next <ChevronRightIcon aria-hidden="true" className="size-3.5" />
          </span>
          <span className="docs-pager-title">{next.title}</span>
        </Link>
      ) : null}
    </nav>
  )
}

export { PageNavigation }
