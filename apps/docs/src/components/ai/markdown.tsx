"use client"

import { CodeBlock, CodeBlockContent, CodeBlockCopy, CodeBlockHeader, CodeBlockTitle } from "macbetter/code-block"
import { Response } from "macbetter/response"
import * as React from "react"
import { type Components, type ExtraProps, Streamdown, useIsCodeFenceIncomplete } from "streamdown"

type MarkdownProps = Omit<React.ComponentProps<typeof Response>, "children"> & {
  /** The reply as Markdown. It can be cut off mid-word: unfinished syntax is completed while it streams. */
  children: string
  /** Set while the reply is still arriving. Shows the caret and holds back highlighting of an unfinished code fence. */
  streaming?: boolean
}

const languages: Record<string, string> = {
  bash: "Shell",
  css: "CSS",
  html: "HTML",
  js: "JavaScript",
  json: "JSON",
  jsx: "JSX",
  md: "Markdown",
  py: "Python",
  python: "Python",
  sh: "Shell",
  sql: "SQL",
  swift: "Swift",
  ts: "TypeScript",
  tsx: "TSX",
  typescript: "TypeScript",
  yaml: "YAML",
}

// Every element comes out plain, so Response's typography styles it; Streamdown's own classes never apply.
function plain<K extends keyof React.JSX.IntrinsicElements>(tag: K) {
  function Plain(props: React.JSX.IntrinsicElements[K] & ExtraProps) {
    const rest: Record<string, unknown> = { ...props }
    delete rest.node
    delete rest.className
    return React.createElement(tag, rest as React.JSX.IntrinsicElements[K])
  }
  Plain.displayName = `Markdown.${tag}`
  return Plain
}

function Code({ className, children }: React.JSX.IntrinsicElements["code"] & ExtraProps & { "data-block"?: boolean }) {
  const language = /language-([\w+#-]+)/.exec(className ?? "")?.[1] ?? "text"
  const source = String(children ?? "").replace(/\n$/, "")
  const incomplete = useIsCodeFenceIncomplete()
  const [highlighted, setHighlighted] = React.useState<{ source: string; html: string }>()

  React.useEffect(() => {
    if (incomplete) return
    let current = true
    import("shiki")
      .then(({ codeToHtml }) =>
        codeToHtml(source, {
          lang: language,
          themes: { light: "github-light", dark: "github-dark" },
          defaultColor: "light-dark()",
        })
      )
      .then((html) => current && setHighlighted({ source, html }))
      .catch(() => {})
    return () => {
      current = false
    }
  }, [source, language, incomplete])

  const html = highlighted?.source === source ? highlighted.html : undefined
  return (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle language={languages[language] ?? language.toUpperCase()} />
        <CodeBlockCopy value={source} />
      </CodeBlockHeader>
      {html ? <CodeBlockContent html={html} /> : <CodeBlockContent>{source}</CodeBlockContent>}
    </CodeBlock>
  )
}

// Streamdown tells fenced code from inline code by a data-block prop its own pre adds.
function Pre({ children }: React.JSX.IntrinsicElements["pre"] & ExtraProps) {
  return (
    <>
      {React.Children.map(children, (child) =>
        React.isValidElement(child) ? React.cloneElement(child as React.ReactElement<{ "data-block"?: boolean }>, { "data-block": true }) : child
      )}
    </>
  )
}

const components: Components = {
  h1: plain("h1"),
  h2: plain("h2"),
  h3: plain("h3"),
  h4: plain("h4"),
  h5: plain("h5"),
  h6: plain("h6"),
  p: plain("p"),
  strong: plain("strong"),
  em: plain("em"),
  ul: plain("ul"),
  ol: plain("ol"),
  li: plain("li"),
  a: plain("a"),
  blockquote: plain("blockquote"),
  hr: plain("hr"),
  img: plain("img"),
  table: plain("table"),
  thead: plain("thead"),
  tbody: plain("tbody"),
  tr: plain("tr"),
  th: plain("th"),
  td: plain("td"),
  sup: plain("sup"),
  sub: plain("sub"),
  section: plain("section"),
  inlineCode: plain("code"),
  code: Code,
  pre: Pre,
}

/** Renders a Markdown reply with Streamdown inside macbetter's Response. Fenced code becomes a CodeBlock. */
function Markdown({ children, streaming = false, ...props }: MarkdownProps) {
  return (
    <Response streaming={streaming} {...props}>
      <Streamdown
        mode={streaming ? "streaming" : "static"}
        isAnimating={streaming}
        components={components}
        linkSafety={{ enabled: false }}
      >
        {children}
      </Streamdown>
    </Response>
  )
}

export { Markdown }
export type { MarkdownProps }
