import { readFileSync } from "node:fs"
import { join } from "node:path"
import { CodeBlock } from "@/components/code-block"

/** Shows a file from the docs app's source, so a page can't drift from the code it describes. */
async function SourceFile({ path, title }: { path: string; title?: string }) {
  const code = readFileSync(join(process.cwd(), "src", path), "utf8")
  return <CodeBlock code={code} lang="tsx" title={title ?? path.split("/").pop()} />
}

export { SourceFile }
