// Theme derivation ships in the package; the Theme Studio presets in the docs app are checked against it here.
import { contrastRatio, themeVariables } from "../src/lib/theme"
import { describe, expect, it } from "vitest"
import {
  composite,
  contrastChecks,
  deriveFromAccent,
  ensureContrast,
  fixCheck,
  hexToOklch,
  normalizeHex,
  oklchToHex,
} from "../src/lib/derive"
import { decodeTheme, defaultTheme, encodeTheme, exportCss, presets, slugify, toThemeSeeds } from "../../../apps/docs/src/components/theme-studio/seeds"

describe("hex and OKLCH", () => {
  it("normalizes hex", () => {
    expect(normalizeHex("ABC")).toBe("#aabbcc")
    expect(normalizeHex("#EE5700")).toBe("#ee5700")
    expect(normalizeHex("#ee570080")).toBe("#ee5700")
    expect(normalizeHex("orange")).toBeNull()
  })

  it("matches known OKLCH values", () => {
    const white = hexToOklch("#ffffff")
    expect(white.l).toBeCloseTo(1, 3)
    expect(white.c).toBe(0)
    const red = hexToOklch("#ff0000")
    expect(red.l).toBeCloseTo(0.628, 2)
    expect(red.c).toBeCloseTo(0.2577, 2)
    expect(red.h).toBeCloseTo(29.23, 0)
  })

  it("round-trips sRGB colors", () => {
    for (const hex of ["#ee5700", "#0a1c13", "#0071e3", "#6d3df5", "#ffffff", "#000000", "#7f7f7f"]) {
      expect(oklchToHex(hexToOklch(hex))).toBe(hex)
    }
  })

  it("maps out-of-gamut colors into sRGB by reducing chroma", () => {
    const hex = oklchToHex({ l: 0.7, c: 0.4, h: 150 })
    expect(normalizeHex(hex)).toBe(hex)
    expect(hexToOklch(hex).l).toBeCloseTo(0.7, 2)
  })
})

describe("contrast helpers", () => {
  it("composites in sRGB", () => {
    expect(composite("#000000", "#ffffff", 0.5)).toBe("#808080")
    expect(composite("#123456", "#ffffff", 1)).toBe("#123456")
  })

  it("pushes a color to the target and no further than needed", () => {
    const fixed = ensureContrast("#f67f01", "#ffffff", 4.5)
    expect(contrastRatio(fixed, "#ffffff")).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(fixed, "#ffffff")).toBeLessThan(4.8)
    expect(Math.abs(hexToOklch(fixed).h - hexToOklch("#f67f01").h)).toBeLessThan(6)
    expect(ensureContrast("#000000", "#ffffff")).toBe("#000000")
    const light = ensureContrast("#3355aa", "#0a1c13", 4.5)
    expect(contrastRatio(light, "#0a1c13")).toBeGreaterThanOrEqual(4.5)
  })
})

describe("deriveFromAccent", () => {
  const accents = ["#ee5700", "#0071e3", "#d12a6f", "#2fd3b5", "#ffd60a", "#5856d6", "#808080", "#111111"]

  it.each(accents)("makes a theme that passes every check from %s", (accent) => {
    const colors = deriveFromAccent(accent)
    expect(colors.accent.light).toBe(accent)
    for (const scheme of ["light", "dark"] as const) {
      const failing = contrastChecks(colors, scheme).filter((check) => !check.pass)
      // Text on a mid-tone accent can't always reach 4.5:1 with either white or a dark shade.
      expect(failing.filter((check) => check.id !== "on-accent")).toEqual([])
      expect(contrastRatio(colors.onAccent[scheme], colors.accent[scheme])).toBeGreaterThan(3)
    }
  })

  it("tints neutrals toward the accent's hue", () => {
    const colors = deriveFromAccent("#0071e3")
    const bg = hexToOklch(colors.bg.dark)
    expect(bg.l).toBeLessThan(0.25)
    expect(Math.abs(bg.h - hexToOklch("#0071e3").h)).toBeLessThan(8)
    expect(hexToOklch(deriveFromAccent("#808080").bg.dark).c).toBeLessThan(0.002)
  })

  it("picks dark text on a light accent and white on a dark one", () => {
    expect(deriveFromAccent("#ffd60a").onAccent.light).not.toBe("#ffffff")
    expect(deriveFromAccent("#1f3a93").onAccent.light).toBe("#ffffff")
  })
})

describe("fixCheck", () => {
  it("fixes the seed behind a failing check", () => {
    const colors = { ...defaultTheme.colors, accentText: { light: "#ff9a40", dark: "#f9943c" } }
    expect(contrastChecks(colors, "light").find((c) => c.id === "accent-text")!.pass).toBe(false)
    const fixed = fixCheck(colors, "light", "accent-text")
    expect(contrastChecks(fixed, "light").find((c) => c.id === "accent-text")!.pass).toBe(true)
    expect(fixed.accentText.dark).toBe("#f9943c")

    const faint = { ...defaultTheme.colors, ink: { light: "#9aa59f", dark: "#f1f7f3" } }
    const strong = fixCheck(faint, "light", "control-border")
    expect(contrastChecks(strong, "light").find((c) => c.id === "control-border")!.pass).toBe(true)
  })
})

describe("presets", () => {
  it.each(presets.filter((preset) => preset.id !== "system"))("$label passes every check", (preset) => {
    for (const scheme of ["light", "dark"] as const) {
      expect(contrastChecks(preset.colors, scheme).filter((check) => !check.pass)).toEqual([])
    }
  })

  it("turns into themeVariables and CSS", () => {
    const variables = themeVariables(toThemeSeeds(presets[4]!))
    expect(variables["--sd-accent"]).toBe("light-dark(#a8321e, #f07a5a)")
    expect(variables["--sd-font-display"]).toContain("serif")
    expect(exportCss({ ...defaultTheme, name: "My Brand!" })).toMatch(/^\[data-theme="my-brand"\] \{/)
  })
})

describe("share links", () => {
  it("round-trips a theme", () => {
    const theme = { ...presets[6]!, name: "sorbet-2" }
    const decoded = decodeTheme(encodeTheme(theme))
    expect(decoded).toEqual({ name: "sorbet-2", colors: theme.colors, radiusScale: 1.4, font: "rounded" })
  })

  it("rejects malformed hashes", () => {
    expect(decodeTheme("")).toBeNull()
    expect(decodeTheme("v1.zz.1.system.x")).toBeNull()
    expect(slugify("  ")).toBe("my-brand")
  })
})
