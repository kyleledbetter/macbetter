/*
 * Color math for building themes: hex <-> OKLCH, gamut mapping, alpha
 * compositing, contrast fixing and a whole theme generated from one accent.
 * Pure functions, no DOM, so they can be unit tested.
 */
import { contrastRatio } from "./theme"

type Rgb = [number, number, number]
type Oklch = { l: number; c: number; h: number }
type Pair = { light: string; dark: string }
type Scheme = "light" | "dark"

const colorKeys = [
  "accent",
  "onAccent",
  "accentText",
  "accentSecondary",
  "ink",
  "bg",
  "bgSecondary",
  "bgTertiary",
  "bgElevated",
  "bgSidebar",
  "tint",
  "green",
  "red",
] as const

type ColorKey = (typeof colorKeys)[number]
type ThemeColors = Record<ColorKey, Pair>

/* ── Hex ─────────────────────────────────────────────────────────── */

const hexPattern = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i

/** `#abc`, `abc`, `#aabbcc` → `#aabbcc`; anything else → null. Alpha is dropped from 8-digit hex. */
function normalizeHex(input: string): string | null {
  let value = input.trim().toLowerCase()
  if (/^#?[0-9a-f]{8}$/.test(value)) value = value.replace("#", "").slice(0, 6)
  const match = hexPattern.exec(value)
  if (!match) return null
  const digits = match[1]!
  const full = digits.length === 3 ? [...digits].map((d) => d + d).join("") : digits
  return `#${full}`
}

function hexToRgb(hex: string): Rgb {
  const value = normalizeHex(hex)
  if (!value) throw new Error(`Not a hex color: ${hex}`)
  return [1, 3, 5].map((i) => parseInt(value.slice(i, i + 2), 16) / 255) as Rgb
}

function rgbToHex(rgb: Rgb): string {
  return `#${rgb
    .map((c) => Math.round(Math.min(1, Math.max(0, c)) * 255).toString(16).padStart(2, "0"))
    .join("")}`
}

/* ── OKLab / OKLCH (Björn Ottosson) ──────────────────────────────── */

const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const toGamma = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055)

function linearToOklab([r, g, b]: Rgb): Rgb {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
}

function oklabToLinear([L, a, b]: Rgb): Rgb {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
}

function hexToOklch(hex: string): Oklch {
  const [L, a, b] = linearToOklab(hexToRgb(hex).map(toLinear) as Rgb)
  const c = Math.hypot(a, b)
  let h = (Math.atan2(b, a) * 180) / Math.PI
  if (h < 0) h += 360
  // Grays have no meaningful hue; report 0 so callers can tell.
  return { l: L, c: c < 1e-4 ? 0 : c, h: c < 1e-4 ? 0 : h }
}

function oklchToLinear({ l, c, h }: Oklch): Rgb {
  const rad = (h * Math.PI) / 180
  return oklabToLinear([l, c * Math.cos(rad), c * Math.sin(rad)])
}

const inGamut = (rgb: Rgb) => rgb.every((v) => v >= -1e-4 && v <= 1 + 1e-4)

/** OKLCH → hex, reducing chroma (keeping lightness and hue) until the color fits in sRGB. */
function oklchToHex(color: Oklch): string {
  const l = Math.min(1, Math.max(0, color.l))
  const target = { ...color, l }
  if (inGamut(oklchToLinear(target))) return rgbToHex(oklchToLinear(target).map(toGamma) as Rgb)
  let lo = 0
  let hi = target.c
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2
    if (inGamut(oklchToLinear({ ...target, c: mid }))) lo = mid
    else hi = mid
  }
  return rgbToHex(oklchToLinear({ ...target, c: lo }).map(toGamma) as Rgb)
}

/* ── Compositing and contrast ────────────────────────────────────── */

/** `fg` at `alpha` over an opaque `bg`, composited in sRGB as the browser paints it. */
function composite(fg: string, bg: string, alpha: number): string {
  const a = hexToRgb(fg)
  const b = hexToRgb(bg)
  return rgbToHex(a.map((c, i) => c * alpha + b[i]! * (1 - alpha)) as Rgb)
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map(toLinear) as Rgb
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Moves `fg`'s OKLCH lightness away from `bg` until the pair reaches `target`,
 * keeping hue and as much chroma as fits. Returns `fg` unchanged if it already passes.
 */
function ensureContrast(fg: string, bg: string, target = 4.5): string {
  if (contrastRatio(fg, bg) >= target) return normalizeHex(fg)!
  const color = hexToOklch(fg)
  const darker = relativeLuminance(bg) > 0.18
  const end = darker ? 0 : 1
  if (contrastRatio(oklchToHex({ ...color, l: end }), bg) < target) return oklchToHex({ ...color, l: end })
  let near = color.l
  let far = end
  for (let i = 0; i < 28; i++) {
    const mid = (near + far) / 2
    if (contrastRatio(oklchToHex({ ...color, l: mid }), bg) >= target) far = mid
    else near = mid
  }
  return oklchToHex({ ...color, l: far })
}

/** Of `candidates`, the one with the most contrast against `bg`. */
function bestContrast(bg: string, candidates: string[]): string {
  return candidates.reduce((best, next) => (contrastRatio(next, bg) > contrastRatio(best, bg) ? next : best))
}

/* ── A theme from one accent ─────────────────────────────────────── */

const systemRed: Pair = { light: "#e5372b", dark: "#ff5a4f" }
const systemGreen: Pair = { light: "#248a3d", dark: "#30d158" }

/**
 * A complete set of color seeds from one accent: the accent kept as given in
 * light and lifted for dark, text on it chosen by contrast, the accent as text
 * pushed to 4.5:1, and neutrals tinted toward the accent's hue.
 */
function deriveFromAccent(input: string): ThemeColors {
  const accentLight = normalizeHex(input) ?? "#0071e3"
  const base = hexToOklch(accentLight)
  const h = base.h
  // How much of the hue the neutrals carry: a hint, never a color.
  const hint = Math.min(base.c, 0.16) / 0.16

  const n = (l: number, c: number) => oklchToHex({ l, c: c * hint, h })

  const accentDark = oklchToHex({
    l: Math.min(0.84, Math.max(base.l + 0.06, 0.68)),
    c: Math.min(base.c * 1.05, 0.22),
    h,
  })

  const bg = { light: "#ffffff", dark: n(0.18, 0.03) }
  const ink = { light: n(0.2, 0.025), dark: n(0.97, 0.008) }
  const deep = { light: n(0.2, 0.05), dark: n(0.16, 0.04) }

  const onAccent = {
    light: bestContrast(accentLight, ["#ffffff", deep.light]),
    dark: bestContrast(accentDark, ["#ffffff", deep.dark]),
  }

  const secondaryHue = (h + 150) % 360
  const secondary = {
    light: oklchToHex({ l: 0.56, c: Math.min(Math.max(base.c, 0.08), 0.14), h: secondaryHue }),
    dark: oklchToHex({ l: 0.76, c: Math.min(Math.max(base.c, 0.08), 0.13), h: secondaryHue }),
  }

  return {
    accent: { light: accentLight, dark: accentDark },
    onAccent,
    accentText: {
      light: ensureContrast(accentLight, bg.light, 4.6),
      dark: ensureContrast(accentDark, bg.dark, 4.6),
    },
    accentSecondary: secondary,
    ink,
    bg,
    bgSecondary: { light: n(0.965, 0.008), dark: n(0.15, 0.028) },
    bgTertiary: { light: "#ffffff", dark: n(0.235, 0.034) },
    bgElevated: { light: "#ffffff", dark: n(0.22, 0.034) },
    bgSidebar: { light: n(0.945, 0.012), dark: n(0.165, 0.03) },
    tint: { light: n(0.52, 0.03), dark: n(0.68, 0.04) },
    green: systemGreen,
    red: systemRed,
  }
}

/* ── Contrast report ─────────────────────────────────────────────── */

type ContrastCheck = {
  id: "on-accent" | "accent-text" | "ink" | "label-secondary" | "control-border"
  label: string
  /** The seed to adjust when the pair falls short. */
  fix: ColorKey | null
  ratio: number
  target: number
  pass: boolean
  fg: string
  bg: string
}

// The alphas tokens.css mixes labels and edges at, per scheme.
const secondaryAlpha = { light: 0.66, dark: 0.68 }
const borderAlpha = { light: 0.48, dark: 0.46 }

function contrastChecks(colors: ThemeColors, scheme: Scheme): ContrastCheck[] {
  const c = (key: ColorKey) => colors[key][scheme]
  const bg = c("bg")
  const rows: Array<Omit<ContrastCheck, "ratio" | "pass">> = [
    { id: "on-accent", label: "Text on accent", fix: "onAccent", fg: c("onAccent"), bg: c("accent"), target: 4.5 },
    { id: "accent-text", label: "Accent as text", fix: "accentText", fg: c("accentText"), bg, target: 4.5 },
    { id: "ink", label: "Primary text", fix: "ink", fg: c("ink"), bg, target: 4.5 },
    {
      id: "label-secondary",
      label: "Secondary text",
      fix: "ink",
      fg: composite(c("ink"), bg, secondaryAlpha[scheme]),
      bg,
      target: 4.5,
    },
    {
      id: "control-border",
      label: "Control edges",
      fix: "ink",
      fg: composite(c("ink"), bg, borderAlpha[scheme]),
      bg,
      target: 3,
    },
  ]
  return rows.map((row) => {
    const ratio = contrastRatio(row.fg, row.bg)
    return { ...row, ratio, pass: ratio >= row.target }
  })
}

/** Adjusts the seed behind a failing check so it passes, leaving everything else alone. */
function fixCheck(colors: ThemeColors, scheme: Scheme, id: ContrastCheck["id"]): ThemeColors {
  const c = (key: ColorKey) => colors[key][scheme]
  const set = (key: ColorKey, value: string): ThemeColors => ({
    ...colors,
    [key]: { ...colors[key], [scheme]: value },
  })
  switch (id) {
    case "on-accent": {
      const best = bestContrast(c("accent"), [c("onAccent"), "#ffffff", ensureContrast(c("onAccent"), c("accent"), 4.6)])
      return set("onAccent", best)
    }
    case "accent-text":
      return set("accentText", ensureContrast(c("accentText"), c("bg"), 4.6))
    case "ink":
      return set("ink", ensureContrast(c("ink"), c("bg"), 4.6))
    case "label-secondary":
    case "control-border": {
      // Both are alphas of ink, so only a stronger ink moves them.
      const target = id === "label-secondary" ? 4.6 : 3.1
      const alpha = id === "label-secondary" ? secondaryAlpha[scheme] : borderAlpha[scheme]
      const ink = hexToOklch(c("ink"))
      const end = relativeLuminance(c("bg")) > 0.18 ? 0 : 1
      for (let step = 0; step <= 40; step++) {
        const l = ink.l + ((end - ink.l) * step) / 40
        const candidate = oklchToHex({ ...ink, l })
        if (contrastRatio(composite(candidate, c("bg"), alpha), c("bg")) >= target) return set("ink", candidate)
      }
      return set("ink", oklchToHex({ ...ink, l: end }))
    }
  }
}

export {
  bestContrast,
  colorKeys,
  composite,
  contrastChecks,
  deriveFromAccent,
  ensureContrast,
  fixCheck,
  hexToOklch,
  hexToRgb,
  normalizeHex,
  oklchToHex,
  relativeLuminance,
  rgbToHex,
}
export type { ColorKey, ContrastCheck, Oklch, Pair, Scheme, ThemeColors }
