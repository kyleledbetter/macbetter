"use client"

import { Button as ButtonPrimitive } from "@ui-sdk/react/button"
import * as React from "react"
import { cx, join } from "../lib/cx"

type SuggestionsLayout = "list" | "chips"

type SuggestionsProps = Omit<React.ComponentProps<"div">, "onSelect"> & {
  /** `list` is rows with a hairline between, under a composer; `chips` is a row of capsules. */
  layout?: SuggestionsLayout
  /** For `chips`: wrap onto more lines, or stay on one line that scrolls sideways. */
  overflow?: "wrap" | "scroll"
  /** Runs with a suggestion's text when it's chosen, unless the suggestion has its own `onClick`. */
  onSelect?: (text: string) => void
}

const SuggestionsContext = React.createContext<((text: string) => void) | undefined>(undefined)

/** Prompt starters. Name the group with `aria-label`, like "Suggestions". */
function Suggestions({ layout = "list", overflow = "wrap", onSelect, className, ...props }: SuggestionsProps) {
  return (
    <SuggestionsContext.Provider value={onSelect}>
      <div
        role="group"
        data-layout={layout}
        data-overflow={layout === "chips" ? overflow : undefined}
        className={join("mb-suggestions", className)}
        {...props}
      />
    </SuggestionsContext.Provider>
  )
}

type SuggestionProps = React.ComponentProps<typeof ButtonPrimitive> & {
  /** A leading glyph. Decorative: the text names the suggestion. */
  icon?: React.ReactNode
  /** The prompt it sends, when it differs from what it shows. Defaults to its text. */
  value?: string
}

function textOf(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(textOf).join("")
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) return textOf(node.props.children)
  return ""
}

/** One prompt starter. It's a button: choosing it calls the group's `onSelect` with its text. */
function Suggestion({ icon, value, className, children, onClick, ...props }: SuggestionProps) {
  const onSelect = React.useContext(SuggestionsContext)
  return (
    <ButtonPrimitive
      className={cx("mb-suggestion", className)}
      onClick={(event, ...rest) => {
        onClick?.(event, ...rest)
        if (!event.defaultPrevented) onSelect?.(value ?? textOf(children as React.ReactNode))
      }}
      {...props}
    >
      {(state) => (
        <>
          {icon ? (
            <span aria-hidden="true" className="mb-suggestion-icon">
              {icon}
            </span>
          ) : null}
          <span className="mb-suggestion-label">{typeof children === "function" ? children(state) : children}</span>
        </>
      )}
    </ButtonPrimitive>
  )
}

export { Suggestion, Suggestions }
export type { SuggestionProps, SuggestionsLayout, SuggestionsProps }
