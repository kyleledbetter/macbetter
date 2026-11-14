import { existsSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"
import type { MetadataRoute } from "next"
import { allDocSlugs } from "@/lib/docs"

const base = "https://stardust.dreambase.ai"

/** Static routes under a folder, like /examples/finder. Dynamic segments are skipped. */
function routesUnder(app: string, folder: string): string[] {
  const dir = join(app, folder)
  if (!existsSync(dir)) return []
  const here = existsSync(join(dir, "page.tsx")) ? [`/${folder}`] : []
  const nested = readdirSync(dir)
    .filter((entry) => !entry.startsWith("[") && !entry.startsWith("_") && statSync(join(dir, entry)).isDirectory())
    .flatMap((entry) => routesUnder(app, `${folder}/${entry}`))
  return [...here, ...nested].map((path) => path.replace(/\/\([^)]+\)/g, ""))
}

export default function sitemap(): MetadataRoute.Sitemap {
  const app = join(process.cwd(), "src", "app")
  const top = ["", ...routesUnder(app, "themes"), ...routesUnder(app, "examples")]
  return [
    ...top.map((path) => ({ url: `${base}${path}`, changeFrequency: "weekly" as const, priority: path ? 0.8 : 1 })),
    { url: `${base}/docs/components`, changeFrequency: "weekly" as const, priority: 0.9 },
    ...allDocSlugs().map((slug) => ({
      url: `${base}/docs/${slug.join("/")}`,
      changeFrequency: "weekly" as const,
      priority: slug[0] === "components" ? 0.7 : 0.8,
    })),
  ]
}
