import type { Metadata } from "next"
import Link from "next/link"
import { ComponentPreview } from "@/components/component-previews"
import { PageNavigation } from "@/components/page-navigation"
import { docExists, docInfo } from "@/lib/docs"
import { componentSections } from "@/lib/nav"

const description = "Every Stardust component, grouped the way the sidebar groups them. Each one adapts to macOS, iPadOS and iOS."

export const metadata: Metadata = {
  title: "Components",
  description,
  alternates: { canonical: "/docs/components" },
}

const anchor = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-")

export default function ComponentsIndex() {
  const sections = componentSections
    .map((section) => ({
      ...section,
      items: section.items
        .filter((item) => item.href.startsWith("/docs/components/") && docExists(item.href))
        .map((item) => {
          const slug = item.href.replace("/docs/components/", "")
          return { ...item, slug, description: docInfo(`components/${slug}`).description }
        }),
    }))
    .filter((section) => section.items.length)
  const count = sections.reduce((sum, section) => sum + section.items.length, 0)

  return (
    <article className="docs-prose mx-auto w-full max-w-[1040px] px-5 pt-8 pb-24 md:px-10 md:pt-12">
      <p className="mb-3 text-[13px] font-semibold tracking-[-0.01em] text-accent-text">Components</p>
      <h1>Components</h1>
      <p className="docs-lead">
        {count} components for macOS, iPadOS and iOS. Each one is a ui-sdk part with Apple’s metrics, materials and
        motion, and changes its idiom with the platform it runs on.
      </p>
      {sections.map((section) => (
        <section key={section.title} aria-labelledby={anchor(section.title)}>
          <h2 id={anchor(section.title)}>
            <a href={`#${anchor(section.title)}`} className="docs-anchor">
              {section.title}
            </a>
          </h2>
          <ul className="not-prose mt-4 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {section.items.map((item) => (
              <li key={item.href} className="m-0">
                <Link href={item.href} className="docs-component-card h-full">
                  <div className="docs-component-preview" aria-hidden="true">
                    <div className="docs-grid absolute inset-0" />
                    <ComponentPreview slug={item.slug} />
                  </div>
                  <div className="flex flex-col gap-1 px-4 pt-3 pb-4">
                    <span className="text-[15px] font-semibold tracking-[-0.01em] text-label">{item.title}</span>
                    {item.description ? (
                      <span className="text-[13px] leading-[1.45] text-label-secondary">{item.description}</span>
                    ) : null}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <PageNavigation href="/docs/components" />
    </article>
  )
}
