import type { Metadata } from "next"
import Link from "next/link"
import { ComponentPreview } from "@/components/component-previews"
import { PageNavigation } from "@/components/page-navigation"
import { docExists, docInfo } from "@/lib/docs"
import { componentSections } from "@/lib/nav"
import { socialMetadata } from "@/lib/og/routes"

const description = "Every macbetter component, grouped the way the sidebar groups them. Each one adapts to macOS, iPadOS and iOS."

export const metadata: Metadata = {
  title: "Components",
  description,
  alternates: { canonical: "/docs/components" },
  ...socialMetadata({ path: "docs/components", title: "Components", description }),
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
    <article className="docs-index mx-auto w-full max-w-[1100px] px-5 pt-10 pb-24 md:px-10 md:pt-16">
      <header className="stack">
        <p className="stack-eyebrow docs-eyebrow">Components</p>
        <h1 className="stack-headline type-headline">
          Every control.
          <br />
          On every&nbsp;platform.
        </h1>
        <p className="stack-copy type-intro type-two-tone">
          {count} components for macOS, iPadOS and iOS. Each one is a ui-sdk part with Apple’s metrics, materials and
          motion, and <strong>changes its idiom with the platform it runs&nbsp;on.</strong>
        </p>
      </header>
      {sections.map((section) => (
        <section key={section.title} aria-labelledby={anchor(section.title)} className="site-index-section">
          <div className="site-index-section-header">
            <h2 id={anchor(section.title)} className="site-index-section-title type-card">
              <a href={`#${anchor(section.title)}`} className="docs-anchor">
                {section.title}
              </a>
            </h2>
          </div>
          <ul className="site-index-grid">
            {section.items.map((item) => (
              <li key={item.href} className="m-0">
                <Link href={item.href} className="docs-component-card h-full">
                  <div className="docs-component-preview" aria-hidden="true">
                    <div className="docs-grid absolute inset-0" />
                    <ComponentPreview slug={item.slug} />
                  </div>
                  <div className="docs-component-body">
                    <span className="docs-component-name">{item.title}</span>
                    {item.description ? <span className="docs-component-text">{item.description}</span> : null}
                    <span className="docs-component-more more-link" aria-hidden="true">
                      Learn more
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <div className="docs-prose">
        <PageNavigation href="/docs/components" />
      </div>
    </article>
  )
}
