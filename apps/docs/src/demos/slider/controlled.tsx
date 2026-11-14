"use client"

import { Slider } from "macbetter/slider"
import { useState } from "react"

export default function Example() {
  const [minutes, setMinutes] = useState(25)

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%", maxWidth: 360 }}>
      <span style={{ font: "var(--mb-text-title-2)", fontVariantNumeric: "tabular-nums" }}>{minutes} min</span>
      <Slider
        value={minutes}
        onValueChange={(value) => setMinutes(value as number)}
        min={5}
        max={60}
        step={5}
        thumbLabel="Focus timer length"
      />
    </div>
  )
}
