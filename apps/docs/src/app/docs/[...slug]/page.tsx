import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SquarePenIcon } from "lucide-react"
import { PageNavigation } from "@/components/page-navigation"
import { CopyPageButton } from "@/components/page-actions"
import { allDocSlugs } from "@/lib/docs"
import { flatNav } from "@/lib/nav"

type DocModule = {
  default: React.ComponentType
  metadata?: { title?: string; description?: string }
}

const repo = "https://github.com/DreambaseAI/stardust"

async function load(slug: string[]): Promise<DocModule | null> {
  if (!allDocSlugs().some((known) => known.join("/") === slug.join("/"))) return null
  return import(`@/content/docs/${slug.join("/")}.mdx`)
}

export function generateStaticParams() {
  return allDocSlugs().map((slug) => ({ slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: PageProps<"/docs/[...slug]">): Promise<Metadata> {
  const { slug } = await params
  const doc = await load(slug)
  const title = doc?.metadata?.title
  const description = doc?.metadata?.description
  return {
    title,
    description,
    alternates: { canonical: `/docs/${slug.join("/")}` },
    // A page's own openGraph replaces the root one, so it names the shared image again.
    openGraph: {
      title: title ? `${title} · Stardust` : undefined,
      description,
      url: `/docs/${slug.join("/")}`,
      siteName: "Stardust",
      type: "article",
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Stardust — macOS, iPadOS and iOS for the web" }],
    },
  }
}

export default async function DocPage({ params }: PageProps<"/docs/[...slug]">) {
  const { slug } = await params
  const doc = await load(slug)
  if (!doc) notFound()
  const Content = doc.default
  const path = slug.join("/")
  const href = `/docs/${path}`
  const item = flatNav.find((entry) => entry.href === href)

  return (
    <article className="docs-prose mx-auto w-full max-w-[820px] px-5 pt-8 pb-24 md:px-10 md:pt-12">
      <div className="not-prose mb-3 flex min-h-7 items-center justify-between gap-3">
        {item ? (
          <p className="text-[13px] font-semibold tracking-[-0.01em] text-accent-text">{item.section}</p>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-2" data-platform="macos">
          <CopyPageButton slug={path} />
        </div>
      </div>
      <Content />
      <div className="not-prose mt-16 flex flex-wrap items-center justify-between gap-3 text-[13px]">
        <a
          href={`${repo}/edit/main/apps/docs/src/content/docs/${path}.mdx`}
          target="_blank"
          rel="noreferrer"
          className="docs-quiet-link"
        >
          <SquarePenIcon aria-hidden="true" className="size-3.5" />
          Edit this page on GitHub
        </a>
        <a
          href={`${repo}/blob/main/apps/docs/src/content/docs/${path}.mdx?plain=1`}
          target="_blank"
          rel="noreferrer"
          className="docs-quiet-link"
        >
          View source
        </a>
      </div>
      <PageNavigation href={href} />
    </article>
  )
}
