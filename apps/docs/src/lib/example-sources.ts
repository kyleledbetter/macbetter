import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { dirname, extname, join, relative, sep } from "node:path"
import { exampleSources, excludedSources, type ExampleSlug, type ExampleSourceManifest } from "@/components/examples/sources"
import { highlight } from "@/lib/highlight"
import { flatNav } from "@/lib/nav"

/** One file of an example's block, as the code view shows it. */
type SourceFile = {
  /** Relative to `src/`, like `components/examples/settings/settings.tsx`. Also the file's id in the URL. */
  path: string
  name: string
  lang: string
  code: string
  lines: number
  bytes: number
}

type UsedComponent = { name: string; title: string; href: string }

type ExampleSourceSet = {
  slug: ExampleSlug
  title: string
  entry: string
  files: SourceFile[]
  components: UsedComponent[]
  /** What the files take from the gallery's stage (`shell.tsx`), which isn't part of the block. */
  stageImports: string[]
  install: string
}

const SRC = join(process.cwd(), "src")
const EXAMPLES = join(SRC, "components", "examples")
const SOURCE_EXTENSIONS = [".tsx", ".ts", ".css"]
const RESOLVE_SUFFIXES = ["", ".tsx", ".ts", ".css", "/index.tsx", "/index.ts"]
const BASE_PACKAGES = ["@dreambase/stardust", "@ui-sdk/react", "@ui-sdk/core"]
/** Packages a Next.js React app already has, so they're left out of the install command. */
const PROVIDED_PACKAGES = new Set(["react", "react-dom", "next"])

const importPattern = /(?:^|\n)\s*(?:import|export)\s+(?:([^"';]*?)\s+from\s+)?["']([^"']+)["']/g

function importsOf(code: string) {
  return Array.from(code.matchAll(importPattern), (match) => ({
    specifier: match[2],
    names: (match[1]?.match(/\{([^}]*)\}/)?.[1] ?? "")
      .split(",")
      .map((name) => name.replace(/^\s*type\s+/, "").trim())
      .filter(Boolean),
  }))
}

function toPosix(path: string) {
  return path.split(sep).join("/")
}

function langOf(file: string) {
  const ext = extname(file).slice(1)
  return ext === "mjs" || ext === "js" ? "ts" : ext
}

function isExcluded(absolute: string) {
  const fromExamples = toPosix(relative(EXAMPLES, absolute))
  return absolute.includes(`${sep}node_modules${sep}`) || excludedSources.includes(fromExamples)
}

/** Resolves a local import (`./data`, `../rows`, `@/lib/x`) to a file on disk, or nothing for a package. */
function resolveLocal(specifier: string, fromFile: string) {
  let base: string
  if (specifier.startsWith("@/")) base = join(SRC, specifier.slice(2))
  else if (specifier.startsWith(".")) base = join(dirname(fromFile), specifier)
  else return undefined
  for (const suffix of RESOLVE_SUFFIXES) {
    const candidate = base + suffix
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate
  }
  throw new Error(`[examples] ${toPosix(relative(SRC, fromFile))} imports "${specifier}", which doesn't resolve to a file.`)
}

function packageOf(specifier: string) {
  const parts = specifier.split("/")
  return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0]
}

function listedFiles(slug: ExampleSlug) {
  const manifest: ExampleSourceManifest = exampleSources[slug]
  if (manifest.folder) {
    const folder = join(EXAMPLES, manifest.folder)
    if (!existsSync(folder)) throw new Error(`[examples] The ${slug} example's folder is missing: ${folder}`)
    return readdirSync(folder)
      .filter((name) => SOURCE_EXTENSIONS.includes(extname(name)) && !/\.(test|spec)\./.test(name))
      .map((name) => join(folder, name))
  }
  return (manifest.files ?? []).map((file) => {
    const absolute = join(EXAMPLES, file)
    if (!existsSync(absolute)) {
      throw new Error(`[examples] sources.ts lists ${file} for the ${slug} example, but it doesn't exist at ${absolute}.`)
    }
    return absolute
  })
}

const kindOrder = [".tsx", ".ts", ".css"]

/** The block's files: the entry first, then its folder, then what they import, each group tsx, ts, css. */
function orderFiles(files: SourceFile[], entry: string) {
  const own = `components/examples/${dirname(entry)}/`
  const rank = (file: SourceFile) =>
    file.path === `components/examples/${entry}` ? 0 : file.path.startsWith(own) ? 1 : 2
  return files.sort(
    (a, b) =>
      rank(a) - rank(b) ||
      kindOrder.indexOf(extname(a.path)) - kindOrder.indexOf(extname(b.path)) ||
      a.path.localeCompare(b.path)
  )
}

/** Reads an example's files from disk, following its local imports. Throws if anything listed is missing. */
function readExampleSources(slug: ExampleSlug): ExampleSourceSet {
  const manifest = exampleSources[slug]
  if (!manifest) throw new Error(`[examples] No source manifest for "${slug}" in components/examples/sources.ts.`)

  const queue = listedFiles(slug)
  const seen = new Set<string>()
  const files: SourceFile[] = []
  const stardust = new Set<string>()
  const packages = new Set<string>()
  const stageImports = new Set<string>()

  while (queue.length) {
    const absolute = queue.shift()!
    if (seen.has(absolute) || isExcluded(absolute)) continue
    seen.add(absolute)
    const code = readFileSync(absolute, "utf8")
    const path = toPosix(relative(SRC, absolute))
    files.push({
      path,
      name: path.split("/").pop()!,
      lang: langOf(absolute),
      code,
      lines: code.replace(/\n$/, "").split("\n").length,
      bytes: Buffer.byteLength(code),
    })
    for (const { specifier, names } of importsOf(code)) {
      const local = resolveLocal(specifier, absolute)
      if (local) {
        if (isExcluded(local)) names.forEach((name) => stageImports.add(name))
        else queue.push(local)
        continue
      }
      const name = packageOf(specifier)
      if (name === "@dreambase/stardust") {
        const component = specifier.split("/")[2]
        if (component) stardust.add(component)
      } else if (!name.startsWith("@ui-sdk/") && !PROVIDED_PACKAGES.has(name) && !specifier.startsWith("node:")) {
        packages.add(name)
      }
    }
  }

  const entryPath = `components/examples/${manifest.entry}`
  if (!files.some((file) => file.path === entryPath)) {
    throw new Error(`[examples] The ${slug} example's entry file ${manifest.entry} isn't in its block.`)
  }

  const pages = new Map(flatNav.map((item) => [item.href, item.title]))
  const components = [...stardust]
    .sort()
    .flatMap((name) => {
      const href = `/docs/components/${name}`
      const title = pages.get(href)
      return title ? [{ name, title, href }] : []
    })

  return {
    slug,
    title: manifest.title,
    entry: entryPath,
    files: orderFiles(files, manifest.entry),
    components,
    stageImports: [...stageImports].sort(),
    install: `pnpm add ${[...BASE_PACKAGES, ...[...packages].sort()].join(" ")}`,
  }
}

/** Highlights every file of an example, keyed by path. */
async function highlightExampleSources(slug: ExampleSlug) {
  const { files } = readExampleSources(slug)
  const entries = await Promise.all(files.map(async (file) => [file.path, await highlight(file.code, file.lang)] as const))
  return Object.fromEntries(entries) as Record<string, string>
}

export { highlightExampleSources, readExampleSources }
export type { ExampleSourceSet, SourceFile, UsedComponent }
