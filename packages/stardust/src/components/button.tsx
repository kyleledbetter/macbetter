import { Button as ButtonPrimitive } from "@ui-sdk/react/button"
import type * as React from "react"
import { cx, join } from "../lib/cx"

type ButtonVariant = "filled" | "tinted" | "bezeled" | "plain" | "glass"
type ButtonTone = "accent" | "neutral" | "destructive"
type ButtonSize = "sm" | "md" | "lg"
type ButtonShape = "auto" | "capsule" | "circle"

type ButtonProps = React.ComponentProps<typeof ButtonPrimitive> & {
  /** `bezeled` is the standard push button; `filled` is the one default action in a view. */
  variant?: ButtonVariant
  tone?: ButtonTone
  size?: ButtonSize
  /** `auto` follows the platform: rounded rectangles on macOS, capsules on touch. */
  shape?: ButtonShape
  /** Stretches to the container's width, like a sheet's primary action on iOS. */
  block?: boolean
}

function Button({
  variant = "bezeled",
  tone = "accent",
  size = "md",
  shape = "auto",
  block,
  className,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-variant={variant}
      data-tone={tone}
      data-size={size}
      data-shape={shape}
      data-block={block ? "" : undefined}
      className={cx("sd-button", className)}
      {...props}
    />
  )
}

function ButtonSpinner({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden="true"
      data-show="pending"
      data-motion="essential"
      className={join("sd-button-spinner", className)}
      {...props}
    />
  )
}

export { Button, ButtonSpinner }
export type { ButtonProps, ButtonShape, ButtonSize, ButtonTone, ButtonVariant }
