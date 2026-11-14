"use client"

import * as React from "react"
import type { ExampleSourceSet } from "@/lib/example-sources"

const SourceContext = React.createContext<ExampleSourceSet | null>(null)

function ExampleSourceProvider({ value, children }: { value: ExampleSourceSet; children: React.ReactNode }) {
  return <SourceContext.Provider value={value}>{children}</SourceContext.Provider>
}

/** The example's source files, when the page provides them. Thumbnails on the index don't. */
function useExampleSource() {
  return React.useContext(SourceContext)
}

export { ExampleSourceProvider, useExampleSource }
