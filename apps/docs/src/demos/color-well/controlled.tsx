"use client"

import { ColorWell } from "@dreambase/stardust/color-well"
import { useState } from "react"

/** Black or white, whichever reads better on the color. */
function inkFor(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return luminance > 0.18 ? "#000000" : "#ffffff"
}

export default function Example() {
  const [color, setColor] = useState("#5856d6")

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <ColorWell aria-label="Folder color" value={color} onValueChange={setColor} />
      <span
        style={{
          padding: "6px 12px",
          borderRadius: 999,
          background: color,
          color: inkFor(color),
          fontFamily: "var(--sd-font-mono)",
          fontSize: 13,
        }}
      >
        {color}
      </span>
    </div>
  )
}
