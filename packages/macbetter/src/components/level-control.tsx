"use client"

// Client-only: it composes ui-sdk's Slider parts, which read their state from context.
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

type LevelControlProps = Omit<React.ComponentProps<typeof SliderPrimitive>, "children"> & {
  /** `lg` is the tall control of an accessory sheet; `md` fits a Mac popover. */
  size?: "md" | "lg"
  /** The fill: warm white-yellow for lights, the accent, or plain white for shades, fans and speakers. */
  tone?: "light" | "accent" | "neutral"
  /** A glyph drawn inside the track at the minimum end. It changes color to read on the fill. */
  icon?: React.ReactNode
  /** Names the control for assistive tech, like "Pendant lights brightness". */
  label: string
  /** Draws this many equal segments, for discrete levels like a fan's speeds. */
  steps?: number
  children?: React.ReactNode
}

function LevelControl({
  orientation = "vertical",
  size = "lg",
  tone = "accent",
  icon,
  label,
  steps,
  className,
  children,
  ...props
}: LevelControlProps) {
  const segments = steps && steps > 1 ? steps : 0
  return (
    <SliderPrimitive
      orientation={orientation}
      data-size={size}
      data-tone={tone}
      className={cx("mb-level-control", className)}
      {...props}
    >
      {children}
      <SliderControlPrimitive className="mb-level-control-control">
        <SliderTrackPrimitive className="mb-level-control-track">
          {icon ? (
            <span aria-hidden="true" className="mb-level-control-icon">
              {icon}
            </span>
          ) : null}
          {/* A second copy of the icon rides inside the fill, so the part the fill covers turns dark. */}
          <SliderIndicatorPrimitive className="mb-level-control-fill">
            {icon ? (
              <span aria-hidden="true" className="mb-level-control-icon" data-on-fill="">
                {icon}
              </span>
            ) : null}
          </SliderIndicatorPrimitive>
          {segments ? (
            <span
              aria-hidden="true"
              className="mb-level-control-steps"
              style={{ "--mb-level-control-segments": segments } as React.CSSProperties}
            >
              {Array.from({ length: segments - 1 }, (_, index) => (
                <span
                  // Dividers are identified by their position; there's no other key.
                  key={index}
                  className="mb-level-control-step"
                  style={{ "--mb-level-control-step": index + 1 } as React.CSSProperties}
                />
              ))}
            </span>
          ) : null}
          <SliderThumbPrimitive aria-label={label} className="mb-level-control-thumb" />
        </SliderTrackPrimitive>
      </SliderControlPrimitive>
    </SliderPrimitive>
  )
}

function LevelControlValue({ className, ...props }: React.ComponentProps<typeof SliderValuePrimitive>) {
  return <SliderValuePrimitive className={cx("mb-level-control-value", className)} {...props} />
}

export { LevelControl, LevelControlValue }
export type { LevelControlProps }
