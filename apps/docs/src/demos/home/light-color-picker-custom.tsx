"use client"

import { ColorWell } from "macbetter/color-well"
import { kelvinToMired, LightColorPicker, type LightSwatch } from "macbetter/light-color-picker"

// The bulb supports 2000–6500 K. HomeKit stores color temperature in mireds.
const swatches: LightSwatch[] = [
  { id: "warm", label: "Warm white, 2700 K", kind: "temperature", mireds: kelvinToMired(2700) },
  { id: "daylight", label: "Daylight, 5000 K", kind: "temperature", mireds: kelvinToMired(5000) },
  { id: "amber", label: "Amber", kind: "color", hue: 38, saturation: 100 },
  { id: "teal", label: "Teal", kind: "color", hue: 180, saturation: 70 },
]

export default function Example() {
  return (
    <LightColorPicker label="Under-cabinet lights color" swatches={swatches} defaultValue="warm">
      <ColorWell aria-label="Custom color" defaultValue="#ff6b9a" alpha={false} />
    </LightColorPicker>
  )
}
