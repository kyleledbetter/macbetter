import type * as React from "react"
import { readExampleSources } from "@/lib/example-sources"
import { ExampleSourceProvider } from "./source-context"
import type { ExampleSlug } from "./sources"

/** Reads an example's files on the server and hands them to the shell's code view. */
function ExampleSource({ slug, children }: { slug: ExampleSlug; children: React.ReactNode }) {
  return <ExampleSourceProvider value={readExampleSources(slug)}>{children}</ExampleSourceProvider>
}

export { ExampleSource }
