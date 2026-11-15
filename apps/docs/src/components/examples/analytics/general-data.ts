import type { ChartColor } from "@/components/charts"
import { chunk, daysBefore, mean, random, sum } from "./numbers"

/*
 * Reports, the general-purpose charts: a subscription business's last two
 * years, a day at a time, ending Saturday, November 14, 2026. Revenue, new
 * accounts and churn all come from the same days, so the KPI cards, the
 * lines, the stacked bars, the donut and the goals agree with each other.
 */

type GeneralRange = "7D" | "30D" | "90D" | "12M"

const generalRanges: { value: GeneralRange; label: string; long: string }[] = [
  { value: "7D", label: "7D", long: "Last 7 days" },
  { value: "30D", label: "30D", long: "Last 30 days" },
  { value: "90D", label: "90D", long: "Last 90 days" },
  { value: "12M", label: "12M", long: "Last 12 months" },
]

const today = new Date(2026, 10, 14)
const DAYS = 730
const dates = Array.from({ length: DAYS }, (_, i) => daysBefore(today, DAYS - 1 - i))
const next = random(4242)

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
const compactCurrency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 })
const percent = (value: number) => `${value >= 0 ? "+" : "−"}${Math.abs(value * 100).toFixed(1)}%`

/* ── Plans and channels ────────────────────────────────────────── */

const plans = [
  { key: "enterprise", label: "Enterprise", color: "series1", css: "var(--mb-chart-1)", start: 98_000, end: 186_400, steps: 0.6 },
  { key: "team", label: "Team", color: "series2", css: "var(--mb-chart-2)", start: 71_000, end: 127_900, steps: 0 },
  { key: "starter", label: "Starter", color: "series4", css: "var(--mb-chart-4)", start: 31_500, end: 46_200, steps: 0 },
] as const satisfies { key: string; label: string; color: ChartColor; css: string; start: number; end: number; steps: number }[]

type PlanKey = (typeof plans)[number]["key"]

/** Monthly recurring revenue per plan, each day. Enterprise moves in steps, as deals close. */
const mrr = Object.fromEntries(
  plans.map((plan) => {
    let deals = 0
    const raw = dates.map((_, i) => {
      if (plan.steps && next() < 0.03) deals += (next() - 0.3) * 0.02
      const t = i / (DAYS - 1)
      return plan.start * (plan.end / plan.start) ** t * (1 + deals + Math.sin(i * 0.21) * 0.006 + (next() - 0.5) * 0.004)
    })
    // Pins the last day to the plan's current MRR.
    const scale = plan.end / raw.at(-1)!
    return [plan.key, raw.map((v) => Math.round(v * scale))]
  })
) as Record<PlanKey, number[]>

const totalMrr = dates.map((_, i) => sum(plans.map((p) => mrr[p.key][i]!)))

const channels = [
  { key: "organic", label: "Organic", color: "teal", css: "var(--mb-teal)", rate: 3.4 },
  { key: "paid", label: "Paid", color: "indigo", css: "var(--mb-indigo)", rate: 2.1 },
  { key: "referral", label: "Referral", color: "pink", css: "var(--mb-pink)", rate: 1.2 },
] as const satisfies { key: string; label: string; color: ChartColor; css: string; rate: number }[]

type ChannelKey = (typeof channels)[number]["key"]

/** New accounts a day by channel: fewer on weekends, growing over time. */
const signups = Object.fromEntries(
  channels.map((channel) => [
    channel.key,
    dates.map((date, i) => {
      const weekend = date.getDay() === 0 || date.getDay() === 6 ? 0.45 : 1.12
      const growth = 0.8 + (i / DAYS) * 0.5
      return Math.max(0, Math.round(channel.rate * weekend * growth * (0.55 + next() * 0.9)))
    }),
  ])
) as Record<ChannelKey, number[]>

const newAccounts = dates.map((_, i) => sum(channels.map((c) => signups[c.key][i]!)))
const churned = dates.map(() => (next() < 0.42 ? 1 : 0) + (next() < 0.32 ? 1 : 0) + (next() < 0.12 ? 1 : 0))
const accounts = (() => {
  let count = 2_410
  return dates.map((_, i) => (count += newAccounts[i]! - churned[i]!))
})()

/* ── Ranges ────────────────────────────────────────────────────── */

const short = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" })

type Bucket = { label: string; name: string; days: number[] }

function buckets(range: GeneralRange): Bucket[] {
  const last = DAYS - 1
  if (range === "7D" || range === "30D") {
    const n = range === "7D" ? 7 : 30
    return Array.from({ length: n }, (_, i) => {
      const day = last - n + 1 + i
      const date = dates[day]!
      return {
        label: n === 7 ? date.toLocaleDateString("en-US", { weekday: "short" }) : short.format(date),
        name: short.format(date),
        days: [day],
      }
    })
  }
  if (range === "90D") {
    return chunk(
      Array.from({ length: 91 }, (_, i) => last - 90 + i),
      7
    ).map((days) => ({ label: short.format(dates[days[0]!]!), name: `Week of ${short.format(dates[days[0]!]!)}`, days }))
  }
  return Array.from({ length: 12 }, (_, m) => {
    const month = new Date(today.getFullYear(), today.getMonth() - 11 + m, 1)
    const days = dates.flatMap((date, i) => (date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth() ? [i] : []))
    return {
      label: month.toLocaleDateString("en-US", { month: "short" }),
      name: m === 11 ? `${month.toLocaleDateString("en-US", { month: "long" })}, to Nov 14` : month.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      days,
    }
  })
}

const length: Record<Exclude<GeneralRange, "12M">, number> = { "7D": 7, "30D": 30, "90D": 91 }

/** Everything the dashboard draws for one range. */
function report(range: GeneralRange) {
  const list = buckets(range)
  // 12M runs from the first of the month eleven months back, so the KPIs, the monthly bars and the calendar share one window.
  const n = range === "12M" ? list.reduce((total, b) => total + b.days.length, 0) : length[range]
  const window = Array.from({ length: n }, (_, i) => DAYS - n + i)
  const before = window.map((d) => d - n)
  const startDay = window[0]! - 1
  const end = DAYS - 1

  // Lines and sparklines read each bucket's last day: MRR is a balance, not a flow.
  const lineRows = list.map((b) => {
    const day = b.days.at(-1)!
    return { label: b.label, name: b.name, ...Object.fromEntries(plans.map((p) => [p.key, mrr[p.key][day]!])) } as { label: string; name: string } & Record<PlanKey, number>
  })
  const stackRows = list.map((b) => ({
    label: b.label,
    name: b.name,
    ...Object.fromEntries(channels.map((c) => [c.key, sum(b.days.map((d) => signups[c.key][d]!))])),
  })) as ({ label: string; name: string } & Record<ChannelKey, number>)[]

  const added = sum(window.map((d) => newAccounts[d]!))
  const addedBefore = sum(before.map((d) => newAccounts[d]!))
  const lost = sum(window.map((d) => churned[d]!))
  const lostBefore = sum(before.map((d) => churned[d]!))
  const churnRate = (lost / accounts[startDay]!) * 100
  const churnBefore = (lostBefore / accounts[Math.max(0, startDay - n)]!) * 100
  const mrrNow = totalMrr[end]!
  const mrrStart = totalMrr[startDay]!

  const spark = (values: number[]) => list.map((b) => mean(b.days.map((d) => values[d]!)))
  const kpis = [
    {
      id: "mrr",
      label: "Monthly recurring revenue",
      short: "MRR",
      value: currency.format(mrrNow),
      change: `${percent(mrrNow / mrrStart - 1)}`,
      direction: mrrNow >= mrrStart ? "up" : "down",
      good: mrrNow >= mrrStart,
      trend: spark(totalMrr),
      detail: `from ${currency.format(mrrStart)}`,
    },
    {
      id: "new",
      label: "New accounts",
      short: "New accounts",
      value: added.toLocaleString("en-US"),
      change: percent(added / addedBefore - 1),
      direction: added >= addedBefore ? "up" : "down",
      good: added >= addedBefore,
      trend: spark(newAccounts),
      detail: `vs. ${addedBefore.toLocaleString("en-US")} before`,
    },
    {
      id: "active",
      label: "Active accounts",
      short: "Active accounts",
      value: accounts[end]!.toLocaleString("en-US"),
      change: `${accounts[end]! - accounts[startDay]! >= 0 ? "+" : "−"}${Math.abs(accounts[end]! - accounts[startDay]!).toLocaleString("en-US")}`,
      direction: accounts[end]! >= accounts[startDay]! ? "up" : "down",
      good: accounts[end]! >= accounts[startDay]!,
      trend: spark(accounts),
      detail: `from ${accounts[startDay]!.toLocaleString("en-US")}`,
    },
    {
      id: "churn",
      label: "Churn rate",
      short: "Churn rate",
      value: `${churnRate.toFixed(churnRate < 1 ? 2 : 1)}%`,
      change: `${churnRate - churnBefore >= 0 ? "+" : "−"}${Math.abs(churnRate - churnBefore).toFixed(2)} pts`,
      direction: churnRate >= churnBefore ? "up" : "down",
      good: churnRate <= churnBefore,
      trend: spark(churned),
      detail: `${lost} accounts lost`,
    },
  ] as const

  return { list, lineRows, stackRows, kpis, added, mrrNow, mrrStart }
}

/* ── Where revenue comes from, right now ───────────────────────── */

const current = Object.fromEntries(plans.map((p) => [p.key, mrr[p.key][DAYS - 1]!])) as Record<PlanKey, number>
const mrrNow = totalMrr[DAYS - 1]!

/** MRR by region, as shares of today's total that add back up to it. */
const regions = (() => {
  const shares = [
    ["North America", 0.452],
    ["Europe", 0.318],
    ["Asia Pacific", 0.141],
    ["Latin America", 0.058],
    ["Middle East & Africa", 0.031],
  ] as const
  const rows = shares.map(([region, share]) => ({ region, mrr: Math.round(mrrNow * share) }))
  rows[0]!.mrr += mrrNow - sum(rows.map((r) => r.mrr))
  return rows
})()

/** A year of new accounts per day, for the calendar heatmap. */
const yearStart = dates.findIndex((d) => d.getFullYear() === today.getFullYear() - 1 && d.getMonth() === today.getMonth() + 1 && d.getDate() === 1)
const calendar = dates.slice(yearStart).map((date, i) => ({
  date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
  value: newAccounts[yearStart + i]!,
}))

/* ── Quarter goals ─────────────────────────────────────────────── */

const quarterStart = dates.findIndex((d) => d.getFullYear() === 2026 && d.getMonth() === 9 && d.getDate() === 1)
const quarterAdded = sum(newAccounts.slice(quarterStart))
const retention = 1.064
const goals = [
  { key: "mrr", label: "MRR", actual: currency.format(mrrNow), target: currency.format(400_000), percent: Math.round((mrrNow / 400_000) * 100) },
  { key: "accounts", label: "New accounts", actual: quarterAdded.toLocaleString("en-US"), target: "700", percent: Math.round((quarterAdded / 700) * 100) },
  { key: "retention", label: "Net retention", actual: `${(retention * 100).toFixed(1)}%`, target: "110%", percent: Math.round((retention / 1.1) * 100) },
]

/* ── Accounts ──────────────────────────────────────────────────── */

const names = [
  "Bluebird Bakery Co.", "Halvorsen & Lund", "Pinecrest Clinics", "Arroyo Logistics", "Quarry Lane Studio", "Tessellate Labs",
  "Marlowe Dental Group", "Copperline Rail", "Oakhaven Schools", "Fjordline Travel", "Sundial Solar", "Wrenfield Legal",
  "Kettle & Pine", "Larkspur Health", "Ironbark Builders", "Mosaic Kitchens", "Tidewater Marine", "Brightloom Textiles",
  "Cobalt Ridge Mining", "Juniper Lane Books", "Saltmarsh Foods", "Ridgeback Security", "Lanternfish Games", "Aster Pharmacy",
  "Northgate Credit Union", "Velvet Fern Florals", "Harbor & Main", "Thistle Analytics", "Graniteview Hotels", "Pemberton Audio",
  "Silverbirch Realty", "Cinder Coffee", "Owl Creek Farms", "Stonefly Outfitters", "Beacon Hill Vets", "Quillmark Press",
]

const regionNames = regions.map((r) => r.region)
const prices: Record<PlanKey, number> = { starter: 12, team: 24, enterprise: 38 }

type Account = { id: string; name: string; plan: PlanKey; region: string; seats: number; mrr: number; change: number }

const accountList: Account[] = names.map((name, i) => {
  const roll = next()
  const plan: PlanKey = i < 12 ? "enterprise" : roll < 0.5 ? "team" : roll < 0.8 ? "enterprise" : "starter"
  const seats = Math.round(plan === "enterprise" ? 120 + next() * 520 : plan === "team" ? 25 + next() * 140 : 5 + next() * 40)
  const discount = plan === "enterprise" ? 0.72 + (seats > 400 ? -0.1 : 0) + next() * 0.15 : 0.92 + next() * 0.08
  return {
    id: `acct-${i}`,
    name,
    plan,
    region: regionNames[Math.min(regionNames.length - 1, Math.floor(next() ** 1.6 * regionNames.length))]!,
    seats,
    mrr: Math.round(seats * prices[plan] * discount),
    change: +((next() - 0.3) * 18).toFixed(1),
  }
})


export {
  accountList,
  calendar,
  channels,
  compactCurrency,
  currency,
  current,
  generalRanges,
  goals,
  mrrNow,
  plans,
  regions,
  report,
}
export type { Account, ChannelKey, GeneralRange, PlanKey }
