import { createColorScheme, createLocalStorage, createPreference } from "@ui-sdk/core"

const themes = ["ember", "system", "nebula", "graphite"] as const
type ThemeName = (typeof themes)[number]

const themeLabels: Record<ThemeName, string> = {
  ember: "Ember",
  system: "System",
  nebula: "Nebula",
  graphite: "Graphite",
}

const colorScheme = createColorScheme({
  defaultValue: "dark",
  global: true,
  storage: createLocalStorage("macbetter-scheme"),
})

const theme = createPreference({
  values: themes,
  defaultValue: "ember",
  attribute: "data-theme",
  global: true,
  storage: createLocalStorage("macbetter-theme"),
})

// Whether the site follows the system's Reduce Motion and Reduce Transparency settings.
const motion = createPreference({
  values: ["system", "full"],
  defaultValue: "system",
  attribute: "data-motion",
  global: true,
  storage: createLocalStorage("macbetter-motion"),
})

const transparency = createPreference({
  values: ["system", "full"],
  defaultValue: "system",
  attribute: "data-transparency",
  global: true,
  storage: createLocalStorage("macbetter-transparency"),
})

export { colorScheme, motion, theme, themeLabels, themes, transparency }
export type { ThemeName }
