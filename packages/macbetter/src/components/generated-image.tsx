"use client"

import { Radio, RadioGroup } from "@ui-sdk/react/radio"
import * as React from "react"
import { cx, join } from "../lib/cx"
import { Shimmer } from "./shimmer"

type GeneratedImageState = "generating" | "ready"

type GeneratedImageContextValue = {
  state: GeneratedImageState
  value: string | null
  setValue: (value: string | null) => void
  generatingLabel: React.ReactNode
}

const GeneratedImageContext = React.createContext<GeneratedImageContextValue>({
  state: "ready",
  value: null,
  setValue: () => {},
  generatingLabel: "Creating image…",
})

type GeneratedImageProps = Omit<React.ComponentProps<"div">, "defaultValue"> & {
  /** `generating` shows a soft drifting placeholder and "Creating image…" on the stage. */
  state?: GeneratedImageState
  /** The chosen image's value, to control it. */
  value?: string | null
  /** The image chosen at first, when uncontrolled. */
  defaultValue?: string | null
  onValueChange?: (value: string | null) => void
  /** Width over height of the stage, like `1`, `4 / 3` or `"16 / 9"`. */
  aspectRatio?: number | string
  /** What the stage says while generating. */
  generatingLabel?: React.ReactNode
}

/**
 * One or more generated images: a large stage, glass actions over its bottom corners, and an
 * optional strip of thumbnails beside it on macOS and below it on iOS.
 */
function GeneratedImage({
  state = "ready",
  value,
  defaultValue = null,
  onValueChange,
  aspectRatio = 1,
  generatingLabel = "Creating image…",
  className,
  style,
  ...props
}: GeneratedImageProps) {
  const [ownValue, setOwnValue] = React.useState(defaultValue)
  const current = value === undefined ? ownValue : value
  const setValue = React.useCallback(
    (next: string | null) => {
      if (value === undefined) setOwnValue(next)
      onValueChange?.(next)
    },
    [value, onValueChange]
  )
  const context = React.useMemo(
    () => ({ state, value: current, setValue, generatingLabel }),
    [state, current, setValue, generatingLabel]
  )
  return (
    <GeneratedImageContext.Provider value={context}>
      <div
        data-state={state}
        aria-busy={state === "generating" ? true : undefined}
        className={join("mb-generated-image", className)}
        style={{ "--mb-generated-image-aspect": String(aspectRatio), ...style } as React.CSSProperties}
        {...props}
      />
    </GeneratedImageContext.Provider>
  )
}

type GeneratedImageStageProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** The image: an `<img>`, an Artwork, or a function of the chosen thumbnail's value. */
  children?: React.ReactNode | ((value: string | null) => React.ReactNode)
}

/** The large image on a dark rounded stage. While generating it shows the placeholder instead. */
function GeneratedImageStage({ className, children, ...props }: GeneratedImageStageProps) {
  const { state, value, generatingLabel } = React.useContext(GeneratedImageContext)
  const content = typeof children === "function" ? children(value) : children
  return (
    <div className={join("mb-generated-image-stage", className)} {...props}>
      {state === "generating" ? (
        <div className="mb-generated-image-placeholder">
          <Shimmer className="mb-generated-image-status">{generatingLabel}</Shimmer>
        </div>
      ) : (
        content
      )}
    </div>
  )
}

/** Buttons over the stage's bottom corners: the first at the leading edge, the rest at the trailing edge. */
function GeneratedImageActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={join("mb-generated-image-actions", className)} {...props} />
}

/** The strip of thumbnails. Choose one with a click or the arrow keys to show it on the stage. */
function GeneratedImageThumbnails({
  className,
  "aria-label": label = "Images",
  ...props
}: Omit<React.ComponentProps<typeof RadioGroup>, "value" | "defaultValue" | "onValueChange">) {
  const { value, setValue } = React.useContext(GeneratedImageContext)
  return (
    <RadioGroup
      aria-label={label}
      value={value}
      onValueChange={(next) => setValue(next as string | null)}
      className={cx("mb-generated-image-thumbnails", className)}
      {...props}
    />
  )
}

type GeneratedImageThumbnailProps = React.ComponentProps<typeof Radio> & {
  /** Names the image for assistive tech, like "Image 2" or what it shows. */
  "aria-label": string
}

/** One thumbnail: a square that takes an accent ring when it's on the stage. */
function GeneratedImageThumbnail({ className, ...props }: GeneratedImageThumbnailProps) {
  return <Radio className={cx("mb-generated-image-thumbnail", className)} {...props} />
}

export {
  GeneratedImage,
  GeneratedImageActions,
  GeneratedImageStage,
  GeneratedImageThumbnail,
  GeneratedImageThumbnails,
}
export type { GeneratedImageProps, GeneratedImageStageProps, GeneratedImageState, GeneratedImageThumbnailProps }
