import { exampleSources, type ExampleSlug } from "@/components/examples/sources"
import { highlightExampleSources } from "@/lib/example-sources"

// The highlighted source is fetched when the code view opens, so it stays out of the live example's payload.
export const dynamicParams = false

export function generateStaticParams() {
  return Object.keys(exampleSources).map((slug) => ({ slug }))
}

export async function GET(_request: Request, { params }: RouteContext<"/examples/source/[slug]">) {
  const { slug } = await params
  return Response.json(await highlightExampleSources(slug as ExampleSlug))
}
