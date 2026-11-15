"use client"

import { FanIcon } from "@phosphor-icons/react/dist/ssr/Fan"
import { LevelControl, LevelControlValue } from "macbetter/level-control"
import { SegmentedControl, SegmentedControlItem } from "macbetter/segmented-control"
import { useState } from "react"

const speeds = ["Off", "Low", "Medium", "High"]

export default function Example() {
  // HomeKit's rotation speed is a percentage; this fan has three speeds, so it steps by a third.
  const [speed, setSpeed] = useState(2)
  const [direction, setDirection] = useState("forward")

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <LevelControl
        label="Ceiling fan speed"
        tone="neutral"
        min={0}
        max={3}
        step={1}
        steps={3}
        value={speed}
        onValueChange={(value) => setSpeed(value as number)}
        format={(value) => speeds[value]}
        icon={<FanIcon weight="fill" />}
      >
        <LevelControlValue />
      </LevelControl>
      <SegmentedControl aria-label="Direction" value={direction} onValueChange={(value) => value && setDirection(value)}>
        <SegmentedControlItem value="forward">Summer</SegmentedControlItem>
        <SegmentedControlItem value="reverse">Winter</SegmentedControlItem>
      </SegmentedControl>
    </div>
  )
}
