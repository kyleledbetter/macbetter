"use client"

import * as React from "react"
import type { ChartConfig } from "./evil/ui/echarts-chart"

/*
 * The Stardust adapter for ECharts and EvilCharts.
 *
 * Stardust colors are CSS: light-dark(), color-mix() and oklch(), resolved
 * per element by data-theme, data-scheme and data-platform. A canvas can't
 * read CSS, so the adapter paints each token on a probe inside the chart's
 * own container, reads back a plain rgba() string, and does it again whenever
 * an ancestor's theme, scheme or platform changes, or the system's
 * appearance does.
 */

type Platform = "macos" | "ipados" | "ios"

/** Token names the adapter resolves; `--sd-chart-*` ones are set in charts.css. */
const tokens = {
  accent: "--sd-accent",
  accentSecondary: "--sd-accent-secondary",
  red: "--sd-red",
  orange: "--sd-orange",
  yellow: "--sd-yellow",
  green: "--sd-green",
  mint: "--sd-mint",
  teal: "--sd-teal",
  cyan: "--sd-cyan",
  blue: "--sd-blue",
  indigo: "--sd-indigo",
  purple: "--sd-purple",
  pink: "--sd-pink",
  label: "--sd-label",
  label2: "--sd-label-secondary",
  label3: "--sd-label-tertiary",
  label4: "--sd-label-quaternary",
  fill: "--sd-fill",
  fill2: "--sd-fill-secondary",
  fill3: "--sd-fill-tertiary",
  fill4: "--sd-fill-quaternary",
  bg: "--sd-chart-surface",
  grid: "--sd-chart-grid",
  gridStrong: "--sd-chart-grid-strong",
  axis: "--sd-chart-axis",
  rule: "--sd-chart-rule",
  up: "--sd-chart-up",
  down: "--sd-chart-down",
  move: "--sd-chart-move",
  exercise: "--sd-chart-exercise",
  stand: "--sd-chart-stand",
  awake: "--sd-chart-awake",
  rem: "--sd-chart-rem",
  core: "--sd-chart-core",
  deep: "--sd-chart-deep",
  series1: "--sd-chart-1",
  series2: "--sd-chart-2",
  series3: "--sd-chart-3",
  series4: "--sd-chart-4",
  series5: "--sd-chart-5",
  series6: "--sd-chart-6",
} as const

type ChartColor = keyof typeof tokens

type ChartTheme = {
  colors: Record<ChartColor, string>
  /** The categorical palette, in order. */
  series: string[]
  platform: Platform
  dark: boolean
  /** The system font stack, for canvas text. */
  font: string
  /** Axis label size: the platform's caption style. */
  fontSize: number
  reducedMotion: boolean
  /** A fingerprint, so a chart only redraws when something it uses changed. */
  key: string
}

/* ── Color normalization ───────────────────────────────────────── */

let ctx: CanvasRenderingContext2D | null = null

/** Any CSS color (oklch, color(srgb …), named) as rgba(), by painting it and reading it back. */
function toRgba(value: string) {
  if (!ctx) {
    const canvas = document.createElement("canvas")
    canvas.width = canvas.height = 1
    ctx = canvas.getContext("2d", { willReadFrequently: true })
  }
  if (!ctx) return value
  ctx.clearRect(0, 0, 1, 1)
  ctx.fillStyle = "#000"
  ctx.fillStyle = value
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data
  return `rgba(${r}, ${g}, ${b}, ${+(a! / 255).toFixed(3)})`
}

/** The same color at a fraction of its own alpha. */
function alpha(color: string, amount: number) {
  const match = color.match(/rgba?\(([^)]+)\)/)
  if (!match) return color
  const [r, g, b, a = "1"] = match[1]!.split(",").map((part) => part.trim())
  return `rgba(${r}, ${g}, ${b}, ${+(Number(a) * amount).toFixed(3)})`
}

function luminance(color: string) {
  const [r = 0, g = 0, b = 0] = (color.match(/[\d.]+/g) ?? []).map(Number)
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
}

/* ── Resolving ─────────────────────────────────────────────────── */

function resolveChartTheme(element: HTMLElement): ChartTheme {
  const probe = document.createElement("span")
  probe.setAttribute("aria-hidden", "true")
  probe.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;visibility:hidden;pointer-events:none"
  element.appendChild(probe)
  const colors = {} as Record<ChartColor, string>
  for (const [name, token] of Object.entries(tokens) as [ChartColor, string][]) {
    probe.style.color = `var(${token})`
    colors[name] = toRgba(getComputedStyle(probe).color)
  }
  probe.style.color = ""
  probe.style.font = "var(--sd-text-caption)"
  const style = getComputedStyle(probe)
  const font = style.fontFamily
  const fontSize = Number.parseFloat(style.fontSize) || 11
  element.removeChild(probe)

  const platform = (element.closest("[data-platform]")?.getAttribute("data-platform") ?? "macos") as Platform
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const series = [colors.series1, colors.series2, colors.series3, colors.series4, colors.series5, colors.series6]
  const dark = luminance(colors.bg) < 0.45
  const key = [Object.values(colors).join(), platform, font, fontSize, reducedMotion].join("|")
  return { colors, series, platform, dark, font, fontSize, reducedMotion, key }
}

/* ── Watching for changes ──────────────────────────────────────── */

let version = 0
const listeners = new Set<() => void>()
let teardown: (() => void) | null = null

function bump() {
  version++
  for (const listener of listeners) listener()
}

function startWatching() {
  let frame = 0
  const schedule = () => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(bump)
  }
  // Any element can restate the theme, scheme or platform for its subtree (the docs
  // stage flips a preview to light), so watch those attributes everywhere…
  const nested = new MutationObserver(schedule)
  nested.observe(document.documentElement, {
    subtree: true,
    attributes: true,
    attributeFilter: ["data-theme", "data-scheme", "data-color-scheme", "data-platform"],
  })
  // …and the root's class and style too, where theme editors write custom tokens.
  const root = new MutationObserver(schedule)
  root.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] })
  const queries = ["(prefers-color-scheme: dark)", "(prefers-contrast: more)", "(prefers-reduced-motion: reduce)"].map(
    (query) => window.matchMedia(query)
  )
  for (const query of queries) query.addEventListener("change", schedule)
  return () => {
    cancelAnimationFrame(frame)
    nested.disconnect()
    root.disconnect()
    for (const query of queries) query.removeEventListener("change", schedule)
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  teardown ??= startWatching()
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      teardown?.()
      teardown = null
    }
  }
}

/**
 * The chart theme for the element `ref` points at, kept in step with the page.
 * `null` until mounted: canvas charts draw on the client only.
 */
function useChartTheme(ref: React.RefObject<HTMLElement | null>) {
  const tick = React.useSyncExternalStore(
    subscribe,
    () => version,
    () => 0
  )
  const [theme, setTheme] = React.useState<ChartTheme | null>(null)
  React.useLayoutEffect(() => {
    if (!ref.current) return
    const next = resolveChartTheme(ref.current)
    setTheme((current) => (current?.key === next.key ? current : next))
  }, [ref, tick])
  return theme
}

/* ── Helpers for options ───────────────────────────────────────── */

/** Number formatting with the figures Apple's apps use. */
const formatters = {
  compact: new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }),
  integer: new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }),
  price: new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
}

/**
 * Shared option defaults: the system font, no axis lines, hairline grid,
 * first-draw animation that respects Reduce Motion.
 */
function baseOption(theme: ChartTheme) {
  return {
    backgroundColor: "transparent",
    textStyle: { fontFamily: theme.font, fontSize: theme.fontSize, color: theme.colors.axis },
    animation: !theme.reducedMotion,
    animationDuration: 700,
    animationEasing: "cubicOut",
    animationDurationUpdate: 360,
    animationEasingUpdate: "cubicInOut",
  } as const
}

/** A value axis in Apple's style: labels on the trailing edge, hairline grid, no axis line. */
function valueAxis(theme: ChartTheme, overrides: Record<string, unknown> = {}) {
  return {
    type: "value",
    position: "right",
    splitNumber: 3,
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      color: theme.colors.axis,
      fontSize: theme.fontSize,
      margin: 6,
      formatter: (value: number) => formatters.compact.format(value),
    },
    splitLine: { lineStyle: { color: theme.colors.grid, width: 1 } },
    ...overrides,
  }
}

/** A category axis: no line, dashed day dividers when asked. */
function categoryAxis(theme: ChartTheme, data: (string | number)[], overrides: Record<string, unknown> = {}) {
  return {
    type: "category",
    data,
    boundaryGap: true,
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: theme.colors.axis, fontSize: theme.fontSize, margin: 8 },
    splitLine: { show: false },
    ...overrides,
  }
}

/** A chart color name, a name with an opacity like "exercise/40", or any CSS color the canvas can read. */
function paint(theme: ChartTheme, name: string) {
  const [base, opacity] = name.split("/")
  if (base! in theme.colors) {
    const color = theme.colors[base as ChartColor]
    return opacity ? alpha(color, Number(opacity) / 100) : color
  }
  return name
}

/**
 * An EvilCharts config from Stardust colors. EvilCharts takes light and dark
 * colors per series; the adapter already resolved them for this chart's
 * scheme, so both get the same value. A color is a chart color name, with an
 * optional opacity ("exercise/40"), or an rgba() string.
 */
function evilConfig(
  theme: ChartTheme,
  series: Record<string, { label: string; color: ChartColor | string | readonly (ChartColor | string)[] }>
): ChartConfig {
  return Object.fromEntries(
    Object.entries(series).map(([key, { label, color }]) => {
      const list = (typeof color === "string" ? [color] : color).map((name) => paint(theme, name))
      return [key, { label, colors: { light: list, dark: list } }]
    })
  )
}

/** Options merged into every EvilCharts chart: the system font and Reduce Motion. */
function evilOptions(theme: ChartTheme) {
  return { textStyle: { fontFamily: theme.font } }
}

export {
  alpha,
  baseOption,
  categoryAxis,
  evilConfig,
  evilOptions,
  formatters,
  resolveChartTheme,
  toRgba,
  useChartTheme,
  valueAxis,
}
export type { ChartColor, ChartTheme, Platform }

type EvilSeries = Parameters<typeof evilConfig>[1]

/**
 * Everything an EvilCharts chart needs from Stardust: put `ref` on an
 * ancestor (a ChartFrame), pass `config` and `chartOptions` to the chart.
 * Both are null until the theme resolves on the client. Keep `series` stable.
 */
function useEvilChart<T extends HTMLElement = HTMLElement>(series: EvilSeries) {
  const ref = React.useRef<T>(null)
  const theme = useChartTheme(ref)
  const config = React.useMemo(() => (theme ? evilConfig(theme, series) : null), [theme, series])
  const chartOptions = React.useMemo(() => (theme ? evilOptions(theme) : null), [theme])
  return { ref, theme, config, chartOptions }
}

export { useEvilChart }
