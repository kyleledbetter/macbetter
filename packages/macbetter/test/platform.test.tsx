import { render } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"
import { MacbetterScript, platformScript } from "../src/lib/platform"

afterEach(() => {
  document.documentElement.removeAttribute("data-platform")
  vi.unstubAllGlobals()
})

test("sets the platform when rendered on the client, where the inline script doesn't run", () => {
  render(<MacbetterScript platform="ios" />)
  expect(document.documentElement.getAttribute("data-platform")).toBe("ios")
})

test("prefers a saved choice", () => {
  vi.stubGlobal("localStorage", { getItem: (key: string) => (key === "platform" ? "ipados" : null) })
  render(<MacbetterScript platform="macos" storageKey="platform" />)
  expect(document.documentElement.getAttribute("data-platform")).toBe("ipados")
})

test("gives the same script as a string for index.html", () => {
  const code = platformScript({ platform: "ios" })
  expect(code).toContain('p="ios"')
  new Function(code)()
  expect(document.documentElement.getAttribute("data-platform")).toBe("ios")
})
