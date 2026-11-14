import { Input, InputClear, InputGroup } from "@ui-sdk/react/input"
import type * as React from "react"
import { cx, join } from "../lib/cx"
import { ClearGlyph, MagnifierGlyph } from "../lib/field-glyphs"

type SearchFieldProps = Omit<React.ComponentProps<typeof Input>, "size"> & {
  size?: "sm" | "md" | "lg"
  /** The clear button's name. */
  clearLabel?: string
  /** Class for the field's box, which holds the glyph, the input and the clear button. */
  groupClassName?: string
}

/**
 * The Apple search field: a magnifier, a "Search" prompt and a clear button.
 * A rounded rectangle on macOS, a gray capsule on touch. Props go to the input.
 */
function SearchField({
  size = "md",
  clearLabel = "Clear search",
  placeholder = "Search",
  groupClassName,
  className,
  ...props
}: SearchFieldProps) {
  return (
    <InputGroup data-size={size} className={join("mb-search-field", groupClassName)}>
      <MagnifierGlyph className="mb-search-field-glyph" />
      <Input
        type="search"
        placeholder={placeholder}
        enterKeyHint="search"
        className={cx("mb-search-field-input", className)}
        {...props}
      />
      <InputClear aria-label={clearLabel} className="mb-search-field-clear">
        <ClearGlyph />
      </InputClear>
    </InputGroup>
  )
}

export { SearchField }
export type { SearchFieldProps }
