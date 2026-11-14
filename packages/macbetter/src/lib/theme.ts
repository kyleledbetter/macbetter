type ColorPair = string | { light: string; dark: string }

type ThemeSeeds = {
  /** The brand's action color: filled buttons, selection, focus. */
  accent: ColorPair
  /** Text and icons on the accent. Must hold 4.5:1 against it. */
  onAccent?: ColorPair
  /** The accent, adjusted to hold 4.5:1 as text on the background. */
  accentText?: ColorPair
  accentSecondary?: ColorPair
  /** Text color at full strength. Labels are opacities of it. */
  ink?: ColorPair
  bg?: ColorPair
  bgSecondary?: ColorPair
  bgTertiary?: ColorPair
  bgElevated?: ColorPair
  bgSidebar?: ColorPair
  /** The gray that fills and materials are mixed from. Tint it toward the brand. */
  tint?: ColorPair
  /** Overrides for the system palette: red, orange, yellow, green, mint, teal, cyan, blue, indigo, purple, pink, brown. */
  palette?: Partial<Record<SystemColor, ColorPair>>
  /** 1 is Apple's corners. Lower is squarer, higher is rounder. */
  radiusScale?: number
  font?: string
  fontDisplay?: string
  fontRounded?: string
  fontMono?: string
}

type SystemColor =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "mint"
  | "teal"
  | "cyan"
  | "blue"
  | "indigo"
  | "purple"
  | "pink"
  | "brown"

const seedNames: Array<[keyof ThemeSeeds, string]> = [
  ["accent", "--mb-accent"],
  ["onAccent", "--mb-on-accent"],
  ["accentText", "--mb-accent-text"],
  ["accentSecondary", "--mb-accent-secondary"],
  ["ink", "--mb-ink"],
  ["bg", "--mb-bg"],
  ["bgSecondary", "--mb-bg-secondary"],
  ["bgTertiary", "--mb-bg-tertiary"],
  ["bgElevated", "--mb-bg-elevated"],
  ["bgSidebar", "--mb-bg-sidebar"],
  ["tint", "--mb-tint"],
]

function color(value: ColorPair): string {
  return typeof value === "string" ? value : `light-dark(${value.light}, ${value.dark})`
}

/** The custom properties a theme sets, ready for a `style` prop or a stylesheet. */
function themeVariables(seeds: ThemeSeeds): Record<string, string> {
  const variables: Record<string, string> = {}
  for (const [key, name] of seedNames) {
    const value = seeds[key] as ColorPair | undefined
    if (value !== undefined) variables[name] = color(value)
  }
  for (const [name, value] of Object.entries(seeds.palette ?? {})) {
    variables[`--mb-${name}`] = color(value)
  }
  if (seeds.radiusScale !== undefined) variables["--mb-radius-scale"] = String(seeds.radiusScale)
  if (seeds.font) variables["--mb-font"] = seeds.font
  if (seeds.fontDisplay) variables["--mb-font-display"] = seeds.fontDisplay
  if (seeds.fontRounded) variables["--mb-font-rounded"] = seeds.fontRounded
  if (seeds.fontMono) variables["--mb-font-mono"] = seeds.fontMono
  return variables
}

/**
 * A theme as CSS. Put it after Macbetter's stylesheet and turn it on with
 * `data-theme="<name>"` on any element.
 */
function createTheme(name: string, seeds: ThemeSeeds): string {
  const lines = Object.entries(themeVariables(seeds)).map(([key, value]) => `  ${key}: ${value};`)
  return `[data-theme="${name}"] {\n${lines.join("\n")}\n}\n`
}

/** WCAG contrast ratio of two sRGB hex colors, for checking a theme's pairs. */
function contrastRatio(a: string, b: string): number {
  const [la, lb] = [luminance(a), luminance(b)]
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

function luminance(hex: string): number {
  const value = hex.replace("#", "")
  const full = value.length === 3 ? [...value].map((c) => c + c).join("") : value
  const channels = [0, 2, 4].map((i) => {
    const c = parseInt(full.slice(i, i + 2), 16) / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * channels[0]! + 0.7152 * channels[1]! + 0.0722 * channels[2]!
}

export { contrastRatio, createTheme, themeVariables }
export type { ColorPair, SystemColor, ThemeSeeds }
