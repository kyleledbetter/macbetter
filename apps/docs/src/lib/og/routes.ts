import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import type { Metadata } from "next"
import { allDocSlugs, docInfo } from "@/lib/docs"
import { flatNav } from "@/lib/nav"

/** What a page's social card says. */
type OgCard = { title: string; eyebrow: string; description?: string }

const tagline = "macOS, iPadOS and iOS. One web framework."
const app = () => join(process.cwd(), "src", "app")

function readString(source: string, key: string) {
  // `title: "…"` in the metadata object, or `const description =\n  "…"` above it.
  return source.match(new RegExp(`\\b${key}(?::|\\s*=)\\s*"((?:\\\\.|[^"\\\\])*)"`))?.[1]?.replace(/\\(.)/g, "$1")
}

/** The example routes, like `mail`, with the title and description their page exports. */
function examples() {
  const dir = join(app(), "examples")
  return readdirSync(dir)
    .filter((entry) => existsSync(join(dir, entry, "page.tsx")))
    .map((slug) => {
      const source = readFileSync(join(dir, slug, "page.tsx"), "utf8")
      return { slug, title: readString(source, "title"), description: readString(source, "description") }
    })
}

/** Every path that gets a card, without the leading slash; the home page is "". */
function ogPaths(): string[] {
  return [
    "",
    "themes",
    "examples",
    ...examples().map((example) => `examples/${example.slug}`),
    "docs/components",
    ...allDocSlugs().map((slug) => `docs/${slug.join("/")}`),
  ]
}

function ogCard(path: string): OgCard | null {
  if (path === "") return { title: tagline, eyebrow: "macbetter" }
  if (path === "themes") {
    return { title: "Theme Studio", eyebrow: "Themes", description: "Your brand’s colors on macOS, iPadOS and iOS." }
  }
  if (path === "examples") {
    return { title: "Built with macbetter", eyebrow: "Examples", description: "Settings, Mail, Analytics, Music, Home and AI Assistant." }
  }
  if (path.startsWith("examples/")) {
    const example = examples().find((entry) => `examples/${entry.slug}` === path)
    if (!example?.title) return null
    return { title: example.title.replace(/ example$/i, ""), eyebrow: "Examples", description: example.description }
  }
  if (path === "docs/components") {
    return { title: "Components", eyebrow: "Docs", description: "Every control, for macOS, iPadOS and iOS." }
  }
  if (path.startsWith("docs/")) {
    const slug = path.slice("docs/".length)
    if (!allDocSlugs().some((known) => known.join("/") === slug)) return null
    const info = docInfo(slug)
    const section = flatNav.find((item) => item.href === `/${path}`)?.section
    const title = info.title ?? slug
    return { title, eyebrow: section && section !== title ? section : "Docs", description: info.description }
  }
  return null
}

const ogSize = { width: 1200, height: 630 }

/** The URL of a page's card: the home page uses the root opengraph-image, the rest /og/…. */
const ogImageUrl = (path: string) => (path === "" ? "/opengraph-image" : `/og/${path}`)

/**
 * openGraph and twitter metadata that point at the page's own card. A page's `openGraph`
 * replaces its parent's entirely, so this restates the site fields too.
 */
function socialMetadata({
  path,
  title,
  description,
  type = "website",
}: {
  path: string
  title?: string
  description?: string
  type?: "website" | "article"
}): Pick<Metadata, "openGraph" | "twitter"> {
  const card = ogCard(path)
  const image = {
    url: ogImageUrl(path),
    ...ogSize,
    alt: !card ? "macbetter" : path === "" ? `macbetter — ${card.title}` : `${card.title} · macbetter`,
    type: "image/png",
  }
  const fullTitle = title ? `${title} · macbetter` : undefined
  return {
    openGraph: {
      title: fullTitle,
      description,
      url: `/${path}`,
      siteName: "macbetter",
      locale: "en_US",
      type,
      images: [image],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [image] },
  }
}

export { ogCard, ogImageUrl, ogPaths, ogSize, socialMetadata, tagline }
export type { OgCard }
