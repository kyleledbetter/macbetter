"use client"

import * as React from "react"
import { cx, join } from "../lib/cx"
import { Button, type ButtonProps } from "./button"

const CodeBlockContext = React.createContext<React.RefObject<HTMLElement | null> | null>(null)

type CodeBlockProps = React.ComponentProps<"div"> & {
  /** Wraps long lines instead of scrolling sideways. */
  wrap?: boolean
  /** Numbers each line in the gutter. Highlighted markup needs one element per line with the class `line`. */
  lineNumbers?: boolean
  /** Scrolls the code past this height, in pixels or any CSS length. */
  maxHeight?: number | string
}

function CodeBlock({ wrap, lineNumbers, maxHeight, className, style, ...props }: CodeBlockProps) {
  const code = React.useRef<HTMLElement | null>(null)
  const height = typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight
  return (
    <CodeBlockContext.Provider value={code}>
      <div
        data-wrap={wrap ? "" : undefined}
        data-line-numbers={lineNumbers ? "" : undefined}
        className={join("mb-code-block", className)}
        style={height ? ({ "--mb-code-block-max-height": height, ...style } as React.CSSProperties) : style}
        {...props}
      />
    </CodeBlockContext.Provider>
  )
}

/** The title bar: a CodeBlockTitle, then a CodeBlockCopy at the trailing edge. */
function CodeBlockHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={join("mb-code-block-header", className)} {...props} />
}

type CodeBlockTitleProps = React.ComponentProps<"div"> & {
  /** A language label after the file name, like `TypeScript`. */
  language?: React.ReactNode
}

function CodeBlockTitle({ language, className, children, ...props }: CodeBlockTitleProps) {
  return (
    <div className={join("mb-code-block-title", className)} {...props}>
      {children != null ? <span className="mb-code-block-title-text">{children}</span> : null}
      {language != null ? <span className="mb-code-block-language">{language}</span> : null}
    </div>
  )
}

type CodeBlockContentProps = Omit<React.ComponentProps<"pre">, "children" | "dangerouslySetInnerHTML"> & {
  /** Plain text. Each line is wrapped in its own element, so line numbers work. */
  children?: React.ReactNode
  /**
   * Markup from your highlighter, used in place of children. A whole `<pre><code>` block, as most
   * highlighters return, has its wrapper dropped and its lines kept. Only pass markup you trust.
   */
  html?: string
}

function unwrap(html: string) {
  return html
    .trim()
    .replace(/^<pre\b[^>]*>\s*(?:<code\b[^>]*>)?/i, "")
    .replace(/(?:<\/code>)?\s*<\/pre>$/i, "")
}

function lines(text: string) {
  const all = text.replace(/\n$/, "").split("\n")
  return all.map((line, index) => (
    // A line has no identity beyond its position.
    <React.Fragment key={index}>
      <span className="mb-code-block-line">{line}</span>
      {index < all.length - 1 ? "\n" : null}
    </React.Fragment>
  ))
}

/** The code: a `<pre><code>` that scrolls sideways (or wraps) and takes focus so the keyboard can scroll it. */
function CodeBlockContent({ html, className, children, tabIndex = 0, ...props }: CodeBlockContentProps) {
  const code = React.useContext(CodeBlockContext)
  return (
    <pre tabIndex={tabIndex} className={join("mb-code-block-content", className)} {...props}>
      {html !== undefined ? (
        <code ref={code} className="mb-code-block-code" dangerouslySetInnerHTML={{ __html: unwrap(html) }} />
      ) : (
        <code ref={code} className="mb-code-block-code">
          {typeof children === "string" ? lines(children) : children}
        </code>
      )}
    </pre>
  )
}

type CodeBlockCopyProps = Omit<ButtonProps, "value"> & {
  /** The text to copy. Leave it out to copy what CodeBlockContent shows. */
  value?: string
  /** How long the check mark stays, in milliseconds. */
  resetAfter?: number
}

function CopyGlyph() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <rect x="5.25" y="5.25" width="8.5" height="8.5" rx="2" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M10.75 3.25A1.75 1.75 0 0 0 9 2.25H4.25a2 2 0 0 0-2 2V9a1.75 1.75 0 0 0 1 1.58"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CheckGlyph() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path
        d="m3.25 8.5 3 3 6.5-7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Copies the code and shows a check mark for two seconds. If the clipboard is unavailable it does nothing. */
function CodeBlockCopy({
  value,
  resetAfter = 2000,
  onClick,
  className,
  children,
  "aria-label": label = "Copy code",
  ...props
}: CodeBlockCopyProps) {
  const code = React.useContext(CodeBlockContext)
  const [copied, setCopied] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  React.useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    const text = value ?? code?.current?.textContent ?? ""
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      return
    }
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), resetAfter)
  }

  return (
    <Button
      variant="plain"
      tone="neutral"
      size="sm"
      shape="circle"
      aria-label={copied ? "Copied" : label}
      data-copied={copied ? "" : undefined}
      className={cx("mb-code-block-copy", className)}
      onClick={(event, details) => {
        onClick?.(event, details)
        void copy()
      }}
      {...props}
    >
      {children ?? (copied ? <CheckGlyph /> : <CopyGlyph />)}
    </Button>
  )
}

export { CodeBlock, CodeBlockContent, CodeBlockCopy, CodeBlockHeader, CodeBlockTitle }
export type { CodeBlockContentProps, CodeBlockCopyProps, CodeBlockProps, CodeBlockTitleProps }
