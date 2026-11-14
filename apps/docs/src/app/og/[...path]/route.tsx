import { notFound } from "next/navigation"
import { renderCard } from "@/lib/og/card"
import { ogCard, ogPaths } from "@/lib/og/routes"

// One social card per page, rendered at build time. The home page's card is app/opengraph-image.
export const dynamicParams = false

export function generateStaticParams() {
  return ogPaths()
    .filter(Boolean)
    .map((path) => ({ path: path.split("/") }))
}

export async function GET(_request: Request, { params }: RouteContext<"/og/[...path]">) {
  const { path } = await params
  const card = ogCard(path.join("/"))
  if (!card) notFound()
  return renderCard(path.join("/"), card)
}
