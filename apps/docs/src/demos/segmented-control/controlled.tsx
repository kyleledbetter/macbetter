"use client"

import { SegmentedControl, SegmentedControlItem } from "@dreambase/stardust/segmented-control"
import { useState } from "react"

const ranges = {
  day: "Today: 4,812 steps",
  week: "This week: 38,240 steps",
  month: "This month: 161,905 steps",
}

type Range = keyof typeof ranges

export default function Example() {
  const [range, setRange] = useState<Range>("week")

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <SegmentedControl
        aria-label="Time range"
        value={range}
        onValueChange={(value) => value && setRange(value as Range)}
      >
        <SegmentedControlItem value="day">Day</SegmentedControlItem>
        <SegmentedControlItem value="week">Week</SegmentedControlItem>
        <SegmentedControlItem value="month">Month</SegmentedControlItem>
      </SegmentedControl>
      <p style={{ margin: 0, color: "var(--sd-label-secondary)" }}>{ranges[range]}</p>
    </div>
  )
}
