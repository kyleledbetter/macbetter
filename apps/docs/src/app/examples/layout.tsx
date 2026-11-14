import { SiteHeader } from "@/components/site-header"
import "./examples.css"

export default function ExamplesLayout({ children }: LayoutProps<"/examples">) {
  return (
    <>
      <SiteHeader />
      <main className="pt-(--docs-header-height)">{children}</main>
    </>
  )
}
