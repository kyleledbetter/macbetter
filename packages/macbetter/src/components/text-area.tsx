import { Textarea } from "@ui-sdk/react/textarea"
import type * as React from "react"
import { cx } from "../lib/cx"

type TextAreaProps = React.ComponentProps<typeof Textarea> & {
  /** `auto` is bordered on macOS and filled on touch, like `TextField`. */
  variant?: "auto" | "bordered" | "filled" | "plain"
  /** The fewest lines it shows. */
  minRows?: number
  /** The most lines it grows to before it scrolls. */
  maxRows?: number
}

/** Several lines of text. It grows with what's typed, from `minRows` to `maxRows`. */
function TextArea({
  variant = "auto",
  autoResize = true,
  minRows = 3,
  maxRows = 10,
  className,
  style,
  ...props
}: TextAreaProps) {
  const rows = { "--mb-text-area-min-rows": minRows, "--mb-text-area-max-rows": maxRows } as React.CSSProperties
  return (
    <Textarea
      autoResize={autoResize}
      rows={minRows}
      data-variant={variant}
      className={cx("mb-text-area", className)}
      style={typeof style === "function" ? (state) => ({ ...rows, ...style(state) }) : { ...rows, ...style }}
      {...props}
    />
  )
}

export { TextArea }
export type { TextAreaProps }
