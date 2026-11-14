import type { MDXComponents } from "mdx/types"
import Link from "next/link"
import { isValidElement } from "react"
import { CodeBlock } from "@/components/code-block"
import { Demo } from "@/components/demo"
import { Callout, Lead, PropsTable, Steps } from "@/components/prose"

function textOf(node: React.ReactNode): string {
  if (typeof node === "string") return node
  if (Array.isArray(node)) return node.map(textOf).join("")
  if (isValidElement<{ children?: React.ReactNode }>(node)) return textOf(node.props.children)
  return ""
}

/** Shown beside a heading on hover, to say it links to itself. */
function LinkGlyph() {
  return (
    <svg className="docs-anchor-glyph" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path
        d="M6.6 9.4a2.8 2.8 0 0 0 4 0l2.2-2.2a2.8 2.8 0 0 0-4-4l-.7.7M9.4 6.6a2.8 2.8 0 0 0-4 0L3.2 8.8a2.8 2.8 0 0 0 4 4l.7-.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

const components: MDXComponents = {
  a: ({ href = "", children, ...props }) =>
    href.startsWith("/") ? (
      <Link href={href} {...props}>
        {children}
      </Link>
    ) : (
      <a href={href} {...props} {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
        {children}
      </a>
    ),
  h2: ({ id, children, ...props }) => (
    <h2 id={id} {...props}>
      <a href={`#${id}`} className="docs-anchor">
        {children}
        <LinkGlyph />
      </a>
    </h2>
  ),
  h3: ({ id, children, ...props }) => (
    <h3 id={id} {...props}>
      <a href={`#${id}`} className="docs-anchor">
        {children}
        <LinkGlyph />
      </a>
    </h3>
  ),
  pre: ({ children }) => {
    if (isValidElement<{ className?: string; children?: React.ReactNode }>(children)) {
      const lang = children.props.className?.replace("language-", "") ?? "text"
      return <CodeBlock code={textOf(children.props.children)} lang={lang} />
    }
    return <pre>{children}</pre>
  },
  table: (props) => (
    <div className="docs-table-wrap">
      <table {...props} />
    </div>
  ),
  Demo,
  Callout,
  Lead,
  PropsTable,
  Steps,
}

export function useMDXComponents(): MDXComponents {
  return components
}
