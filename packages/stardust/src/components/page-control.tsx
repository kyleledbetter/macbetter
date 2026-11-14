import { Pagination, PaginationItem, PaginationLink, PaginationList } from "@ui-sdk/react/pagination"
import type * as React from "react"
import { cx } from "../lib/cx"

type PageControlProps = Omit<React.ComponentProps<typeof Pagination>, "children" | "pageCount"> & {
  pageCount: number
  /** `glass` sets the dots on a capsule of glass, for busy backgrounds. */
  variant?: "plain" | "glass"
}

function PageControl({ pageCount, variant = "plain", className, ...props }: PageControlProps) {
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1)
  return (
    <Pagination
      pageCount={pageCount}
      siblings={pageCount}
      boundaries={pageCount}
      data-variant={variant}
      className={cx("sd-page-control", className)}
      {...props}
    >
      <PaginationList className="sd-page-control-list">
        {pages.map((page) => (
          <PaginationItem key={page} className="sd-page-control-item">
            <PaginationLink page={page} aria-label={`Page ${page} of ${pageCount}`} className="sd-page-control-dot">
              <span aria-hidden="true" className="sd-page-control-dot-mark" />
            </PaginationLink>
          </PaginationItem>
        ))}
      </PaginationList>
    </Pagination>
  )
}

export { PageControl }
export type { PageControlProps }
