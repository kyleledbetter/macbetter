import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SquarePenIcon } from "lucide-react"
import { PageNavigation } from "@/components/page-navigation"
import { CopyPageButton } from "@/components/page-actions"
import { allDocSlugs } from "@/lib/docs"
import { flatNav } from "@/lib/nav"
import { socialMetadata } from "@/lib/og/routes"

type DocModule = {
  default: React.ComponentType
  metadata?: { title?: string; description?: string }
}

const repo = "https://github.com/kyleledbetter/macbetter"

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
    ...socialMetadata({ path: `docs/${slug.join("/")}`, title, description, type: "article" }),
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
    <article className="docs-prose mx-auto w-full max-w-[820px] px-5 pt-10 pb-24 md:px-10 md:pt-16">
      <div className="not-prose flex min-h-7 items-center justify-between gap-3">
        {item ? <p className="docs-eyebrow">{item.section}</p> : <span />}
        <div className="flex items-center gap-2" data-platform="macos">
          <CopyPageButton slug={path} />
        </div>
      </div>
      <Content />
      <div className="not-prose mt-20 flex flex-wrap items-center justify-between gap-3">
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
