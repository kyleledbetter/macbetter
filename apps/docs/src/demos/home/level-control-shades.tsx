"use client"

import { LevelControl, LevelControlValue } from "macbetter/level-control"
import { useState } from "react"

function ShadeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M3 4h18M5 4v10h14V4M8 8h8M8 11h8M12 14v4" />
      <circle cx="12" cy="19.5" r="1.5" fill="currentColor" />
    </svg>
  )
}

export default function Example() {
  const [position, setPosition] = useState(40)

  return (
    <LevelControl
      label="Living room shades position"
      tone="neutral"
      step={5}
      value={position}
      onValueChange={(value) => setPosition(value as number)}
      format={(value) => (value === 0 ? "Closed" : value === 100 ? "Open" : `${value}% open`)}
      icon={<ShadeIcon />}
    >
      <LevelControlValue />
    </LevelControl>
  )
}
