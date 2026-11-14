"use client"

import {
  PasswordInput,
  PasswordInputControl,
  PasswordInputToggle,
} from "@ui-sdk/react/password-input"
import type * as React from "react"
import { cx } from "../lib/cx"
import { EyeGlyph, EyeSlashGlyph } from "../lib/field-glyphs"

type SecureFieldProps = React.ComponentProps<typeof PasswordInput> & {
  size?: "sm" | "md" | "lg"
  /** `auto` is bordered on macOS and filled on touch, like `TextField`. */
  variant?: "auto" | "bordered" | "filled" | "plain"
  placeholder?: string
  /** Shows the eye button that reveals the password. */
  toggle?: boolean
  /** The toggle's name. */
  toggleLabel?: string
}

/**
 * A password field with a show and hide button. Form options go on the root;
 * `placeholder`, `id`, `autoFocus` and ARIA names go to the input. Pass
 * children to compose `SecureFieldInput` and `SecureFieldToggle` yourself.
 */
function SecureField({
  size = "md",
  variant = "auto",
  placeholder,
  toggle = true,
  toggleLabel = "Show password",
  id,
  autoFocus,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  className,
  children,
  ...props
}: SecureFieldProps) {
  return (
    <PasswordInput data-size={size} data-variant={variant} className={cx("sd-secure-field", className)} {...props}>
      {children ?? (
        <>
          <SecureFieldInput
            id={id}
            autoFocus={autoFocus}
            placeholder={placeholder}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
          />
          {toggle ? <SecureFieldToggle aria-label={toggleLabel} /> : null}
        </>
      )}
    </PasswordInput>
  )
}

function SecureFieldInput({ className, ...props }: React.ComponentProps<typeof PasswordInputControl>) {
  return <PasswordInputControl className={cx("sd-secure-field-input", className)} {...props} />
}

/** The eye button. It shows eye.slash while the password is visible. */
function SecureFieldToggle({
  className,
  children,
  "aria-label": label = "Show password",
  ...props
}: React.ComponentProps<typeof PasswordInputToggle>) {
  return (
    <PasswordInputToggle aria-label={label} className={cx("sd-secure-field-toggle", className)} {...props}>
      {children ?? ((state) => (state.visible ? <EyeSlashGlyph /> : <EyeGlyph />))}
    </PasswordInputToggle>
  )
}

export { SecureField, SecureFieldInput, SecureFieldToggle }
export type { SecureFieldProps }
