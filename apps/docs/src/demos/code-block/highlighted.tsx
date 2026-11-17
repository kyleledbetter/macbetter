import { CodeBlock, CodeBlockContent, CodeBlockCopy, CodeBlockHeader, CodeBlockTitle } from "macbetter/code-block"
import { codeToHtml } from "shiki"

const source = `import { readFile } from "node:fs/promises"

export async function loadVisitors(path: string) {
  const rows = (await readFile(path, "utf8")).trim().split("\\n").slice(1)
  return rows.map((row) => {
    const [date, count] = row.split(",")
    return { date, count: Number(count) }
  })
}
`

// Any highlighter works. This one runs on the server, so the page ships no highlighter.
export default async function Example() {
  const html = await codeToHtml(source.trimEnd(), {
    lang: "ts",
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: "light-dark()",
  })
  return (
    <CodeBlock lineNumbers style={{ width: "100%", maxWidth: 600 }}>
      <CodeBlockHeader>
        <CodeBlockTitle language="TypeScript">visitors.ts</CodeBlockTitle>
        <CodeBlockCopy />
      </CodeBlockHeader>
      <CodeBlockContent html={html} />
    </CodeBlock>
  )
}
