import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test } from "vitest"
import { ColorWell } from "../src/components/color-well"

test("the well opens the editor, which edits the color, and Escape closes it", async () => {
  const user = userEvent.setup()
  render(<ColorWell aria-label="Highlight color" defaultValue="#ee5700" presets={["#007aff"]} />)

  const well = screen.getByRole("button", { name: "Highlight color" })
  expect(well.className).toBe("sd-color-well-trigger")
  await user.click(well)
  expect(well.hasAttribute("data-open")).toBe(true)

  const hex = screen.getByRole("textbox", { name: "Hex" }) as HTMLInputElement
  expect(hex.value.toLowerCase()).toBe("#ee5700")
  expect(screen.getAllByRole("slider").length).toBeGreaterThanOrEqual(3)
  await user.click(screen.getByRole("option"))
  expect(hex.value.toLowerCase()).toBe("#007aff")

  await user.keyboard("{Escape}")
  expect(well.hasAttribute("data-open")).toBe(false)
})

test("leaves out the opacity slider and presets when asked", async () => {
  const user = userEvent.setup()
  render(<ColorWell aria-label="Text color" alpha={false} presets={[]} />)
  await user.click(screen.getByRole("button", { name: "Text color" }))
  expect(screen.queryByRole("slider", { name: "Alpha" })).toBeNull()
  expect(screen.queryByRole("listbox")).toBeNull()
})
