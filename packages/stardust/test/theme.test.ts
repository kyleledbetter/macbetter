import { expect, test } from "vitest"
import { contrastRatio, createTheme, themeVariables } from "../src/lib/theme"

test("a theme becomes one rule of custom properties", () => {
  const css = createTheme("acme", {
    accent: { light: "#0055ff", dark: "#6699ff" },
    onAccent: "#ffffff",
    radiusScale: 1.2,
    palette: { green: "#00aa55" },
  })

  expect(css).toContain('[data-theme="acme"] {')
  expect(css).toContain("--sd-accent: light-dark(#0055ff, #6699ff);")
  expect(css).toContain("--sd-on-accent: #ffffff;")
  expect(css).toContain("--sd-radius-scale: 1.2;")
  expect(css).toContain("--sd-green: #00aa55;")
})

test("unset seeds are left to the defaults", () => {
  expect(Object.keys(themeVariables({ accent: "#ff0000" }))).toEqual(["--sd-accent"])
})

test("the Dreambase accent pairs hold 4.5:1", () => {
  expect(contrastRatio("#0a1c13", "#ee5700")).toBeGreaterThanOrEqual(4.5)
  expect(contrastRatio("#0a1c13", "#f67f01")).toBeGreaterThanOrEqual(4.5)
  expect(contrastRatio("#b84300", "#ffffff")).toBeGreaterThanOrEqual(4.5)
  expect(contrastRatio("#f9943c", "#0a1c13")).toBeGreaterThanOrEqual(4.5)
})
