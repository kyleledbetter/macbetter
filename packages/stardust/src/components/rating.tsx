import { Rating as RatingPrimitive, RatingItem as RatingItemPrimitive } from "@ui-sdk/react/rating"
import type * as React from "react"
import { cx } from "../lib/cx"

const star =
  "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"

type RatingProps = React.ComponentProps<typeof RatingPrimitive> & {
  size?: "sm" | "md" | "lg"
}

function Rating({ size = "md", className, children, ...props }: RatingProps) {
  return (
    <RatingPrimitive data-size={size} className={cx("sd-rating", className)} {...props}>
      {children ?? <RatingItem />}
    </RatingPrimitive>
  )
}

/** One star. Rating repeats it; pass children to draw a different symbol. */
function RatingItem({ className, children, ...props }: React.ComponentProps<typeof RatingItemPrimitive>) {
  return (
    <RatingItemPrimitive className={cx("sd-rating-item", className)} {...props}>
      {children ?? (
        <>
          <svg viewBox="0 0 24 24" aria-hidden="true" className="sd-rating-symbol" data-part="empty">
            <path d={star} />
          </svg>
          <svg viewBox="0 0 24 24" aria-hidden="true" className="sd-rating-symbol" data-part="fill">
            <path d={star} />
          </svg>
        </>
      )}
    </RatingItemPrimitive>
  )
}

export { Rating, RatingItem }
export type { RatingProps }
