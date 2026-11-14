import { Input, InputClear, InputGroup } from "@ui-sdk/react/input"
import type * as React from "react"
import { cx, join } from "../lib/cx"
import { ClearGlyph } from "../lib/field-glyphs"

type TextFieldSize = "sm" | "md" | "lg"
/** `bordered` is the macOS field; `filled` is the iOS gray field; `plain` has no chrome, for list rows. */
type TextFieldVariant = "auto" | "bordered" | "filled" | "plain"

type TextFieldProps = Omit<React.ComponentProps<typeof Input>, "size"> & {
  size?: TextFieldSize
  /** `auto` is bordered on macOS and filled on touch. */
  variant?: TextFieldVariant
}

/**
 * A single line of text. On its own it draws the field; inside a
 * `TextFieldGroup` the group draws it, around adornments and a clear button.
 */
function TextField({ size = "md", variant = "auto", className, ...props }: TextFieldProps) {
  return <Input data-size={size} data-variant={variant} className={cx("sd-text-field", className)} {...props} />
}

type TextFieldGroupProps = React.ComponentProps<typeof InputGroup> & {
  size?: TextFieldSize
  variant?: TextFieldVariant
}

function TextFieldGroup({ size = "md", variant = "auto", className, ...props }: TextFieldGroupProps) {
  return (
    <InputGroup data-size={size} data-variant={variant} className={cx("sd-text-field-group", className)} {...props} />
  )
}

/** Text or an icon beside the input, like a unit, a prefix or a symbol. Pressing it focuses the input. */
function TextFieldAdornment({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={join("sd-text-field-adornment", className)} {...props} />
}

/** The clear button: xmark.circle.fill, shown only while there's text. */
function TextFieldClear({
  className,
  children,
  "aria-label": label = "Clear text",
  ...props
}: React.ComponentProps<typeof InputClear>) {
  return (
    <InputClear aria-label={label} className={cx("sd-text-field-clear", className)} {...props}>
      {children ?? <ClearGlyph />}
    </InputClear>
  )
}

export { TextField, TextFieldAdornment, TextFieldClear, TextFieldGroup }
export type { TextFieldGroupProps, TextFieldProps, TextFieldSize, TextFieldVariant }
