import {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaCorner,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@ui-sdk/react/scroll-area"
import type * as React from "react"
import { cx } from "../lib/cx"

type ScrollViewOrientation = "vertical" | "horizontal" | "both"

type ScrollViewProps = Omit<React.ComponentProps<typeof ScrollArea>, "children"> & {
  children?: React.ReactNode
  /** The axes that scroll. */
  orientation?: ScrollViewOrientation
  /** Fades content out at an edge while there's more to scroll that way. */
  fade?: boolean
  /** `bordered` frames the view with a hairline, like a macOS table or text view. */
  variant?: "plain" | "bordered"
  /** Props for the element that scrolls, like `tabIndex` or `onScroll`. */
  viewportProps?: React.ComponentProps<typeof ScrollAreaViewport>
}

/**
 * A scrolling region with Apple's overlay scrollbars: a thin thumb that shows
 * while you scroll or point at it, and widens under the pointer on macOS.
 */
function ScrollView({
  orientation = "vertical",
  fade = true,
  variant = "plain",
  type = "hover",
  className,
  children,
  viewportProps,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  ...props
}: ScrollViewProps) {
  const named = ariaLabel !== undefined || ariaLabelledby !== undefined
  const { className: viewportClassName, ...viewportRest } = viewportProps ?? {}
  return (
    <ScrollArea
      type={type}
      data-orientation={orientation}
      data-fade={fade ? "" : undefined}
      data-variant={variant}
      className={cx("mb-scroll-view", className)}
      {...props}
    >
      <ScrollAreaViewport
        role={named ? "region" : undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        className={cx("mb-scroll-view-viewport", viewportClassName)}
        {...viewportRest}
      >
        <ScrollAreaContent className="mb-scroll-view-content">{children}</ScrollAreaContent>
      </ScrollAreaViewport>
      {orientation !== "horizontal" ? (
        <ScrollAreaScrollbar orientation="vertical" className="mb-scroll-view-scrollbar">
          <ScrollAreaThumb className="mb-scroll-view-thumb" />
        </ScrollAreaScrollbar>
      ) : null}
      {orientation !== "vertical" ? (
        <ScrollAreaScrollbar orientation="horizontal" className="mb-scroll-view-scrollbar">
          <ScrollAreaThumb className="mb-scroll-view-thumb" />
        </ScrollAreaScrollbar>
      ) : null}
      {orientation === "both" ? <ScrollAreaCorner className="mb-scroll-view-corner" /> : null}
    </ScrollArea>
  )
}

export { ScrollView }
export type { ScrollViewOrientation, ScrollViewProps }
