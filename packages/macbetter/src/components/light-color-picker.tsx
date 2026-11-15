"use client"

// Client-only: the swatches are ui-sdk radios, which read the group's state from context.
import { Radio as RadioPrimitive, RadioGroup as RadioGroupPrimitive } from "@ui-sdk/react/radio"
import type * as React from "react"
import { cx } from "../lib/cx"

/** A light preset: a white by its color temperature, or a color by hue (0–360) and saturation (0–100). */
type LightSwatch = { id: string; label: string } & (
  | { kind: "temperature"; mireds: number }
  | { kind: "color"; hue: number; saturation: number }
)

/** HomeKit stores color temperature in mireds: a million divided by the kelvin. */
function kelvinToMired(kelvin: number): number {
  return Math.round(1_000_000 / kelvin)
}

function miredToKelvin(mireds: number): number {
  return Math.round(1_000_000 / mireds / 100) * 100
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

// A blackbody approximation (Tanner Helland's fit), good enough to tint a swatch.
function kelvinToRgb(kelvin: number): [number, number, number] {
  const t = clamp(kelvin, 1000, 40000) / 100
  const r = t <= 66 ? 255 : 329.698727446 * (t - 60) ** -0.1332047592
  const g = t <= 66 ? 99.4708025861 * Math.log(t) - 161.1195681661 : 288.1221695283 * (t - 60) ** -0.0755148492
  const b = t >= 66 ? 255 : t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307
  return [r, g, b].map((channel) => Math.round(clamp(channel, 0, 255))) as [number, number, number]
}

/** The CSS color a swatch shows. Whites are softened toward white, as a lit bulb looks. */
function lightSwatchColor(swatch: LightSwatch): string {
  if (swatch.kind === "color") {
    return `hsl(${Math.round(swatch.hue)} ${Math.round(clamp(swatch.saturation, 0, 100))}% 55%)`
  }
  const [r, g, b] = kelvinToRgb(1_000_000 / swatch.mireds)
  return `color-mix(in oklch, rgb(${r} ${g} ${b}) 70%, white)`
}

const temperature = (id: string, label: string, kelvin: number): LightSwatch => ({
  id,
  label: `${label}, ${kelvin} K`,
  kind: "temperature",
  mireds: kelvinToMired(kelvin),
})

const defaultLightSwatches: LightSwatch[] = [
  temperature("candle", "Candlelight", 2200),
  temperature("warm", "Warm white", 2700),
  temperature("soft", "Soft white", 3500),
  temperature("neutral", "Neutral white", 4500),
  temperature("daylight", "Daylight", 6500),
  { id: "red", label: "Red", kind: "color", hue: 4, saturation: 90 },
  { id: "orange", label: "Orange", kind: "color", hue: 30, saturation: 95 },
  { id: "green", label: "Green", kind: "color", hue: 130, saturation: 70 },
  { id: "blue", label: "Blue", kind: "color", hue: 215, saturation: 90 },
  { id: "purple", label: "Purple", kind: "color", hue: 280, saturation: 75 },
]

type LightColorPickerProps = Omit<
  React.ComponentProps<typeof RadioGroupPrimitive>,
  "value" | "defaultValue" | "onValueChange" | "children"
> & {
  value?: string
  defaultValue?: string
  onValueChange?: (id: string) => void
  swatches?: LightSwatch[]
  /** Names the group. */
  label?: string
  /** Shown after the swatches, like a Color Well for a custom color. */
  children?: React.ReactNode
}

function LightColorPicker({
  value,
  defaultValue,
  onValueChange,
  swatches = defaultLightSwatches,
  label = "Color",
  className,
  children,
  ...props
}: LightColorPickerProps) {
  return (
    <RadioGroupPrimitive
      aria-label={label}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next) => {
        if (typeof next === "string") onValueChange?.(next)
      }}
      className={cx("mb-light-color-picker", className)}
      {...props}
    >
      {swatches.map((swatch) => (
        <RadioPrimitive
          key={swatch.id}
          value={swatch.id}
          aria-label={swatch.label}
          data-kind={swatch.kind}
          className="mb-light-color-picker-swatch"
          style={{ "--mb-light-swatch": lightSwatchColor(swatch) } as React.CSSProperties}
        />
      ))}
      {children}
    </RadioGroupPrimitive>
  )
}

export { defaultLightSwatches, kelvinToMired, LightColorPicker, lightSwatchColor, miredToKelvin }
export type { LightColorPickerProps, LightSwatch }
