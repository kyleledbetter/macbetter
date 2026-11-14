import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test } from "vitest"
import { Toggle, ToggleGroup, ToggleIcon } from "../src/components/toggle"

test("presses and releases from a click and from the keyboard", async () => {
  const user = userEvent.setup()
  render(<Toggle variant="bezeled">Show Invisibles</Toggle>)

  const toggle = screen.getByRole("button", { name: "Show Invisibles" })
  expect(toggle.getAttribute("aria-pressed")).toBe("false")
  await user.click(toggle)
  expect(toggle.getAttribute("aria-pressed")).toBe("true")
  await user.keyboard(" ")
  expect(toggle.getAttribute("aria-pressed")).toBe("false")
})

test("carries its variant, tone and size, and wraps bare text in a label span", () => {
  render(
    <Toggle variant="bezeled" tone="accent" size="lg" className="mine">
      Watching
    </Toggle>
  )
  const toggle = screen.getByRole("button", { name: "Watching" })
  expect(toggle.className).toBe("sd-toggle mine")
  expect(toggle.dataset.variant).toBe("bezeled")
  expect(toggle.dataset.tone).toBe("accent")
  expect(toggle.dataset.size).toBe("lg")
  expect(toggle.querySelector(".sd-toggle-label")?.textContent).toBe("Watching")
})

test("a toggle inside a group leaves variant and size to the group", () => {
  render(
    <ToggleGroup variant="bezeled" size="sm" aria-label="Text style">
      <Toggle value="bold" aria-label="Bold">
        <ToggleIcon>
          <svg />
        </ToggleIcon>
      </Toggle>
    </ToggleGroup>
  )
  const group = screen.getByRole("group", { name: "Text style" })
  expect(group.className).toBe("sd-toggle-group")
  expect(group.dataset.variant).toBe("bezeled")
  expect(group.dataset.size).toBe("sm")
  const bold = screen.getByRole("button", { name: "Bold" })
  expect(bold.hasAttribute("data-variant")).toBe(false)
  expect(bold.querySelector(".sd-toggle-icon")).not.toBeNull()
})

test("arrow keys move between a group's toggles", async () => {
  const user = userEvent.setup()
  render(
    <ToggleGroup multiple aria-label="Text style">
      <Toggle value="bold">Bold</Toggle>
      <Toggle value="italic">Italic</Toggle>
    </ToggleGroup>
  )
  await user.tab()
  expect(document.activeElement).toBe(screen.getByRole("button", { name: "Bold" }))
  await user.keyboard("{ArrowRight}")
  expect(document.activeElement).toBe(screen.getByRole("button", { name: "Italic" }))
})
