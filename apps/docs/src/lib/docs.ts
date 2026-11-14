import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"
import { flatNav, nav, type NavSection } from "@/lib/nav"

const root = join(process.cwd(), "src", "content", "docs")

/** Pages that are routes of their own rather than MDX files. */
const staticDocPages = new Set(["/docs/components"])

function walk(dir: string, prefix: string[] = []): string[][] {
  if (!existsSync(dir)) return []
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) return walk(path, [...prefix, entry])
    return entry.endsWith(".mdx") ? [[...prefix, entry.replace(/\.mdx$/, "")]] : []
  })
}

const allDocSlugs = () => walk(root)

function docExists(href: string) {
  if (staticDocPages.has(href)) return true
  return existsSync(join(root, `${href.replace(/^\/docs\//, "")}.mdx`))
}

/** The sidebar, without items whose page hasn't been written. */
function publishedNav(): NavSection[] {
  return nav
    .map((section) => ({ ...section, items: section.items.filter((item) => docExists(item.href)) }))
    .filter((section) => section.items.length > 0)
}

type DocHeading = { id: string; text: string }
type DocInfo = { title?: string; description?: string; headings: DocHeading[] }

function readString(source: string, key: string) {
  const match = source.match(new RegExp(`\\b${key}:\\s*(["'\`])((?:\\\\.|(?!\\1)[^\\\\])*)\\1`))
  return match?.[2]?.replace(/\\(.)/g, "$1")
}

function plainText(markdown: string) {
  return markdown
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[`*_]/g, "")
    .replace(/<[^>]+>/g, "")
    .trim()
}

/** The id rehype-slug gives a heading (GitHub's algorithm). */
function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\p{M}\s_-]/gu, "")
    .replace(/\s/g, "-")
}

const infoCache = new Map<string, DocInfo>()

/** Title, description and `##` headings of an MDX page, read from the file. */
function docInfo(slug: string): DocInfo {
  const cached = infoCache.get(slug)
  if (cached && process.env.NODE_ENV === "production") return cached
  const path = join(root, `${slug}.mdx`)
  if (!existsSync(path)) return { headings: [] }
  const source = readFileSync(path, "utf8")
  const metadata = source.match(/export const metadata\s*=\s*\{([\s\S]*?)\n?\}/)?.[1] ?? ""
  const headings: DocHeading[] = []
  const seen = new Map<string, number>()
  let fenced = false
  for (const line of source.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) fenced = !fenced
    if (fenced) continue
    const match = line.match(/^(#{1,3})\s+(.+?)\s*#*\s*$/)
    if (!match) continue
    const text = plainText(match[2]!)
    const base = slugify(text)
    const count = seen.get(base) ?? 0
    seen.set(base, count + 1)
    if (match[1] === "##") headings.push({ id: count ? `${base}-${count}` : base, text })
  }
  const info = { title: readString(metadata, "title"), description: readString(metadata, "description"), headings }
  infoCache.set(slug, info)
  return info
}

type SearchEntry = {
  href: string
  title: string
  section: string
  description?: string
  headings: DocHeading[]
}

/** Every published page in nav order, for the command palette. */
function searchIndex(): SearchEntry[] {
  return flatNav
    .filter((item) => docExists(item.href))
    .map((item) => {
      const slug = item.href.replace(/^\/docs\//, "")
      const info = docInfo(slug)
      if (staticDocPages.has(item.href)) {
        return {
          href: item.href,
          title: item.title,
          section: item.section,
          description: "Every component, grouped the way the sidebar groups them.",
          headings: [],
        }
      }
      return {
        href: item.href,
        title: item.title,
        section: item.section,
        description: info.description,
        headings: info.headings,
      }
    })
}

export { allDocSlugs, docExists, docInfo, publishedNav, searchIndex }
export type { DocHeading, DocInfo, SearchEntry }
