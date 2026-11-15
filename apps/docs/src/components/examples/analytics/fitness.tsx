"use client"

import { Card } from "macbetter/card"
import { Listbox, ListboxItem } from "macbetter/listbox"
import { ArrowDownIcon, ArrowUpIcon, BikeIcon, DumbbellIcon, Flower2Icon, FootprintsIcon, TimerIcon, WavesIcon } from "lucide-react"
import * as React from "react"
import { ActivityRings, ChartFrame } from "@/components/charts"
import { ExerciseYear, HourlyStrips, WorkoutZones } from "./fitness-charts"
import { closedAll, trends, week, workouts, type Day, type WorkoutType } from "./fitness-data"
import "./fitness.css"

/*
 * Fitness, in the manner of the Fitness app: the day's rings large, with
 * their totals in the rings' colors, the hours behind them, a week of rings
 * to choose a day from, the workouts with the heart rate zones of the one
 * you pick, and trends drawn as arrows.
 */

type Icon = React.ComponentType<React.SVGProps<SVGSVGElement>>
const workoutIcons: Record<WorkoutType, Icon> = {
  run: TimerIcon,
  walk: FootprintsIcon,
  cycle: BikeIcon,
  swim: WavesIcon,
  strength: DumbbellIcon,
  yoga: Flower2Icon,
}

const ringRows = [
  { key: "move", label: "Move", unit: "KCAL", color: "var(--mb-chart-move)" },
  { key: "exercise", label: "Exercise", unit: "MIN", color: "var(--mb-chart-exercise)" },
  { key: "stand", label: "Stand", unit: "HRS", color: "var(--mb-chart-stand)" },
] as const

const longDate = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" })
const dayName = (day: Day) => (day.name === "Today" ? "Today" : longDate.format(day.date))

/** Which rings a day closed, in words. */
function closedSummary(day: Day) {
  const closed = ringRows.filter(({ key }) => day.rings[key].value >= day.rings[key].goal).map((r) => r.label)
  if (closed.length === 3) return "All three rings closed"
  if (closed.length === 0) return "No rings closed yet"
  return `${closed.join(" and ")} closed`
}

function Rings({ day, compact }: { day: Day; compact?: boolean }) {
  return (
    <ChartFrame
      title={`Activity rings, ${dayName(day)}`}
      summary={ringRows
        .map(({ key, label, unit }) => `${label} ${day.rings[key].value} of ${day.rings[key].goal} ${unit.toLowerCase()}, ${Math.round((day.rings[key].value / day.rings[key].goal) * 100)}%`)
        .join(". ")}
      className="ex-fit-rings"
    >
      <ActivityRings rings={day.rings} size={compact ? 150 : 176} />
      <dl>
        {ringRows.map(({ key, label, unit, color }) => (
          <div key={key}>
            <dt>{label}</dt>
            <dd style={{ color }}>
              {day.rings[key].value}/{day.rings[key].goal}
              <span> {unit}</span>
            </dd>
          </div>
        ))}
      </dl>
    </ChartFrame>
  )
}

function Week({ value, onValueChange, compact }: { value: number; onValueChange: (index: number) => void; compact?: boolean }) {
  const closed = week.filter((d) => closedAll(d.rings)).length
  return (
    <ChartFrame
      title="Activity rings this week"
      summary={`You closed all three rings on ${closed} of 7 days.`}
      table={{
        columns: ["Day", "Move (kcal)", "Exercise (min)", "Stand (hr)"],
        rows: week.map((d) => [dayName(d), `${d.move} of ${d.rings.move.goal}`, `${d.exercise} of ${d.rings.exercise.goal}`, `${d.stand} of ${d.rings.stand.goal}`]),
      }}
      className="ex-fit-week"
    >
      <Listbox
        aria-label="Day"
        orientation="horizontal"
        className="ex-fit-days"
        value={String(value)}
        onValueChange={(next) => next !== null && onValueChange(Number(next))}
      >
        {week.map((d, i) => (
          <ListboxItem key={i} value={String(i)} className="ex-fit-day" aria-label={`${dayName(d)}${closedAll(d.rings) ? ", all rings closed" : ""}`}>
            <ActivityRings rings={d.rings} size={compact ? 38 : 52} />
            <span className="ex-fit-day-letter">{d.letter}</span>
          </ListboxItem>
        ))}
      </Listbox>
      <p className="ex-fit-week-note">
        All three rings closed on {closed} of 7 days
      </p>
    </ChartFrame>
  )
}

function Workouts({ value, onValueChange, query }: { value: string; onValueChange: (id: string) => void; query: string }) {
  const needle = query.trim().toLowerCase()
  const shown = workouts.filter((w) => !needle || w.name.toLowerCase().includes(needle))
  if (!shown.length) return <p className="ex-fit-empty">No workouts match “{query.trim()}”.</p>
  return (
    <Listbox aria-label="Workouts" className="ex-fit-workouts" value={value} onValueChange={(next) => next && onValueChange(next as string)}>
      {shown.map((w) => {
        const Glyph = workoutIcons[w.type]
        const day = week[w.day]!
        return (
          <ListboxItem key={w.id} value={w.id} className="ex-fit-workout">
            <span className="ex-fit-workout-icon" aria-hidden="true">
              <Glyph />
            </span>
            <span className="ex-fit-workout-name">
              <strong>{w.name}</strong>
              <span>
                {w.distance ? `${w.distance} · ` : ""}
                {w.minutes} min
              </span>
            </span>
            <span className="ex-fit-workout-meta">
              <strong>
                {w.calories}
                <span> KCAL</span>
              </strong>
              <span>{day.name === "Today" ? "Today" : day.date.toLocaleDateString("en-US", { weekday: "short" })}</span>
            </span>
          </ListboxItem>
        )
      })}
    </Listbox>
  )
}

function Trends() {
  return (
    <ul aria-label="Trends, last 90 days compared with the last year" className="ex-fit-trends">
      {trends.map((t) => {
        const Arrow = t.up ? ArrowUpIcon : ArrowDownIcon
        return (
          <li key={t.label} style={{ "--ex-trend": t.color } as React.CSSProperties}>
            {/* Going down is drawn as an outline, so it doesn't rely on color alone. */}
            <span className="ex-fit-arrow" data-direction={t.up ? "up" : "down"} aria-hidden="true">
              <Arrow strokeWidth={3} />
            </span>
            <span className="ex-fit-trend-value">
              <span>{t.label}</span>
              <strong>
                {t.now}
                <span> {t.unit}</span>
              </strong>
            </span>
            <span className="ex-fit-trend-note">
              {t.up ? "Up" : "Down"} from {t.before}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

function FitnessScreen({ query, compact }: { query: string; compact?: boolean }) {
  const [dayIndex, setDayIndex] = React.useState(6)
  const [workoutId, setWorkoutId] = React.useState("w7")
  const day = week[dayIndex]!
  const workout = workouts.find((w) => w.id === workoutId) ?? workouts[0]!
  const selectDay = (index: number) => {
    setDayIndex(index)
    const session = workouts.find((w) => w.day === index)
    if (session) setWorkoutId(session.id)
  }
  const selectWorkout = (id: string) => {
    setWorkoutId(id)
    setDayIndex(workouts.find((w) => w.id === id)!.day)
  }
  const ids = { workouts: React.useId(), trends: React.useId() }

  return (
    <div className="ex-fit" data-compact={compact ? "" : undefined}>
      <Card className="ex-fit-hero">
        <div className="ex-fit-hero-head">
          <h2>{dayName(day)}</h2>
          <span>{closedSummary(day)}</span>
        </div>
        <Rings day={day} compact={compact} />
      </Card>
      <Card className="ex-fit-hours">
        <HourlyStrips day={day} />
      </Card>
      <Card className="ex-fit-weekcard">
        <Week value={dayIndex} onValueChange={selectDay} compact={compact} />
      </Card>
      <section className="ex-fit-panel ex-fit-list" aria-labelledby={ids.workouts}>
        <h2 id={ids.workouts} className="ex-fit-heading">
          Workouts
        </h2>
        <Workouts value={workoutId} onValueChange={selectWorkout} query={query} />
      </section>
      <Card className="ex-fit-detail">
        <div className="ex-fit-detail-head">
          <h3>{workout.name}</h3>
          <span>
            {dayName(week[workout.day]!)} · {workout.minutes} min · {workout.calories} kcal
          </span>
        </div>
        <WorkoutZones workout={workout} compact={compact} />
      </Card>
      <section className="ex-fit-panel" aria-labelledby={ids.trends}>
        <h2 id={ids.trends} className="ex-fit-heading">
          Trends
        </h2>
        <p className="ex-fit-sub">Last 90 days compared with the last year</p>
        <Trends />
      </section>
      <Card className="ex-fit-yearcard">
        <ExerciseYear height={compact ? 150 : 170} />
      </Card>
    </div>
  )
}

export { FitnessScreen }
