"use client"

import {
  createTokenInputController,
  type Token,
  TokenInput,
  TokenInputEditor,
  type TokenInputProps,
  TokenInputToken,
  TokenInputTokenRemove,
  type TokenInputValue,
} from "@ui-sdk/react/token-input"
import * as React from "react"
import { cx } from "../lib/cx"
import { ClearGlyph } from "../lib/field-glyphs"

type NewToken = Omit<Token, "id">
type EditorProps = React.ComponentProps<typeof TokenInputEditor>

type TokenFieldProps = TokenInputProps & {
  size?: "sm" | "md" | "lg"
  /** `auto` is bordered on macOS and filled on touch, like `TextField`. */
  variant?: "auto" | "bordered" | "filled"
  placeholder?: string
  id?: string
  className?: EditorProps["className"]
  "aria-label"?: string
  "aria-labelledby"?: string
  /** Characters that turn the text typed before them into a token. Return and leaving the field do too. `false` turns it off. */
  tokenizeOn?: readonly string[] | false
  /** Makes a token from typed text, or returns `null` to leave the text as it is. */
  createToken?: (text: string) => NewToken | null
  /** Draws a remove button on each token. Backspace removes them either way. */
  removable?: boolean
  /** More props for the editor, the element that draws the field. */
  editorProps?: Omit<EditorProps, "placeholder" | "className">
}

const defaultSeparators = [","] as const
const plainToken = (text: string): NewToken => ({ type: "token", value: text, label: text })

/**
 * The macOS token field: text where each entry becomes a rounded, accent-tinted
 * token. Type a name and a comma or Return to make one.
 */
function TokenField({
  size = "md",
  variant = "auto",
  placeholder,
  id,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  tokenizeOn = defaultSeparators,
  createToken = plainToken,
  removable,
  editorProps,
  controller: controllerProp,
  onValueChange,
  onSubmit,
  renderToken,
  submitShortcut = "enter",
  children,
  ...options
}: TokenFieldProps) {
  const [own] = React.useState(createTokenInputController)
  const controller = controllerProp ?? own
  const separators = tokenizeOn || []

  const tokenize = React.useCallback(
    (value: TokenInputValue, all: boolean) => {
      let changed = false
      const next: TokenInputValue = []
      value.forEach((segment, i) => {
        if (typeof segment !== "string") return void next.push(segment)
        const pieces = split(segment, separators)
        const closeLast = all && i === value.length - 1
        const made: TokenInputValue = []
        for (const [p, piece] of pieces.entries()) {
          const open = p === pieces.length - 1 && !closeLast
          const text = piece.trim()
          if (open) {
            const rest = pieces.length > 1 ? piece.trimStart() : piece
            if (rest) made.push(rest)
          } else if (text) {
            const token = createToken(text)
            if (!token) return void next.push(segment)
            made.push(token)
          }
        }
        if (made.length !== 1 || made[0] !== segment) changed = true
        next.push(...made)
      })
      if (changed) {
        controller.setValue(next)
        controller.focus({ at: "end" })
      }
      return changed
    },
    [controller, createToken, separators]
  )

  return (
    <TokenInput
      controller={controller}
      submitShortcut={submitShortcut}
      onValueChange={(value, details) => {
        onValueChange?.(value, details)
        const typedSeparator = value.some(
          (segment) => typeof segment === "string" && separators.some((s) => segment.includes(s))
        )
        if (typedSeparator && details.reason !== "imperative") queueMicrotask(() => tokenize(value, false))
      }}
      onSubmit={(value, details) => {
        if (!(tokenizeOn && tokenize(value, true))) onSubmit?.(value, details)
      }}
      renderToken={
        renderToken ??
        ((token) => (
          <TokenFieldToken>
            {token.label}
            {removable ? <TokenFieldTokenRemove /> : null}
          </TokenFieldToken>
        ))
      }
      {...options}
    >
      <TokenInputEditor
        id={id}
        placeholder={placeholder}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        data-size={size}
        data-variant={variant}
        className={cx("sd-token-field", className)}
        {...editorProps}
        onBlur={(event) => {
          editorProps?.onBlur?.(event)
          if (tokenizeOn) tokenize(controller.getValue(), true)
        }}
      />
      {children}
    </TokenInput>
  )
}

function split(text: string, separators: readonly string[]): string[] {
  if (separators.length === 0) return [text]
  const pattern = new RegExp(separators.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"))
  return text.split(pattern)
}

function TokenFieldToken({ className, ...props }: React.ComponentProps<typeof TokenInputToken>) {
  return <TokenInputToken className={cx("sd-token-field-token", className)} {...props} />
}

function TokenFieldTokenRemove({ className, children, ...props }: React.ComponentProps<typeof TokenInputTokenRemove>) {
  return (
    <TokenInputTokenRemove className={cx("sd-token-field-token-remove", className)} {...props}>
      {children ?? <ClearGlyph />}
    </TokenInputTokenRemove>
  )
}

export { TokenField, TokenFieldToken, TokenFieldTokenRemove }
export type { TokenFieldProps }
