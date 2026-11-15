"use client"

import { LightbulbIcon } from "@phosphor-icons/react/dist/ssr/Lightbulb"
import { LevelControl, LevelControlValue } from "macbetter/level-control"
import { useState } from "react"

export default function Example() {
  const [brightness, setBrightness] = useState(80)

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <strong style={{ font: "var(--mb-text-headline)" }}>Pendant lights</strong>
      <LevelControl
        label="Pendant lights brightness"
        tone="light"
        value={brightness}
        onValueChange={(value) => setBrightness(value as number)}
        format={{ style: "unit", unit: "percent" }}
        icon={<LightbulbIcon weight="fill" />}
      >
        <LevelControlValue style={{ color: "var(--mb-label-secondary)" }} />
      </LevelControl>
    </div>
  )
}
