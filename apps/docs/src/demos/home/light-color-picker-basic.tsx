"use client"

import { LightbulbIcon } from "@phosphor-icons/react/dist/ssr/Lightbulb"
import { LevelControl } from "macbetter/level-control"
import { defaultLightSwatches, LightColorPicker, lightSwatchColor } from "macbetter/light-color-picker"
import { type CSSProperties, useState } from "react"

export default function Example() {
  const [color, setColor] = useState("warm")
  const swatch = defaultLightSwatches.find((item) => item.id === color)

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      <LevelControl
        label="Pendant lights brightness"
        tone="light"
        defaultValue={70}
        icon={<LightbulbIcon weight="fill" />}
        // The fill takes the light's color, so the control previews it.
        style={swatch ? ({ "--mb-level-control-fill": lightSwatchColor(swatch) } as CSSProperties) : undefined}
      />
      <LightColorPicker label="Pendant lights color" value={color} onValueChange={setColor} />
    </div>
  )
}
