import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { allDocSlugs } from "@/lib/docs"

export const dynamicParams = false

export function generateStaticParams() {
  return allDocSlugs().map((slug) => ({ slug }))
}

/** A page's MDX source, for "Copy page" and for agents that read the docs as text. */
export async function GET(_request: Request, { params }: RouteContext<"/docs/raw/[...slug]">) {
  const { slug } = await params
  if (!allDocSlugs().some((known) => known.join("/") === slug.join("/"))) {
    return new Response("Not found", { status: 404 })
  }
  const source = await readFile(join(process.cwd(), "src", "content", "docs", `${slug.join("/")}.mdx`), "utf8")
  return new Response(source, { headers: { "Content-Type": "text/markdown; charset=utf-8" } })
}
