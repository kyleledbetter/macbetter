import { readFileSync } from "node:fs"
import { join } from "node:path"
import type { Platform } from "macbetter"
import { CodeBlock } from "@/components/code-block"
import { Stage } from "@/components/stage"

type DemoProps = {
  /** Path under src/demos, without the extension: "button/variants". */
  name: string
  platforms?: Platform[]
  wallpaper?: boolean
  fill?: boolean
  height?: number
  bare?: boolean
  /** Hides the source, for demos that only illustrate. */
  hideCode?: boolean
}

function sourceOf(name: string) {
  const source = readFileSync(join(process.cwd(), "src", "demos", `${name}.tsx`), "utf8")
  return source.replace(/^"use client"\n\n?/, "")
}

async function Demo({ name, hideCode, ...stage }: DemoProps) {
  const { default: Example } = await import(`@/demos/${name}.tsx`)
  return (
    <div className="my-6">
      <Stage {...stage}>
        <Example />
      </Stage>
      {hideCode ? null : <CodeBlock code={sourceOf(name)} lang="tsx" />}
    </div>
  )
}

export { Demo }
