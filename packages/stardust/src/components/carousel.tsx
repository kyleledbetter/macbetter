import {
  Carousel as CarouselPrimitive,
  CarouselContent as CarouselContentPrimitive,
  CarouselIndicator as CarouselIndicatorPrimitive,
  CarouselIndicatorGroup as CarouselIndicatorGroupPrimitive,
  CarouselItem as CarouselItemPrimitive,
  CarouselNext as CarouselNextPrimitive,
  CarouselPrevious as CarouselPreviousPrimitive,
  CarouselViewport as CarouselViewportPrimitive,
} from "@ui-sdk/react/carousel"
import type * as React from "react"
import { cx } from "../lib/cx"

type CarouselProps = React.ComponentProps<typeof CarouselPrimitive> & {
  /** `peek` shows the edge of the next card, like the App Store; `full` shows one page at a time. */
  layout?: "peek" | "full"
}

/** A paging scroll view: slides snap into place, with glass arrows on pointer devices and page dots. */
function Carousel({ layout = "peek", className, ...props }: CarouselProps) {
  return <CarouselPrimitive data-layout={layout} className={cx("sd-carousel", className)} {...props} />
}

function CarouselViewport({ className, ...props }: React.ComponentProps<typeof CarouselViewportPrimitive>) {
  return <CarouselViewportPrimitive className={cx("sd-carousel-viewport", className)} {...props} />
}

function CarouselContent({ className, ...props }: React.ComponentProps<typeof CarouselContentPrimitive>) {
  return <CarouselContentPrimitive className={cx("sd-carousel-content", className)} {...props} />
}

function CarouselItem({ className, ...props }: React.ComponentProps<typeof CarouselItemPrimitive>) {
  return <CarouselItemPrimitive className={cx("sd-carousel-item", className)} {...props} />
}

function ChevronIcon({ direction }: { direction: "previous" | "next" }) {
  return (
    <svg viewBox="0 0 10 16" aria-hidden="true" data-direction={direction}>
      <path d={direction === "previous" ? "M7.5 2 2 8l5.5 6" : "M2.5 2 8 8l-5.5 6"} />
    </svg>
  )
}

function CarouselPrevious({
  className,
  children,
  "aria-label": ariaLabel = "Previous",
  ...props
}: React.ComponentProps<typeof CarouselPreviousPrimitive>) {
  return (
    <CarouselPreviousPrimitive
      aria-label={ariaLabel}
      className={cx("sd-carousel-button sd-carousel-previous", className)}
      {...props}
    >
      {children ?? <ChevronIcon direction="previous" />}
    </CarouselPreviousPrimitive>
  )
}

function CarouselNext({
  className,
  children,
  "aria-label": ariaLabel = "Next",
  ...props
}: React.ComponentProps<typeof CarouselNextPrimitive>) {
  return (
    <CarouselNextPrimitive
      aria-label={ariaLabel}
      className={cx("sd-carousel-button sd-carousel-next", className)}
      {...props}
    >
      {children ?? <ChevronIcon direction="next" />}
    </CarouselNextPrimitive>
  )
}

/** The page dots. Write one `CarouselIndicator` per slide; dots past the page count hide themselves. */
function CarouselIndicatorGroup({ className, ...props }: React.ComponentProps<typeof CarouselIndicatorGroupPrimitive>) {
  return <CarouselIndicatorGroupPrimitive className={cx("sd-carousel-indicators", className)} {...props} />
}

function CarouselIndicator({ className, ...props }: React.ComponentProps<typeof CarouselIndicatorPrimitive>) {
  return <CarouselIndicatorPrimitive className={cx("sd-carousel-indicator", className)} {...props} />
}

export {
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselIndicatorGroup,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselViewport,
}
export type { CarouselProps }
