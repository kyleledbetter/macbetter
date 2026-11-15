import type { ChartColor } from "@/components/charts"
import { chunk, daysBefore, hourLabel, hourSpan, mean, random, sum } from "./numbers"

/*
 * Health: two years of daily readings for one person, ending Saturday,
 * November 14, 2026. Each period's bars are built from the same days, so a
 * week's steps add up to that week's days, the 6M and Y bars are true
 * averages, and today's hourly steps add up to today's total.
 */

type HealthPeriod = "D" | "W" | "M" | "6M" | "Y"

const healthPeriods: { value: HealthPeriod; label: string; long: string }[] = [
  { value: "D", label: "D", long: "Day" },
  { value: "W", label: "W", long: "Week" },
  { value: "M", label: "M", long: "Month" },
  { value: "6M", label: "6M", long: "6 months" },
  { value: "Y", label: "Y", long: "Year" },
]

const today = new Date(2026, 10, 14)
const DAYS = 730
const dates = Array.from({ length: DAYS }, (_, i) => daysBefore(today, DAYS - 1 - i))

const next = random(2026)

/* ── Daily readings ────────────────────────────────────────────── */

/** Steps a day: more in summer, more this year than last, fewer on Sundays. */
const steps = dates.map((date, i) => {
  const season = Math.sin(((date.getMonth() + date.getDate() / 31 - 3) / 12) * Math.PI * 2) * 900
  const year = i > DAYS - 366 ? 1100 : 0
  const weekday = [-1400, 600, 200, 900, 300, 100, -600][date.getDay()]!
  return Math.max(1800, Math.round(7100 + season + year + weekday + (next() - 0.5) * 4200))
})

/** Hour-by-hour shape of a Saturday: a morning walk, errands at noon, an evening walk. */
const saturday = [0, 0, 0, 0, 0, 0, 0.012, 0.09, 0.15, 0.04, 0.022, 0.067, 0.124, 0.047, 0.031, 0.028, 0.102, 0.171, 0.075, 0.019, 0.013, 0.009, 0, 0]
const todaySteps = steps[DAYS - 1]!
const hourlySteps = (() => {
  const raw = saturday.map((share) => Math.round(share * todaySteps))
  // Rounding can leave a few steps over or under; the busiest hour absorbs them.
  raw[17]! += todaySteps - sum(raw)
  return raw
})()

/** The lowest and highest heart rate each day; days with a workout run higher. */
const heartRate = dates.map((date) => {
  const workout = [1, 3, 6].includes(date.getDay()) || next() < 0.18
  return {
    low: Math.round(49 + next() * 6),
    high: Math.round(workout ? 138 + next() * 30 : 104 + next() * 22),
  }
})

/** Today, hour by hour: asleep until 7, a walk at 8, a run at 5 PM. */
const hourlyHeart = {
  low: [54, 52, 53, 55, 53, 56, 58, 66, 72, 70, 68, 71, 74, 69, 67, 70, 88, 96, 78, 72, 68, 64, 60, 57],
  high: [61, 58, 60, 62, 59, 63, 74, 112, 104, 88, 92, 96, 102, 94, 90, 98, 142, 151, 118, 96, 88, 80, 72, 64],
}
heartRate[DAYS - 1] = { low: Math.min(...hourlyHeart.low), high: Math.max(...hourlyHeart.high) }

/** Resting heart rate, drifting down as fitness improves. */
const resting = dates.map((_, i) => {
  const t = i - (DAYS - 90)
  return Math.round(59.5 - t * 0.045 + Math.sin(i * 1.7) * 1.6 + Math.sin(i * 0.31) * 1.1 + (i % 7 === 5 ? 1.5 : 0))
})

/** Hours asleep each night, ending with last night's 7 hr 28 min. */
const sleepHours = dates.map((_, i) => +(6.9 + Math.sin(i * 0.9) * 0.45 + (next() - 0.5) * 0.8).toFixed(2))

const flights = dates.map(() => Math.round(4 + next() * 16))
const weight = dates.map((_, i) => +(171.2 - Math.max(0, i - (DAYS - 60)) * 0.047 + Math.sin(i * 1.3) * 0.25).toFixed(1))

/* ── Periods ───────────────────────────────────────────────────── */

const short = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" })
const weekdayDate = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" })

type Bucket = { label: string; name: string; days: number[] }

/** The days behind each bar of a period, as indexes into the daily arrays. */
function buckets(period: Exclude<HealthPeriod, "D">): Bucket[] {
  const last = DAYS - 1
  if (period === "W") {
    // Health's week runs Sunday to Saturday.
    return Array.from({ length: 7 }, (_, i) => {
      const day = last - 6 + i
      return { label: dates[day]!.toLocaleDateString("en-US", { weekday: "short" }), name: i === 6 ? "Today" : weekdayDate.format(dates[day]!), days: [day] }
    })
  }
  if (period === "M") {
    return Array.from({ length: 30 }, (_, i) => {
      const day = last - 29 + i
      return { label: i % 7 === 0 ? String(dates[day]!.getDate()) : "", name: i === 29 ? "Today" : weekdayDate.format(dates[day]!), days: [day] }
    })
  }
  if (period === "6M") {
    const indexes = Array.from({ length: 182 }, (_, i) => last - 181 + i)
    return chunk(indexes, 7).map((days) => {
      const start = dates[days[0]!]!
      return { label: start.getDate() <= 7 ? start.toLocaleDateString("en-US", { month: "short" }) : "", name: `Week of ${short.format(start)}`, days }
    })
  }
  return Array.from({ length: 12 }, (_, m) => {
    const month = new Date(today.getFullYear(), today.getMonth() - 11 + m, 1)
    const days = dates.flatMap((date, i) => (date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth() ? [i] : []))
    return {
      label: month.toLocaleDateString("en-US", { month: "narrow" }),
      name: month.toLocaleDateString("en-US", { month: "long", year: m === 0 || m === 11 ? "numeric" : undefined }),
      days,
    }
  })
}

const dayLabels = Array.from({ length: 24 }, (_, h) => (h % 6 === 0 ? (h % 12 === 0 ? hourLabel(h) : String(h % 12)) : ""))
const dayNames = Array.from({ length: 24 }, (_, h) => hourSpan(h))

const span = (days: number) => `${short.format(dates[DAYS - days]!)}–${short.format(today)}, ${today.getFullYear()}`
const rangeText: Record<HealthPeriod, string> = {
  D: "Today",
  W: span(7),
  M: span(30),
  "6M": span(182),
  Y: "Dec 2025–Nov 2026",
}

type StepSeries = { labels: string[]; names: string[]; values: number[]; range: string; ticks: number[] }

/** Steps for a period: hourly counts for D, daily totals for W and M, daily averages for 6M and Y. */
function stepsFor(period: HealthPeriod): StepSeries {
  if (period === "D") return { labels: dayLabels, names: dayNames, values: hourlySteps, range: rangeText.D, ticks: [6, 12, 18] }
  const list = buckets(period)
  return {
    labels: list.map((b) => b.label),
    names: list.map((b) => b.name),
    values: list.map((b) => Math.round(mean(b.days.map((d) => steps[d]!)))),
    range: rangeText[period],
    ticks: list.flatMap((b, i) => (b.label && i > 0 ? [i] : [])),
  }
}

type HeartSeries = { labels: string[]; names: string[]; low: number[]; high: number[]; range: string; ticks: number[] }

/** Heart rate ranges for a period: the lowest and highest reading in each hour, day, week or month. */
function heartFor(period: HealthPeriod): HeartSeries {
  if (period === "D") return { labels: dayLabels, names: dayNames, ...hourlyHeart, range: rangeText.D, ticks: [6, 12, 18] }
  const list = buckets(period)
  return {
    labels: list.map((b) => b.label),
    names: list.map((b) => b.name),
    low: list.map((b) => Math.min(...b.days.map((d) => heartRate[d]!.low))),
    high: list.map((b) => Math.max(...b.days.map((d) => heartRate[d]!.high))),
    range: rangeText[period],
    ticks: period === "W" ? [] : list.flatMap((b, i) => (b.label && i > 0 ? [i] : [])),
  }
}

/* ── Sleep: Friday night into Saturday ─────────────────────────── */

const stages = [
  { name: "Deep", color: "deep" },
  { name: "Core", color: "core" },
  { name: "REM", color: "rem" },
  { name: "Awake", color: "awake" },
] as const satisfies { name: string; color: ChartColor }[]

type Stage = (typeof stages)[number]["name"]

/** Each stage with its start and end, in minutes after 10 PM. */
const night: [Stage, number, number][] = [
  ["Awake", 60, 68], ["Core", 68, 92], ["Deep", 92, 134], ["Core", 134, 170], ["REM", 170, 192],
  ["Core", 192, 228], ["Deep", 228, 258], ["Core", 258, 292], ["Awake", 292, 297], ["Core", 297, 334],
  ["REM", 334, 368], ["Core", 368, 404], ["Deep", 404, 420], ["Core", 420, 452], ["REM", 452, 488],
  ["Awake", 488, 492], ["Core", 492, 512], ["REM", 512, 520], ["Awake", 520, 528],
]

const stageTotals = Object.fromEntries(
  stages.map((s) => [s.name, sum(night.filter(([stage]) => stage === s.name).map(([, a, b]) => b - a))])
) as Record<Stage, number>
const asleep = stageTotals.Deep + stageTotals.Core + stageTotals.REM
sleepHours[DAYS - 1] = +(asleep / 60).toFixed(2)

const clock = (minutes: number) => {
  const h = (22 + Math.floor(minutes / 60)) % 24
  return `${h % 12 || 12}:${String(minutes % 60).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`
}
const duration = (minutes: number) => (minutes >= 60 ? `${Math.floor(minutes / 60)} hr ${Math.round(minutes % 60)} min` : `${Math.round(minutes)} min`)

/* ── Resting heart rate, last 90 days ──────────────────────────── */

const trendDays = dates.slice(-90).map((date, i) => ({ date, bpm: resting[DAYS - 90 + i]! }))
const trendWeekly = trendDays.map((_, i) => {
  const window = trendDays.slice(Math.max(0, i - 6), i + 1)
  return +mean(window.map((d) => d.bpm)).toFixed(1)
})
const trendMean = mean(trendDays.map((d) => d.bpm))
const typical = [Math.round(trendMean - 2.5), Math.round(trendMean + 2.5)] as const

/* ── Summary: highlights and favorites ─────────────────────────── */

const inMonth = (year: number, month: number) => dates.flatMap((d, i) => (d.getFullYear() === year && d.getMonth() === month ? [i] : []))
const inYear = (year: number) => dates.flatMap((d, i) => (d.getFullYear() === year ? [i] : []))

const highlights = (() => {
  const thisYear = Math.round(mean(inYear(2026).map((i) => steps[i]!)))
  const lastYear = Math.round(mean(inYear(2025).map((i) => steps[i]!)))
  const november = Math.round(mean(inMonth(2026, 10).map((i) => resting[i]!)))
  const october = Math.round(mean(inMonth(2026, 9).map((i) => resting[i]!)))
  return [
    {
      id: "steps",
      category: "Steps",
      color: "var(--mb-orange)",
      when: "Today",
      headline:
        thisYear > lastYear
          ? "You’re averaging more steps a day this year than you did last year."
          : "You’re averaging fewer steps a day this year than you did last year.",
      unit: "steps/day",
      bars: [
        { label: "2026", value: thisYear },
        { label: "2025", value: lastYear },
      ],
    },
    {
      id: "resting",
      category: "Resting Heart Rate",
      color: "var(--mb-pink)",
      when: "Yesterday",
      headline:
        november < october
          ? "Your resting heart rate is lower this month than it was last month."
          : "Your resting heart rate is about the same as last month.",
      unit: "BPM",
      bars: [
        { label: "November", value: november },
        { label: "October", value: october },
      ],
    },
  ]
})()

const last14 = <T,>(values: T[]) => values.slice(-14)
const miles = (count: number) => +(count / 2150).toFixed(2)

type Favorite = {
  id: string
  label: string
  color: ChartColor
  css: string
  time: string
  value: string
  unit: string
  values: number[]
  trend: string
}

function change(values: number[], unit: string, digits = 0) {
  const recent = mean(values.slice(-7))
  const before = mean(values.slice(0, 7))
  const delta = recent - before
  if (Math.abs(delta) < 10 ** -digits * 5) return "About the same as the week before"
  return `${delta > 0 ? "Up" : "Down"} ${Math.abs(delta).toFixed(digits)} ${unit} from the week before`
}

const favorites: Favorite[] = [
  {
    id: "steps",
    label: "Steps",
    color: "orange",
    css: "var(--mb-orange)",
    time: "9:41 PM",
    value: todaySteps.toLocaleString("en-US"),
    unit: "steps",
    values: last14(steps),
    trend: change(last14(steps), "steps a day"),
  },
  {
    id: "distance",
    label: "Walking + Running Distance",
    color: "orange",
    css: "var(--mb-orange)",
    time: "9:41 PM",
    value: miles(todaySteps).toFixed(1),
    unit: "mi",
    values: last14(steps).map(miles),
    trend: change(last14(steps).map(miles), "mi a day", 1),
  },
  {
    id: "flights",
    label: "Flights Climbed",
    color: "orange",
    css: "var(--mb-orange)",
    time: "6:12 PM",
    value: String(flights[DAYS - 1]),
    unit: "floors",
    values: last14(flights),
    trend: change(last14(flights), "floors a day"),
  },
  {
    id: "resting",
    label: "Resting Heart Rate",
    color: "pink",
    css: "var(--mb-pink)",
    time: "7:02 AM",
    value: String(resting[DAYS - 1]),
    unit: "BPM",
    values: last14(resting),
    trend: change(last14(resting), "BPM"),
  },
  {
    id: "sleep",
    label: "Time Asleep",
    color: "core",
    css: "var(--mb-chart-core)",
    time: "6:48 AM",
    value: `${Math.floor(asleep / 60)} hr ${asleep % 60}`,
    unit: "min",
    values: last14(sleepHours),
    trend: change(last14(sleepHours), "hr a night", 1),
  },
  {
    id: "weight",
    label: "Weight",
    color: "purple",
    css: "var(--mb-purple)",
    time: "7:15 AM",
    value: String(weight[DAYS - 1]),
    unit: "lb",
    values: last14(weight),
    trend: change(last14(weight), "lb", 1),
  },
]

export {
  asleep,
  clock,
  duration,
  favorites,
  healthPeriods,
  heartFor,
  highlights,
  night,
  stageTotals,
  stages,
  stepsFor,
  trendDays,
  trendMean,
  trendWeekly,
  typical,
}
export type { Favorite, HealthPeriod, HeartSeries, Stage, StepSeries }
