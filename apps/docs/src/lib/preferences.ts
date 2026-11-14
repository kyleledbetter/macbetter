import { createColorScheme, createLocalStorage, createPreference } from "@ui-sdk/core"

const themes = ["dreambase", "system", "nebula", "graphite"] as const
type ThemeName = (typeof themes)[number]

const themeLabels: Record<ThemeName, string> = {
  dreambase: "Dreambase",
  system: "System",
  nebula: "Nebula",
  graphite: "Graphite",
}

const colorScheme = createColorScheme({
  defaultValue: "dark",
  global: true,
  storage: createLocalStorage("stardust-scheme"),
})

const theme = createPreference({
  values: themes,
  defaultValue: "dreambase",
  attribute: "data-theme",
  global: true,
  storage: createLocalStorage("stardust-theme"),
})

export { colorScheme, theme, themeLabels, themes }
export type { ThemeName }
