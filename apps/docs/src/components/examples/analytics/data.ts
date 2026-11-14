type Range = "24h" | "7d" | "30d" | "90d"

const ranges: { value: Range; label: string; long: string }[] = [
  { value: "24h", label: "24H", long: "the last 24 hours" },
  { value: "7d", label: "7D", long: "the last 7 days" },
  { value: "30d", label: "30D", long: "the last 30 days" },
  { value: "90d", label: "90D", long: "the last 90 days" },
]

/** A smooth, repeatable wiggle, so every reload draws the same chart. */
function wave(i: number, seed: number) {
  return Math.sin(i * 0.9 + seed) * 0.5 + Math.sin(i * 0.37 + seed * 2) * 0.35 + Math.sin(i * 2.1 + seed) * 0.15
}

function points(range: Range) {
  return range === "24h" ? 24 : range === "7d" ? 7 : range === "30d" ? 30 : 13
}

function labelsFor(range: Range) {
  const n = points(range)
  const end = new Date(2026, 10, 14)
  return Array.from({ length: n }, (_, i) => {
    if (range === "24h") {
      const hour = (i + 10) % 24
      return `${hour % 12 || 12} ${hour < 12 ? "AM" : "PM"}`
    }
    const date = new Date(end)
    date.setDate(end.getDate() - (n - 1 - i) * (range === "90d" ? 7 : 1))
    return date.toLocaleDateString("en", { month: "short", day: "numeric" })
  })
}

function activeUsers(range: Range) {
  const n = points(range)
  const scale = range === "24h" ? 520 : range === "90d" ? 61000 : 12400
  const current = Array.from({ length: n }, (_, i) =>
    Math.round(scale * (0.78 + (i / n) * 0.16 + wave(i, 1.3) * 0.07 + (range === "24h" ? Math.sin(((i + 10) / 24) * Math.PI * 2 - 1.8) * 0.18 : 0)))
  )
  const previous = current.map((v, i) => Math.round(v * (0.86 + wave(i, 4.2) * 0.04)))
  return { current, previous }
}

type Kpi = {
  id: string
  label: string
  value: string
  delta: string
  /** Whether the change is good news, which sets the chip's color. */
  good: boolean
  trend: number[]
}

function kpis(range: Range): Kpi[] {
  const m = { "24h": 0.04, "7d": 0.24, "30d": 1, "90d": 2.9 }[range]
  const series = (seed: number, up = true) =>
    Array.from({ length: 16 }, (_, i) => 50 + (up ? i * 2 : -i * 1.5) + wave(i, seed) * 9)
  return [
    { id: "users", label: "Active users", value: Math.round(12482 * Math.max(m, 0.04) ** 0.35).toLocaleString("en"), delta: "+8.2%", good: true, trend: series(1) },
    { id: "mrr", label: "Monthly revenue", value: "$84,310", delta: "+3.1%", good: true, trend: series(2) },
    { id: "latency", label: "Query p95", value: range === "24h" ? "164 ms" : "182 ms", delta: "−12%", good: true, trend: series(3, false) },
    { id: "errors", label: "Error rate", value: range === "24h" ? "0.61%" : "0.42%", delta: "+0.05 pts", good: false, trend: series(5) },
  ]
}

const tables = [
  { label: "events", value: 1_840_000 },
  { label: "orders", value: 962_000 },
  { label: "profiles", value: 611_000 },
  { label: "sessions", value: 498_000 },
  { label: "invoices", value: 214_000 },
]

const storage = [
  { label: "public", value: 46, color: "var(--sd-accent)" },
  { label: "analytics", value: 28, color: "var(--sd-accent-secondary)" },
  { label: "auth", value: 14, color: "var(--sd-blue)" },
  { label: "storage", value: 12, color: "var(--sd-purple)" },
]

type Status = "healthy" | "stale" | "failed" | "syncing"

type Dataset = {
  id: string
  name: string
  source: string
  rows: number
  /** Minutes since the last refresh. */
  freshness: number
  status: Status
  owner: string
}

const datasets: Dataset[] = [
  { id: "orders_daily", name: "orders_daily", source: "Supabase", rows: 962_418, freshness: 4, status: "healthy", owner: "Kofi Mensah" },
  { id: "active_users", name: "active_users", source: "Supabase", rows: 12_482, freshness: 2, status: "healthy", owner: "Priya Raman" },
  { id: "mrr_by_plan", name: "mrr_by_plan", source: "Stripe", rows: 3_204, freshness: 38, status: "syncing", owner: "Jonah Weiss" },
  { id: "signup_funnel", name: "signup_funnel", source: "PostHog", rows: 48_906, freshness: 312, status: "stale", owner: "Inès Moreau" },
  { id: "query_latency", name: "query_latency", source: "Supabase", rows: 1_840_221, freshness: 1, status: "healthy", owner: "Priya Raman" },
  { id: "churn_cohorts", name: "churn_cohorts", source: "Stripe", rows: 7_812, freshness: 1440, status: "failed", owner: "Kofi Mensah" },
  { id: "storage_usage", name: "storage_usage", source: "Supabase", rows: 214, freshness: 15, status: "healthy", owner: "Wren Takahashi" },
]

const statusLabels: Record<Status, string> = { healthy: "Healthy", stale: "Stale", failed: "Failed", syncing: "Syncing" }
const statusColors = { healthy: "green", stale: "yellow", failed: "red", syncing: "blue" } as const

function freshnessLabel(minutes: number) {
  if (minutes < 60) return `${minutes} min ago`
  if (minutes < 1440) return `${Math.round(minutes / 60)} h ago`
  return `${Math.round(minutes / 1440)} d ago`
}

const agents = [
  { id: "digest", name: "Weekly metrics digest", detail: "Writes Monday’s summary for the leadership channel", runs: 52, on: true },
  { id: "anomaly", name: "Anomaly watcher", detail: "Flags metrics that move more than 3σ in an hour", runs: 1_204, on: true },
  { id: "schema", name: "Schema drift checker", detail: "Compares production and staging schemas nightly", runs: 30, on: true },
  { id: "churn", name: "Churn explainer", detail: "Explains why accounts cancelled, from support and usage", runs: 18, on: false },
]

const alerts = [
  { id: "a1", title: "churn_cohorts failed to refresh", detail: "Stripe returned 429 Too Many Requests. Retrying in 15 minutes.", time: "12 min ago", level: "critical" as const },
  { id: "a2", title: "Query p95 above 250 ms", detail: "orders_daily join on profiles is scanning 1.2M rows.", time: "1 h ago", level: "warning" as const },
  { id: "a3", title: "signup_funnel is 5 hours stale", detail: "PostHog sync paused after an API key rotation.", time: "5 h ago", level: "warning" as const },
]

export {
  activeUsers,
  agents,
  alerts,
  datasets,
  freshnessLabel,
  kpis,
  labelsFor,
  ranges,
  statusColors,
  statusLabels,
  storage,
  tables,
}
export type { Dataset, Kpi, Range, Status }
