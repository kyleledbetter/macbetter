"use client"

import { SegmentedControl, SegmentedControlItem } from "macbetter/segmented-control"
import { Toolbar, ToolbarButton } from "macbetter/toolbar"
import {
  Window,
  WindowBody,
  WindowTitlebar,
  WindowTitlebarCenter,
  WindowTitlebarLeading,
  WindowTitlebarTrailing,
} from "macbetter/window"
import { PlusIcon } from "lucide-react"
import { useState } from "react"

const days = ["Mon 9", "Tue 10", "Wed 11", "Thu 12", "Fri 13"]

const shifts: Record<string, { who: string; time: string; color: string }[]> = {
  "Mon 9": [{ who: "Amara", time: "7–3", color: "var(--mb-orange)" }],
  "Tue 10": [
    { who: "Kenji", time: "7–3", color: "var(--mb-blue)" },
    { who: "Sofia", time: "3–11", color: "var(--mb-purple)" },
  ],
  "Wed 11": [{ who: "Theo", time: "9–5", color: "var(--mb-green)" }],
  "Thu 12": [
    { who: "Amara", time: "7–3", color: "var(--mb-orange)" },
    { who: "Kenji", time: "3–11", color: "var(--mb-blue)" },
  ],
  "Fri 13": [{ who: "Sofia", time: "9–5", color: "var(--mb-purple)" }],
}

export default function Example() {
  const [view, setView] = useState("week")

  return (
    <Window aria-label="Rota, schedule" style={{ maxWidth: 820, height: 360 }}>
      <WindowTitlebar>
        <WindowTitlebarLeading>
          <Toolbar aria-label="Dates">
            <ToolbarButton>Today</ToolbarButton>
          </Toolbar>
        </WindowTitlebarLeading>
        <WindowTitlebarCenter>
          <SegmentedControl aria-label="Calendar view" value={view} onValueChange={(next) => setView(next as string)}>
            <SegmentedControlItem value="day">Day</SegmentedControlItem>
            <SegmentedControlItem value="week">Week</SegmentedControlItem>
            <SegmentedControlItem value="month">Month</SegmentedControlItem>
          </SegmentedControl>
        </WindowTitlebarCenter>
        <WindowTitlebarTrailing>
          <Toolbar aria-label="Schedule">
            <ToolbarButton aria-label="Add shift">
              <PlusIcon aria-hidden="true" />
            </ToolbarButton>
          </Toolbar>
        </WindowTitlebarTrailing>
      </WindowTitlebar>
      <WindowBody style={{ display: "grid", gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}>
        {days.map((day) => (
          <div
            key={day}
            style={{ display: "grid", alignContent: "start", gap: 6, padding: 10, borderInlineEnd: "1px solid var(--mb-separator)" }}
          >
            <div className="mb-text-subheadline mb-label-secondary">{day}</div>
            {shifts[day].map((shift) => (
              <div
                key={shift.who + shift.time}
                style={{
                  padding: "6px 8px",
                  borderRadius: 6,
                  borderInlineStart: `3px solid ${shift.color}`,
                  background: `color-mix(in oklch, ${shift.color} 16%, transparent)`,
                }}
              >
                <div className="mb-text-headline" style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                  {shift.who}
                </div>
                <div className="mb-text-subheadline mb-label-secondary">{shift.time}</div>
              </div>
            ))}
          </div>
        ))}
      </WindowBody>
    </Window>
  )
}
