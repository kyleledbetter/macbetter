"use client"

import * as React from "react"
import { baseOption, ChartFrame, EChart, ringSeries, type ChartTheme, type Rings } from "@/components/charts"

/** Sunday, November 8 to today. */
const week: { day: string; name: string; rings: Rings }[] = [
  { day: "S", name: "Sunday", rings: { move: { value: 412, goal: 600 }, exercise: { value: 22, goal: 30 }, stand: { value: 9, goal: 12 } } },
  { day: "M", name: "Monday", rings: { move: { value: 655, goal: 600 }, exercise: { value: 41, goal: 30 }, stand: { value: 12, goal: 12 } } },
  { day: "T", name: "Tuesday", rings: { move: { value: 590, goal: 600 }, exercise: { value: 31, goal: 30 }, stand: { value: 11, goal: 12 } } },
  { day: "W", name: "Wednesday", rings: { move: { value: 802, goal: 600 }, exercise: { value: 64, goal: 30 }, stand: { value: 13, goal: 12 } } },
  { day: "T", name: "Thursday", rings: { move: { value: 534, goal: 600 }, exercise: { value: 28, goal: 30 }, stand: { value: 12, goal: 12 } } },
  { day: "F", name: "Friday", rings: { move: { value: 611, goal: 600 }, exercise: { value: 35, goal: 30 }, stand: { value: 10, goal: 12 } } },
  { day: "S", name: "Today", rings: { move: { value: 486, goal: 600 }, exercise: { value: 38, goal: 30 }, stand: { value: 10, goal: 12 } } },
]

const closed = (r: Rings) => [r.move, r.exercise, r.stand].filter((ring) => ring.value >= ring.goal).length

export default function WeeklyRings() {
  const option = React.useCallback(
    (theme: ChartTheme) => ({
      ...baseOption(theme),
      series: week.flatMap((d, i) =>
        ringSeries(theme, d.rings, { id: `day-${i}`, size: 38, center: [`${((i + 0.5) / week.length) * 100}%`, "50%"] })
      ),
    }),
    []
  )

  return (
    <ChartFrame
      title="Activity rings this week"
      summary={`You closed all three rings on ${week.filter((d) => closed(d.rings) === 3).length} of 7 days.`}
      table={{
        columns: ["Day", "Move (kcal)", "Exercise (min)", "Stand (hr)"],
        rows: week.map((d) => [d.name, `${d.rings.move.value} of ${d.rings.move.goal}`, `${d.rings.exercise.value} of ${d.rings.exercise.goal}`, `${d.rings.stand.value} of ${d.rings.stand.goal}`]),
      }}
      style={{ width: "100%", maxWidth: 420, gap: 6 }}
    >
      <EChart option={option} height={44} />
      <div aria-hidden="true" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", justifyItems: "center" }}>
        {week.map((d, i) => (
          <span
            key={i}
            style={{
              display: "grid",
              placeItems: "center",
              width: 22,
              height: 22,
              borderRadius: "50%",
              font: "var(--sd-text-footnote)",
              fontWeight: 600,
              color: i === week.length - 1 ? "var(--sd-bg)" : "var(--sd-label-secondary)",
              background: i === week.length - 1 ? "var(--sd-label)" : "transparent",
            }}
          >
            {d.day}
          </span>
        ))}
      </div>
    </ChartFrame>
  )
}
