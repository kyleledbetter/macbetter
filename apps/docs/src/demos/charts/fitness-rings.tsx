import { ActivityRings, ChartFrame } from "@/components/charts"

/** Today's rings. Exercise is past its goal, so its ring laps itself. */
const today = {
  move: { value: 486, goal: 600 },
  exercise: { value: 38, goal: 30 },
  stand: { value: 10, goal: 12 },
}

const rows = [
  { key: "move", label: "Move", unit: "KCAL", color: "var(--sd-chart-move)" },
  { key: "exercise", label: "Exercise", unit: "MIN", color: "var(--sd-chart-exercise)" },
  { key: "stand", label: "Stand", unit: "HRS", color: "var(--sd-chart-stand)" },
] as const

export default function ActivityRingsSummary() {
  return (
    <ChartFrame
      title="Activity rings, today"
      summary={rows
        .map(({ key, label, unit }) => `${label} ${today[key].value} of ${today[key].goal} ${unit.toLowerCase()}, ${Math.round((today[key].value / today[key].goal) * 100)}%`)
        .join(". ")}
      style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 28 }}
    >
      <ActivityRings rings={today} size={168} />
      <dl style={{ display: "grid", gap: 10, margin: 0 }}>
        {rows.map(({ key, label, unit, color }) => (
          <div key={key}>
            <dt style={{ font: "var(--sd-text-subheadline)", fontWeight: 600 }}>{label}</dt>
            <dd style={{ margin: 0, color, font: "var(--sd-text-title-2)", fontFamily: "var(--sd-font-rounded)", fontVariantNumeric: "tabular-nums" }}>
              {today[key].value}/{today[key].goal}
              <span style={{ font: "var(--sd-text-subheadline)", fontFamily: "var(--sd-font-rounded)", fontWeight: 600 }}> {unit}</span>
            </dd>
          </div>
        ))}
      </dl>
    </ChartFrame>
  )
}
