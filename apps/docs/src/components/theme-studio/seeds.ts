import { createTheme, type ThemeSeeds } from "@dreambase/stardust/theme"
import { colorKeys, normalizeHex, type ThemeColors } from "./derive"

const fonts = {
  system: { label: "System", font: undefined, display: undefined },
  inter: {
    label: "Neo-grotesque",
    font: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
    display: undefined,
  },
  rounded: {
    label: "Rounded",
    font: 'ui-rounded, "SF Pro Rounded", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
    display: undefined,
  },
  serif: {
    label: "Serif titles",
    font: undefined,
    display: 'ui-serif, "New York", "Iowan Old Style", Georgia, serif',
  },
  mono: {
    label: "Monospaced",
    font: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
    display: undefined,
  },
} as const

type FontId = keyof typeof fonts
const fontIds = Object.keys(fonts) as FontId[]

type StudioTheme = {
  name: string
  colors: ThemeColors
  radiusScale: number
  font: FontId
}

type Preset = StudioTheme & { id: string; label: string; description: string }

const red = { light: "#e5372b", dark: "#ff5a4f" }
const appleGreen = { light: "#248a3d", dark: "#30d158" }

const presets: Preset[] = [
  {
    id: "dreambase",
    label: "Dreambase",
    description: "Trinidad orange on Racing Green.",
    name: "dreambase",
    radiusScale: 1,
    font: "system",
    colors: {
      accent: { light: "#ee5700", dark: "#f67f01" },
      onAccent: { light: "#0a1c13", dark: "#0a1c13" },
      accentText: { light: "#b84300", dark: "#f9943c" },
      accentSecondary: { light: "#028f71", dark: "#52c6a0" },
      ink: { light: "#0a1c13", dark: "#f1f7f3" },
      bg: { light: "#ffffff", dark: "#0a1c13" },
      bgSecondary: { light: "#f2f5f2", dark: "#0f251a" },
      bgTertiary: { light: "#ffffff", dark: "#163224" },
      bgElevated: { light: "#ffffff", dark: "#14301f" },
      bgSidebar: { light: "#eaf0ec", dark: "#0c2117" },
      tint: { light: "#5b6b62", dark: "#7fa894" },
      green: { light: "#028f71", dark: "#44bd8b" },
      red,
    },
  },
  {
    id: "system",
    label: "System",
    description: "Apple's blue on true grays.",
    name: "system",
    radiusScale: 1,
    font: "system",
    colors: {
      accent: { light: "#0071e3", dark: "#0071e3" },
      onAccent: { light: "#ffffff", dark: "#ffffff" },
      accentText: { light: "#0064d6", dark: "#409cff" },
      accentSecondary: { light: "#248a3d", dark: "#30d158" },
      ink: { light: "#000000", dark: "#ffffff" },
      bg: { light: "#ffffff", dark: "#1c1c1e" },
      bgSecondary: { light: "#f2f2f7", dark: "#000000" },
      bgTertiary: { light: "#ffffff", dark: "#2c2c2e" },
      bgElevated: { light: "#ffffff", dark: "#2c2c2e" },
      bgSidebar: { light: "#ecece9", dark: "#252528" },
      tint: { light: "#78788a", dark: "#8e8e9e" },
      green: appleGreen,
      red: { light: "#e0302a", dark: "#ff453a" },
    },
  },
  {
    id: "nebula",
    label: "Nebula",
    description: "Violet on cool ink, a little rounder.",
    name: "nebula",
    radiusScale: 1.15,
    font: "system",
    colors: {
      accent: { light: "#6d3df5", dark: "#9b7bff" },
      onAccent: { light: "#ffffff", dark: "#120a2e" },
      accentText: { light: "#5a2be0", dark: "#b29bff" },
      accentSecondary: { light: "#c026a8", dark: "#ff7ad9" },
      ink: { light: "#14102b", dark: "#f3f1ff" },
      bg: { light: "#ffffff", dark: "#100c24" },
      bgSecondary: { light: "#f4f2fb", dark: "#161131" },
      bgTertiary: { light: "#ffffff", dark: "#201a42" },
      bgElevated: { light: "#ffffff", dark: "#1d173d" },
      bgSidebar: { light: "#eceaf7", dark: "#130f2a" },
      tint: { light: "#66618a", dark: "#9a94c9" },
      green: { light: "#1a8f6a", dark: "#4ad6a4" },
      red,
    },
  },
  {
    id: "graphite",
    label: "Graphite",
    description: "Monochrome and squared off, for dense tools.",
    name: "graphite",
    radiusScale: 0.7,
    font: "system",
    colors: {
      accent: { light: "#1f1f23", dark: "#f2f2f4" },
      onAccent: { light: "#ffffff", dark: "#121214" },
      accentText: { light: "#1f1f23", dark: "#f2f2f4" },
      accentSecondary: { light: "#5a5a66", dark: "#b4b4c0" },
      ink: { light: "#111114", dark: "#f5f5f7" },
      bg: { light: "#ffffff", dark: "#18181b" },
      bgSecondary: { light: "#f4f4f5", dark: "#101012" },
      bgTertiary: { light: "#ffffff", dark: "#26262a" },
      bgElevated: { light: "#ffffff", dark: "#242428" },
      bgSidebar: { light: "#ececee", dark: "#1d1d20" },
      tint: { light: "#70707c", dark: "#8f8f9c" },
      green: appleGreen,
      red,
    },
  },
  {
    id: "press",
    label: "Press",
    description: "Brick red on warm paper, with serif titles.",
    name: "press",
    radiusScale: 0.75,
    font: "serif",
    colors: {
      accent: { light: "#a8321e", dark: "#f07a5a" },
      onAccent: { light: "#ffffff", dark: "#2a0f08" },
      accentText: { light: "#9a2d1a", dark: "#f5917a" },
      accentSecondary: { light: "#2f5d50", dark: "#7fb8a4" },
      ink: { light: "#1f1a14", dark: "#f3ece2" },
      bg: { light: "#fbf7f0", dark: "#1b1713" },
      bgSecondary: { light: "#f3ede2", dark: "#15120f" },
      bgTertiary: { light: "#fffdf8", dark: "#25201a" },
      bgElevated: { light: "#fffdf8", dark: "#2a241d" },
      bgSidebar: { light: "#efe8db", dark: "#18140f" },
      tint: { light: "#7a6e5f", dark: "#a89a86" },
      green: { light: "#3f7d3a", dark: "#7cc36f" },
      red: { light: "#b42318", dark: "#ff6b5a" },
    },
  },
  {
    id: "ledger",
    label: "Ledger",
    description: "Teal on navy, for numbers people trust.",
    name: "ledger",
    radiusScale: 0.9,
    font: "inter",
    colors: {
      accent: { light: "#007f73", dark: "#2fd3b5" },
      onAccent: { light: "#ffffff", dark: "#00251f" },
      accentText: { light: "#00756a", dark: "#3ddcbf" },
      accentSecondary: { light: "#2557d6", dark: "#6b9bff" },
      ink: { light: "#0b1b2b", dark: "#e8f1f7" },
      bg: { light: "#ffffff", dark: "#0a1724" },
      bgSecondary: { light: "#f3f6f9", dark: "#071220" },
      bgTertiary: { light: "#ffffff", dark: "#12233a" },
      bgElevated: { light: "#ffffff", dark: "#112033" },
      bgSidebar: { light: "#edf2f6", dark: "#0c1a2a" },
      tint: { light: "#607080", dark: "#8299b0" },
      green: { light: "#0a8a4a", dark: "#34d399" },
      red: { light: "#d92d20", dark: "#ff6b61" },
    },
  },
  {
    id: "sorbet",
    label: "Sorbet",
    description: "Raspberry and violet, rounded everywhere.",
    name: "sorbet",
    radiusScale: 1.4,
    font: "rounded",
    colors: {
      accent: { light: "#d12a6f", dark: "#ff7ab0" },
      onAccent: { light: "#ffffff", dark: "#3a0a20" },
      accentText: { light: "#c01f62", dark: "#ff8fbd" },
      accentSecondary: { light: "#7c4dff", dark: "#b39dff" },
      ink: { light: "#2a1020", dark: "#fbeef4" },
      bg: { light: "#fffafc", dark: "#1e0f18" },
      bgSecondary: { light: "#fdf0f5", dark: "#170a12" },
      bgTertiary: { light: "#ffffff", dark: "#2a1622" },
      bgElevated: { light: "#ffffff", dark: "#2d1825" },
      bgSidebar: { light: "#fbe8f0", dark: "#1a0c15" },
      tint: { light: "#8a6878", dark: "#b38fa1" },
      green: { light: "#1f9d62", dark: "#4ade9a" },
      red: { light: "#e5372b", dark: "#ff6b5f" },
    },
  },
  {
    id: "harbor",
    label: "Harbor",
    description: "Sea blue with a buoy-orange second color.",
    name: "harbor",
    radiusScale: 1.1,
    font: "system",
    colors: {
      accent: { light: "#0b6e99", dark: "#3fb3e6" },
      onAccent: { light: "#ffffff", dark: "#04202e" },
      accentText: { light: "#0a5f85", dark: "#6cc7ef" },
      accentSecondary: { light: "#d9822b", dark: "#f2a65a" },
      ink: { light: "#0b1a22", dark: "#eaf4f8" },
      bg: { light: "#ffffff", dark: "#0b1a22" },
      bgSecondary: { light: "#f1f5f7", dark: "#08151b" },
      bgTertiary: { light: "#ffffff", dark: "#152b35" },
      bgElevated: { light: "#ffffff", dark: "#12262f" },
      bgSidebar: { light: "#e9f0f3", dark: "#0d1e26" },
      tint: { light: "#5d6f78", dark: "#86a3b0" },
      green: { light: "#1e8a5a", dark: "#3ccf8e" },
      red,
    },
  },
]

const defaultTheme: StudioTheme = { ...presets[0]!, name: "my-brand" }

/** A theme name as it can appear in `data-theme="…"` and a CSS file name. */
function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "my-brand"
  )
}

function toThemeSeeds(theme: StudioTheme): ThemeSeeds {
  const { colors } = theme
  const font = fonts[theme.font]
  return {
    accent: colors.accent,
    onAccent: colors.onAccent,
    accentText: colors.accentText,
    accentSecondary: colors.accentSecondary,
    ink: colors.ink,
    bg: colors.bg,
    bgSecondary: colors.bgSecondary,
    bgTertiary: colors.bgTertiary,
    bgElevated: colors.bgElevated,
    bgSidebar: colors.bgSidebar,
    tint: colors.tint,
    palette: { green: colors.green, red: colors.red },
    radiusScale: theme.radiusScale,
    ...(font.font ? { font: font.font } : {}),
    ...(font.display ? { fontDisplay: font.display } : {}),
  }
}

function exportCss(theme: StudioTheme): string {
  return createTheme(slugify(theme.name), toThemeSeeds(theme))
}

function camelCase(name: string): string {
  return slugify(name).replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase())
}

function exportTypeScript(theme: StudioTheme): string {
  const seeds = toThemeSeeds(theme)
  const pair = (value: unknown) => {
    const { light, dark } = value as { light: string; dark: string }
    return light === dark ? `"${light}"` : `{ light: "${light}", dark: "${dark}" }`
  }
  const lines: string[] = []
  for (const [key, value] of Object.entries(seeds)) {
    if (key === "palette") {
      const palette = value as Record<string, unknown>
      lines.push("  palette: {")
      for (const [name, color] of Object.entries(palette)) lines.push(`    ${name}: ${pair(color)},`)
      lines.push("  },")
    } else if (typeof value === "number") lines.push(`  ${key}: ${value},`)
    else if (typeof value === "string") lines.push(`  ${key}: ${JSON.stringify(value)},`)
    else lines.push(`  ${key}: ${pair(value)},`)
  }
  const slug = slugify(theme.name)
  const id = camelCase(theme.name)
  return `import { themeVariables } from "@dreambase/stardust/theme"

export const ${id} = themeVariables({
${lines.join("\n")}
})

// <div data-theme="${slug}" data-platform="macos" style={${id}}>…</div>
`
}

/* ── Share links ─────────────────────────────────────────────────── */
// v1.<13 pairs of hex, light then dark, without #>.<radius × 100>.<font>.<name>

function encodeTheme(theme: StudioTheme): string {
  const hex = colorKeys
    .map((key) => theme.colors[key].light.slice(1) + theme.colors[key].dark.slice(1))
    .join("")
  return ["v1", hex, String(Math.round(theme.radiusScale * 100)), theme.font, encodeURIComponent(slugify(theme.name))].join(".")
}

function decodeTheme(value: string): StudioTheme | null {
  const [version, hex, radius, font, name] = value.replace(/^#/, "").split(".")
  if (version !== "v1" || !hex || hex.length !== colorKeys.length * 12) return null
  if (!/^[0-9a-f]+$/i.test(hex)) return null
  const colors = {} as ThemeColors
  colorKeys.forEach((key, index) => {
    const chunk = hex.slice(index * 12, index * 12 + 12)
    colors[key] = { light: normalizeHex(chunk.slice(0, 6))!, dark: normalizeHex(chunk.slice(6))! }
  })
  const radiusScale = Number(radius) / 100
  return {
    name: name ? decodeURIComponent(name) : "my-brand",
    colors,
    radiusScale: Number.isFinite(radiusScale) ? Math.min(1.6, Math.max(0.5, radiusScale)) : 1,
    font: fontIds.includes(font as FontId) ? (font as FontId) : "system",
  }
}

export {
  decodeTheme,
  defaultTheme,
  encodeTheme,
  exportCss,
  exportTypeScript,
  fontIds,
  fonts,
  presets,
  slugify,
  toThemeSeeds,
}
export type { FontId, Preset, StudioTheme }
