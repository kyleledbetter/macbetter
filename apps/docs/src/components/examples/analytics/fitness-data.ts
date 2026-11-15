import type { ChartColor, Rings } from "@/components/charts"
import { mean, random, sum } from "./numbers"

/*
 * Fitness: one week of Activity, Sunday, November 8 to Saturday,
 * November 14, 2026, and the workouts in it. Each day's hours add up to its
 * rings, and a day's Exercise minutes always cover its workout.
 */

type WorkoutType = "run" | "walk" | "cycle" | "swim" | "strength" | "yoga"

type Workout = {
  id: string
  type: WorkoutType
  name: string
  /** Index of the day in `week`. */
  day: number
  /** Start, in hours after midnight. */
  start: number
  minutes: number
  calories: number
  /** Distance, or nothing for a workout without one. */
  distance?: string
}

const workouts: Workout[] = [
  { id: "w7", type: "run", name: "Outdoor Run", day: 6, start: 17, minutes: 42, calories: 486, distance: "5.10 mi" },
  { id: "w6", type: "walk", name: "Outdoor Walk", day: 5, start: 12.25, minutes: 38, calories: 164, distance: "2.02 mi" },
  { id: "w5", type: "yoga", name: "Yoga", day: 4, start: 7, minutes: 30, calories: 118 },
  { id: "w4", type: "cycle", name: "Outdoor Cycle", day: 3, start: 17.5, minutes: 64, calories: 612, distance: "18.2 mi" },
  { id: "w3", type: "strength", name: "Strength Training", day: 2, start: 6.67, minutes: 35, calories: 214 },
  { id: "w2", type: "walk", name: "Outdoor Walk", day: 1, start: 12.25, minutes: 46, calories: 198, distance: "2.41 mi" },
  { id: "w1", type: "swim", name: "Pool Swim", day: 0, start: 9.17, minutes: 28, calories: 236, distance: "1,150 yd" },
]

const goals = { move: 600, exercise: 30, stand: 12 }

const days: { date: Date; move: number; exercise: number; stand: number }[] = [
  { date: new Date(2026, 10, 8), move: 452, exercise: 33, stand: 9 },
  { date: new Date(2026, 10, 9), move: 655, exercise: 44, stand: 12 },
  { date: new Date(2026, 10, 10), move: 590, exercise: 39, stand: 11 },
  { date: new Date(2026, 10, 11), move: 942, exercise: 71, stand: 13 },
  { date: new Date(2026, 10, 12), move: 534, exercise: 34, stand: 12 },
  { date: new Date(2026, 10, 13), move: 611, exercise: 41, stand: 10 },
  { date: new Date(2026, 10, 14), move: 702, exercise: 49, stand: 10 },
]

/** How a waking hour's Move usually spreads, before workouts are added. */
const awake = [0, 0, 0, 0, 0, 0, 0.4, 0.9, 1, 0.8, 0.7, 0.9, 1.1, 0.8, 0.7, 0.7, 0.9, 1, 1, 0.8, 0.6, 0.4, 0.2, 0]

/** Spreads `total` over the hours by weight, in whole units, so the hours add back up to it. */
function spread(total: number, weights: number[]) {
  const all = sum(weights)
  if (all === 0) return weights.map(() => 0)
  const raw = weights.map((w) => Math.floor((w / all) * total))
  let left = total - sum(raw)
  const order = weights.map((w, i) => [w, i] as const).sort((a, b) => b[0] - a[0])
  for (let k = 0; left > 0; k = (k + 1) % order.length, left--) raw[order[k]![1]]!++
  return raw
}

type Day = (typeof days)[number] & {
  name: string
  letter: string
  rings: Rings
  hourly: { move: number[]; exercise: number[]; stood: number[] }
}

const week: Day[] = days.map((day, index) => {
  const next = random(index * 977 + 13)
  const session = workouts.find((w) => w.day === index)
  // Each workout's minutes and calories land in the hours it ran.
  const workoutMove = Array(24).fill(0) as number[]
  const workoutExercise = Array(24).fill(0) as number[]
  if (session) {
    let at = session.start
    const end = session.start + session.minutes / 60
    while (at < end - 1e-6) {
      const hour = Math.floor(at)
      const until = Math.min(end, hour + 1)
      const share = (until - at) / (session.minutes / 60)
      workoutMove[hour]! += Math.round(session.calories * share)
      workoutExercise[hour]! += Math.round(session.minutes * share)
      at = until
    }
  }
  const rest = spread(day.move - sum(workoutMove), awake.map((w) => w * (0.7 + next() * 0.6)))
  // Brisk walking makes up the Exercise minutes a workout didn't.
  const brisk = spread(Math.max(0, day.exercise - sum(workoutExercise)), awake.map((w, h) => (w > 0.85 && !workoutExercise[h] ? next() : 0)))
  const candidates = Array.from({ length: 16 }, (_, k) => 6 + k)
    .map((hour) => ({ hour, rank: (workoutMove[hour] ? 2 : 0) + next() }))
    .sort((a, b) => b.rank - a.rank)
    .slice(0, day.stand)
    .map((c) => c.hour)
  return {
    ...day,
    name: index === 6 ? "Today" : day.date.toLocaleDateString("en-US", { weekday: "long" }),
    letter: day.date.toLocaleDateString("en-US", { weekday: "narrow" }),
    rings: {
      move: { value: day.move, goal: goals.move },
      exercise: { value: day.exercise, goal: goals.exercise },
      stand: { value: day.stand, goal: goals.stand },
    },
    hourly: {
      move: rest.map((v, h) => v + workoutMove[h]!),
      exercise: brisk.map((v, h) => v + workoutExercise[h]!),
      stood: Array.from({ length: 24 }, (_, h) => (candidates.includes(h) ? 1 : 0)),
    },
  }
})

const closedAll = (rings: Rings) => [rings.move, rings.exercise, rings.stand].every((r) => r.value >= r.goal)

/* ── Heart rate during a workout ───────────────────────────────── */

/** Heart rate zones for this person, with Apple Watch's colors. */
const zones = [
  { name: "Zone 1", range: "<125 BPM", from: 0, color: "cyan" },
  { name: "Zone 2", range: "125–137 BPM", from: 125, color: "green" },
  { name: "Zone 3", range: "138–150 BPM", from: 138, color: "yellow" },
  { name: "Zone 4", range: "151–163 BPM", from: 151, color: "orange" },
  { name: "Zone 5", range: "164+ BPM", from: 164, color: "pink" },
] as const satisfies { name: string; range: string; from: number; color: ChartColor }[]

/** The shape of each kind of workout, in BPM at minute `t` of `length`. */
const profiles: Record<WorkoutType, (t: number, length: number) => number> = {
  run: (t, length) => {
    const base = t < 6 ? 108 + t * 6 : t < length - 6 ? 146 + Math.sin(t * 0.8) * 4 : 146 - (t - (length - 6)) * 5
    return base + ((t > 20 && t < 24) || (t > 28 && t < 32) ? 18 : 0)
  },
  walk: (t) => 96 + Math.min(t, 5) * 4 + Math.sin(t * 0.5) * 5,
  cycle: (t, length) => (t < 8 ? 112 + t * 4 : t < length - 5 ? 141 + Math.sin(t * 0.35) * 9 + (t > 34 && t < 40 ? 12 : 0) : 138 - (t - (length - 5)) * 4),
  swim: (t) => 118 + Math.min(t, 6) * 3 + Math.sin(t * 1.1) * 7,
  strength: (t) => 102 + (Math.floor(t / 3) % 2 === 0 ? 26 : 4) + Math.sin(t * 2.3) * 4,
  yoga: (t) => 84 + Math.sin(t * 0.4) * 8 + (t > 12 && t < 18 ? 10 : 0),
}

/** Every 30 seconds of a workout. */
function heartRate(workout: Workout) {
  const next = random(workout.id.charCodeAt(1) * 131)
  return Array.from({ length: workout.minutes * 2 + 1 }, (_, i) => Math.round(profiles[workout.type](i / 2, workout.minutes) + (next() - 0.5) * 4))
}

const zoneOf = (bpm: number) => zones.findLastIndex((z) => bpm >= z.from)

function zoneMinutes(series: number[]) {
  return zones.map((_, z) => series.slice(1).filter((bpm) => zoneOf(bpm) === z).length / 2)
}

const clock = (m: number) => `${Math.floor(m)}:${String(Math.round((m % 1) * 60)).padStart(2, "0")}`

/* ── Trends: the last 90 days against the last year ────────────── */

const months = ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"]

/** Daily averages by month, December 2025 to November 2026. */
const monthly = {
  move: [402, 418, 431, 452, 470, 488, 503, 511, 492, 508, 521, 641],
  exercise: [22, 24, 25, 27, 28, 30, 31, 33, 30, 34, 37, 44],
  stand: [11.8, 12.1, 12.2, 12.0, 12.3, 12.4, 12.1, 11.9, 12.0, 11.4, 11.2, 11.0],
  distance: [2.9, 3.0, 3.2, 3.4, 3.6, 3.9, 4.1, 4.3, 4.0, 4.1, 4.2, 4.4],
}

const trends = (
  [
    { key: "move", label: "Move", color: "var(--mb-chart-move)", unit: "KCAL/DAY", digits: 0 },
    { key: "exercise", label: "Exercise", color: "var(--mb-chart-exercise)", unit: "MIN/DAY", digits: 0 },
    { key: "stand", label: "Stand", color: "var(--mb-chart-stand)", unit: "HR/DAY", digits: 0 },
    { key: "distance", label: "Distance", color: "var(--mb-blue)", unit: "MI/DAY", digits: 1 },
  ] as const
).map((t) => {
  const values = monthly[t.key]
  const now = mean(values.slice(-3))
  const before = mean(values)
  return { ...t, now: now.toFixed(t.digits), before: before.toFixed(t.digits), up: +now.toFixed(t.digits) >= +before.toFixed(t.digits) }
})

export { clock, closedAll, goals, heartRate, monthly, months, trends, week, workouts, zoneMinutes, zoneOf, zones }
export type { Day, Workout, WorkoutType }
