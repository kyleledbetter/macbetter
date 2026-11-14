"use client"

// Client-only because the default control renders its thumbs from a function of the slider's state.
import {
  Slider as SliderPrimitive,
  SliderControl as SliderControlPrimitive,
  SliderIndicator as SliderIndicatorPrimitive,
  SliderThumb as SliderThumbPrimitive,
  SliderTrack as SliderTrackPrimitive,
  SliderValue as SliderValuePrimitive,
} from "@ui-sdk/react/slider"
import type * as React from "react"
import { cx } from "../lib/cx"

type SliderProps = React.ComponentProps<typeof SliderPrimitive> & {
  /** `sm` is the small slider for inspectors and dense toolbars. */
  size?: "sm" | "md"
  /** Tick marks along the track: a count, or `true` for one at every step. */
  ticks?: number | boolean
  /** Names the thumbs of the slider's own control: one name, or one per thumb of a range. */
  thumbLabel?: string | string[]
}

function tickCount(ticks: SliderProps["ticks"], min = 0, max = 100, step = 1) {
  if (typeof ticks === "number") return ticks
  if (!ticks) return 0
  const count = Math.floor((max - min) / step + 1e-9) + 1
  return count <= 101 ? count : 0
}

function Slider({ size = "md", ticks, thumbLabel, className, children, ...props }: SliderProps) {
  const count = tickCount(ticks, props.min, props.max, props.step)
  return (
    <SliderPrimitive
      data-size={size}
      className={cx("mb-slider", className)}
      {...props}
    >
      {children ?? <SliderControl ticks={count} thumbLabel={thumbLabel} />}
    </SliderPrimitive>
  )
}

type SliderControlProps = React.ComponentProps<typeof SliderControlPrimitive> & {
  /** How many tick marks to draw under the track, when the control composes its own track. */
  ticks?: number
  thumbLabel?: string | string[]
}

function SliderControl({ ticks = 0, thumbLabel, className, children, ...props }: SliderControlProps) {
  return (
    <SliderControlPrimitive className={cx("mb-slider-control", className)} {...props}>
      {children ??
        ((state) => {
          const values = Array.isArray(state.value) ? state.value : [state.value]
          return (
            <>
              <SliderTrack>
                <SliderIndicator />
                {values.map((_, index) => (
                  <SliderThumb
                    // Thumbs are identified by their position in the value; there's no other key.
                    key={index}
                    index={index}
                    aria-label={Array.isArray(thumbLabel) ? thumbLabel[index] : thumbLabel}
                  />
                ))}
              </SliderTrack>
              {ticks > 0 ? <SliderTicks count={ticks} /> : null}
            </>
          )
        })}
    </SliderControlPrimitive>
  )
}

function SliderTrack({ className, ...props }: React.ComponentProps<typeof SliderTrackPrimitive>) {
  return <SliderTrackPrimitive className={cx("mb-slider-track", className)} {...props} />
}

function SliderIndicator({ className, ...props }: React.ComponentProps<typeof SliderIndicatorPrimitive>) {
  return <SliderIndicatorPrimitive className={cx("mb-slider-indicator", className)} {...props} />
}

function SliderThumb({ className, ...props }: React.ComponentProps<typeof SliderThumbPrimitive>) {
  return <SliderThumbPrimitive className={cx("mb-slider-thumb", className)} {...props} />
}

function SliderValue({ className, ...props }: React.ComponentProps<typeof SliderValuePrimitive>) {
  return <SliderValuePrimitive className={cx("mb-slider-value", className)} {...props} />
}

/** Evenly spaced tick marks, from the minimum to the maximum. Decorative. */
function SliderTicks({ count, className, ...props }: React.ComponentProps<"div"> & { count: number }) {
  return (
    <div aria-hidden="true" className={["mb-slider-ticks", className].filter(Boolean).join(" ")} {...props}>
      {Array.from({ length: count }, (_, index) => (
        <span key={index} className="mb-slider-tick" />
      ))}
    </div>
  )
}

export { Slider, SliderControl, SliderIndicator, SliderThumb, SliderTicks, SliderTrack, SliderValue }
export type { SliderControlProps, SliderProps }
