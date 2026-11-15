import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test, vi } from "vitest"
import {
  defaultLightSwatches,
  kelvinToMired,
  LightColorPicker,
  lightSwatchColor,
  miredToKelvin,
} from "../src/components/light-color-picker"

test("converts between kelvin and HomeKit's mireds", () => {
  expect(kelvinToMired(3200)).toBe(313)
  expect(miredToKelvin(370)).toBe(2700)
  expect(lightSwatchColor({ id: "b", label: "Blue", kind: "color", hue: 215, saturation: 90 })).toBe("hsl(215 90% 55%)")
  expect(lightSwatchColor(defaultLightSwatches[1])).toContain("color-mix")
})

test("draws a named radio per swatch in a named group", () => {
  const { container } = render(<LightColorPicker defaultValue="warm" />)
  expect(screen.getByRole("radiogroup", { name: "Color" }).className).toContain("mb-light-color-picker")
  expect(container.querySelectorAll(".mb-light-color-picker-swatch")).toHaveLength(10)
  const warm = screen.getByRole("radio", { name: "Warm white, 2700 K" })
  expect(warm.getAttribute("aria-checked")).toBe("true")
  expect(warm.dataset.kind).toBe("temperature")
  expect(screen.getByRole("radio", { name: "Blue" }).dataset.kind).toBe("color")
})

test("the arrow keys move the choice and report the swatch id", async () => {
  const user = userEvent.setup()
  const onValueChange = vi.fn()
  render(<LightColorPicker defaultValue="warm" onValueChange={onValueChange} />)
  screen.getByRole("radio", { name: "Warm white, 2700 K" }).focus()
  await user.keyboard("{ArrowRight}")
  expect(onValueChange).toHaveBeenLastCalledWith("soft")
})
