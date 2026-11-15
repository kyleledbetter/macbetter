import type { ChartColor } from "@/components/charts"
import { mean, random, sum } from "./numbers"

/*
 * Stocks: six invented companies, priced at Friday's close. Every number on
 * the screen is derived from the same price walks, so the day's open, high,
 * low and volume match the 1D chart, the 52-week range matches the 1Y chart,
 * and the holdings add up to the portfolio total.
 */

type StockRange = "1D" | "1W" | "1M" | "3M" | "6M" | "1Y" | "5Y"
type Step = "5m" | "30m" | "day" | "week"

const stockRanges: { value: StockRange; label: string; long: string }[] = [
  { value: "1D", label: "1D", long: "1 day" },
  { value: "1W", label: "1W", long: "1 week" },
  { value: "1M", label: "1M", long: "1 month" },
  { value: "3M", label: "3M", long: "3 months" },
  { value: "6M", label: "6M", long: "6 months" },
  { value: "1Y", label: "1Y", long: "1 year" },
  { value: "5Y", label: "5Y", long: "5 years" },
]

/** How each range is sampled, how many samples make one candle, and how long it is in years. */
const spec: Record<StockRange, { points: number; step: Step; perCandle: number; years: number; volatility: number; phrase: string }> = {
  "1D": { points: 79, step: "5m", perCandle: 3, years: 0, volatility: 0.0012, phrase: "today" },
  "1W": { points: 70, step: "30m", perCandle: 2, years: 5 / 252, volatility: 0.0034, phrase: "over the past week" },
  "1M": { points: 22, step: "day", perCandle: 1, years: 22 / 252, volatility: 0.011, phrase: "over the past month" },
  "3M": { points: 63, step: "day", perCandle: 1, years: 63 / 252, volatility: 0.012, phrase: "over the past 3 months" },
  "6M": { points: 126, step: "day", perCandle: 5, years: 0.5, volatility: 0.013, phrase: "over the past 6 months" },
  "1Y": { points: 252, step: "day", perCandle: 5, years: 1, volatility: 0.014, phrase: "over the past year" },
  "5Y": { points: 260, step: "week", perCandle: 4, years: 5, volatility: 0.032, phrase: "over the past 5 years" },
}

type Stock = {
  symbol: string
  name: string
  sector: string
  last: number
  previousClose: number
  /** Where today opened, against the previous close. */
  gap: number
  /** Change over the last year, as a fraction. */
  growth: number
  /** How jumpy the stock is, against the market. */
  beta: number
  /** A typical day's volume. */
  volume: number
  sharesOutstanding: number
  /** Earnings per share over the last 12 months. */
  eps: number
  /** Annual dividend per share. */
  dividend: number
  /** Shares held, and what they cost each. Zero for a symbol you only watch. */
  held: number
  cost: number
  color: ChartColor
  css: string
}

const stocks: Stock[] = [
  { symbol: "MCBT", name: "macbetter Inc.", sector: "Software", last: 231.4, previousClose: 228.28, gap: 0.0027, growth: 0.35, beta: 1, volume: 48_200_000, sharesOutstanding: 2_140_000_000, eps: 6.12, dividend: 1.04, held: 40, cost: 162.1, color: "series1", css: "var(--mb-chart-1)" },
  { symbol: "KVTA", name: "Kovita Robotics", sector: "Hardware", last: 412.77, previousClose: 405.1, gap: 0.0041, growth: 0.62, beta: 1.4, volume: 7_800_000, sharesOutstanding: 441_000_000, eps: 9.85, dividend: 0, held: 8, cost: 268.4, color: "series2", css: "var(--mb-chart-2)" },
  { symbol: "NWND", name: "Northwind Traders", sector: "Retail", last: 84.12, previousClose: 86.03, gap: -0.0012, growth: -0.08, beta: 1.1, volume: 9_200_000, sharesOutstanding: 618_000_000, eps: 4.48, dividend: 2.2, held: 120, cost: 78.4, color: "series4", css: "var(--mb-chart-4)" },
  { symbol: "VRDX", name: "Verdex Energy", sector: "Energy", last: 112.77, previousClose: 113.5, gap: 0.0008, growth: 0.12, beta: 0.9, volume: 14_300_000, sharesOutstanding: 952_000_000, eps: 8.91, dividend: 3.6, held: 25, cost: 104.0, color: "series5", css: "var(--mb-chart-5)" },
  { symbol: "QLLA", name: "Quillan Labs", sector: "Biotech", last: 57.36, previousClose: 55.91, gap: 0.0063, growth: 0.52, beta: 1.6, volume: 6_100_000, sharesOutstanding: 312_000_000, eps: -1.12, dividend: 0, held: 60, cost: 41.2, color: "series6", css: "var(--mb-chart-6)" },
  { symbol: "HLMR", name: "Hollimer Freight", sector: "Industrials", last: 38.05, previousClose: 37.42, gap: -0.0021, growth: 0.21, beta: 1.2, volume: 4_400_000, sharesOutstanding: 208_000_000, eps: 2.71, dividend: 0.8, held: 0, cost: 0, color: "teal", css: "var(--mb-teal)" },
]

/** Friday, November 13, 2026, 4:00 PM: the last close. */
const close = new Date(2026, 10, 13, 16, 0)

/** Trading times, oldest first, ending at Friday's close. */
function times(range: StockRange) {
  const { points, step } = spec[range]
  const out: Date[] = []
  const cursor = new Date(close)
  if (step === "5m") cursor.setHours(9, 30)
  while (out.length < points) {
    out.push(new Date(cursor))
    if (step === "5m") cursor.setMinutes(cursor.getMinutes() + 5)
    else if (step === "30m") {
      cursor.setMinutes(cursor.getMinutes() - 30)
      if (cursor.getHours() < 9 || (cursor.getHours() === 9 && cursor.getMinutes() < 30)) {
        do cursor.setDate(cursor.getDate() - 1)
        while (cursor.getDay() === 0 || cursor.getDay() === 6)
        cursor.setHours(16, 0)
      }
    } else if (step === "day") {
      do cursor.setDate(cursor.getDate() - 1)
      while (cursor.getDay() === 0 || cursor.getDay() === 6)
    } else cursor.setDate(cursor.getDate() - 7)
  }
  return step === "5m" ? out : out.reverse()
}

type Candle = { time: Date; open: number; close: number; low: number; high: number; volume: number }
type History = { times: Date[]; prices: number[]; volumes: number[]; candles: Candle[]; start: number }

const round = (value: number) => Math.round(value * 100) / 100

/** A random walk from where the range began to the last price, with an open, high and low for every sample. */
function build(stock: Stock, range: StockRange): History {
  const { points, step, perCandle, years, volatility } = spec[range]
  const seed = stock.symbol.split("").reduce((acc, ch) => acc * 31 + ch.charCodeAt(0), 7) + stockRanges.findIndex((r) => r.value === range) * 7919
  const next = random(seed)
  const start = range === "1D" ? stock.previousClose * (1 + stock.gap) : stock.last / (1 + stock.growth) ** Math.min(years, 2.2) / (1 + (next() - 0.5) * 0.02)
  const sigma = volatility * stock.beta
  const walk = [0]
  for (let i = 1; i < points; i++) walk.push(walk[i - 1]! + (next() - 0.5) * 2 * sigma * 1.7)
  const drift = Math.log(stock.last / start)
  const prices = walk.map((w, i) => {
    const t = i / (points - 1)
    return round(start * Math.exp(w - t * walk[points - 1]! + t * drift))
  })
  const per = step === "5m" ? stock.volume / 79 : step === "30m" ? stock.volume / 13 : step === "day" ? stock.volume : stock.volume * 5
  const volumes = prices.map((_, i) => {
    const t = i / (points - 1)
    // Trading is heaviest at the open and the close.
    const shape = step === "5m" ? 0.55 + 1.6 * (Math.abs(t - 0.5) * 2) ** 3 : 1
    return Math.round((0.6 + next() * 0.8) * shape * per)
  })
  const dates = times(range)
  const samples = prices.map((price, i) => {
    const open = i === 0 ? start : round(prices[i - 1]! * (1 + (next() - 0.5) * sigma * 0.4))
    const wick = sigma * 0.8
    return {
      time: dates[i]!,
      open,
      close: price,
      high: round(Math.max(open, price) * (1 + next() * wick)),
      low: round(Math.min(open, price) * (1 - next() * wick)),
      volume: volumes[i]!,
    }
  })
  const candles: Candle[] = []
  for (let i = 0; i < samples.length; i += perCandle) {
    const group = samples.slice(i, i + perCandle)
    candles.push({
      time: group[0]!.time,
      open: group[0]!.open,
      close: group.at(-1)!.close,
      high: Math.max(...group.map((s) => s.high)),
      low: Math.min(...group.map((s) => s.low)),
      volume: sum(group.map((s) => s.volume)),
    })
  }
  return { times: samples.map((s) => s.time), prices, volumes, candles, start: round(start) }
}

const cache = new Map<string, History>()

function history(stock: Stock, range: StockRange) {
  const key = `${stock.symbol}:${range}`
  let found = cache.get(key)
  if (!found) {
    found = build(stock, range)
    cache.set(key, found)
  }
  return found
}

/** The key statistics Stocks lists under the chart, all derived from the price history. */
function statistics(stock: Stock) {
  const today = history(stock, "1D").candles
  const year = history(stock, "1Y").candles
  const quarter = history(stock, "3M").volumes
  return {
    open: today[0]!.open,
    high: Math.max(...today.map((c) => c.high)),
    low: Math.min(...today.map((c) => c.low)),
    volume: sum(today.map((c) => c.volume)),
    averageVolume: Math.round(mean(quarter)),
    marketCap: stock.sharesOutstanding * stock.last,
    pe: stock.eps > 0 ? stock.last / stock.eps : null,
    yearHigh: Math.max(...year.map((c) => c.high), ...today.map((c) => c.high)),
    yearLow: Math.min(...year.map((c) => c.low), ...today.map((c) => c.low)),
    dividendYield: stock.dividend > 0 ? stock.dividend / stock.last : null,
  }
}

/** Today's price, thinned to 27 points: enough for a sparkline. */
function sparkline(stock: Stock) {
  return history(stock, "1D").prices.filter((_, i) => i % 3 === 0)
}

/** The positions you hold, with what they're worth now and what they gained. */
function holdings() {
  const rows = stocks
    .filter((stock) => stock.held > 0)
    .map((stock) => {
      const value = stock.held * stock.last
      return {
        stock,
        value,
        dayGain: stock.held * (stock.last - stock.previousClose),
        totalGain: value - stock.held * stock.cost,
      }
    })
  const total = sum(rows.map((row) => row.value))
  return {
    rows: rows.map((row) => ({ ...row, share: row.value / total })),
    total,
    dayGain: sum(rows.map((row) => row.dayGain)),
    totalGain: sum(rows.map((row) => row.totalGain)),
  }
}

const price = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const dollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 })
const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 })
const signed = (value: number, digits = 2) => `${value >= 0 ? "+" : "−"}${Math.abs(value).toFixed(digits)}`

const time = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" })
const weekday = new Intl.DateTimeFormat("en-US", { weekday: "short", hour: "numeric", minute: "2-digit" })
const day = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" })

function when(range: StockRange, date: Date) {
  const { step } = spec[range]
  if (step === "5m") return time.format(date)
  if (step === "30m") return weekday.format(date)
  return day.format(date)
}

/** Which samples get an x label: the first of each hour, day, week, month or year, thinned to fit. */
function ticks(range: StockRange, dates: Date[]) {
  const { step } = spec[range]
  const key = (d: Date) =>
    step === "5m"
      ? d.getHours()
      : step === "30m"
        ? d.getDate()
        : range === "1M"
          ? Math.floor((d.getTime() - 4 * 86_400_000) / (7 * 86_400_000))
          : step === "day"
            ? d.getMonth()
            : d.getFullYear()
  const every = range === "1Y" ? 2 : 1
  const marks = new Map<number, string>()
  let seen = 0
  dates.forEach((d, i) => {
    if (i === 0 || key(d) === key(dates[i - 1]!)) return
    if (seen++ % every) return
    marks.set(
      i,
      step === "5m"
        ? String(d.getHours() % 12 || 12)
        : step === "30m"
          ? d.toLocaleDateString("en-US", { weekday: "short" })
          : range === "1M"
            ? `${d.toLocaleString("en-US", { month: "short" })} ${d.getDate()}`
            : step === "day"
              ? d.toLocaleString("en-US", { month: "short" })
              : String(d.getFullYear())
    )
  })
  return marks
}

export { compact, dollars, history, holdings, price, signed, sparkline, spec, statistics, stockRanges, stocks, ticks, when }
export type { Candle, History, Stock, StockRange }
