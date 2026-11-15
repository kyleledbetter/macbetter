/* Small helpers the four data modules share. */

/** Repeatable noise in [0, 1), so every load draws the same charts. */
function random(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const sum = (values: readonly number[]) => values.reduce((total, value) => total + value, 0)
const mean = (values: readonly number[]) => (values.length ? sum(values) / values.length : 0)

/** Splits `values` into runs of `size`, oldest first; the first run takes the remainder. */
function chunk<T>(values: readonly T[], size: number) {
  const out: T[][] = []
  for (let end = values.length; end > 0; end -= size) out.unshift(values.slice(Math.max(0, end - size), end))
  return out
}

/** The date `days` before `from`, at midnight. */
function daysBefore(from: Date, days: number) {
  return new Date(from.getFullYear(), from.getMonth(), from.getDate() - days)
}

const hourLabel = (hour: number) => `${hour % 12 || 12} ${hour < 12 || hour === 24 ? "AM" : "PM"}`
/** "9–10 AM", the way Health names an hour. */
const hourSpan = (hour: number) => `${hour % 12 || 12}–${hourLabel(hour + 1)}`

export { chunk, daysBefore, hourLabel, hourSpan, mean, random, sum }
