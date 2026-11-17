import type * as React from "react"
import { join } from "../lib/cx"

type ResponseProps = React.ComponentProps<"div"> & {
  /** Set while the reply is still arriving. Pair it with a `ResponseCaret` at the end. */
  streaming?: boolean
}

/**
 * Typography for the assistant's reply. It styles the elements you give it —
 * paragraphs, headings, lists, tables, code — and leaves nested macbetter components alone.
 */
function Response({ streaming, className, ...props }: ResponseProps) {
  return (
    <div
      data-streaming={streaming ? "" : undefined}
      aria-busy={streaming || undefined}
      className={join("mb-response", className)}
      {...props}
    />
  )
}

/** The blinking mark at the end of a reply that's still streaming. It holds still under Reduce Motion. */
function ResponseCaret({ className, ...props }: React.ComponentProps<"span">) {
  return <span aria-hidden="true" className={join("mb-response-caret", className)} {...props} />
}

export { Response, ResponseCaret }
export type { ResponseProps }
