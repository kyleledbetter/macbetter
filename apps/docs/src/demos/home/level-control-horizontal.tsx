"use client"

import { SpeakerHighIcon } from "@phosphor-icons/react/dist/ssr/SpeakerHigh"
import { LevelControl } from "macbetter/level-control"

export default function Example() {
  return (
    <div style={{ width: 280 }}>
      <LevelControl
        label="Kitchen speaker volume"
        orientation="horizontal"
        size="md"
        tone="neutral"
        defaultValue={35}
        format={{ style: "unit", unit: "percent" }}
        icon={<SpeakerHighIcon weight="fill" />}
      />
    </div>
  )
}
