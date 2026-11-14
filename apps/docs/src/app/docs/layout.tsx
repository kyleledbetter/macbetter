import { DocsSidebar } from "@/components/docs-sidebar"
import { SiteHeader } from "@/components/site-header"
import { TableOfContents } from "@/components/toc"
import { publishedNav } from "@/lib/docs"

export default function DocsLayout({ children }: LayoutProps<"/docs">) {
  return (
    <>
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-[1440px] pt-(--docs-header-height)">
        <aside
          data-docs-scroller=""
          className="docs-sidebar-pane sticky top-(--docs-header-height) hidden h-[calc(100dvh-var(--docs-header-height))] w-(--docs-sidebar-width) flex-none overflow-y-auto overscroll-contain lg:block"
        >
          <DocsSidebar sections={publishedNav()} />
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
        <aside className="sticky top-(--docs-header-height) hidden h-[calc(100dvh-var(--docs-header-height))] w-[232px] flex-none overflow-y-auto px-6 py-14 xl:block">
          <TableOfContents />
        </aside>
      </div>
    </>
  )
}
